import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, ScrollView, Pressable, Text, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { v4 as uuidv4 } from 'uuid';
import type { AppDispatch } from '@/redux/store';

// Components
import ContentTypeSelector from '@/components/teacher/ContentTypeSelector';
import AppHeader from '@/components/teacher/AppHeader';
import TagsInput from '@/components/teacher/QuestionForm/TagsInput';
import FormActions from '@/components/teacher/QuestionForm/FormActions';
import FilePicker, { FileData } from '@/components/teacher/ContentForm/FilePicker';
import MediaPreviewModal from '@/components/teacher/popups/MediaPreviewModal';
import { SuccessModal } from '@/components/teacher/popups/SuccessModal';
import { ErrorModal } from '@/components/teacher/popups/ErrorModal';
import { CancelModal } from '@/components/teacher/popups/CancelModal';
import TitleInput from '@/components/teacher/ContentForm/TitleInput';
import DescriptionInput from '@/components/teacher/ContentForm/DescriptionInput';
import ResetFormButton from '@/components/teacher/ResetFormButton';

// Redux and Types
import { RootState } from '@/redux/store';
import { createMediaContent, updateMediaContent, setEditingMedia } from '@/redux/teacherReducer/mediaSlice';
import { MediaItem, MediaType, MediaStatus } from '@/types/mediaTypes';

const FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/quicktime', 'video/x-m4v', 'video/3gpp'],
};

const UploadOtherScreen = () => {
    const router = useRouter();
    const rawDispatch = useDispatch();
    const dispatch: AppDispatch = rawDispatch as AppDispatch;
    const { editingMedia } = useSelector((state: RootState) => state.media);
    const videoRef = useRef(null);

    // Form state
    const [formState, setFormState] = useState({
        id: uuidv4(),
        title: '',
        description: '',
        type: 'image' as MediaType,
        file: null as FileData | null,
        thumbnail: null as FileData | null,
        tags: [] as string[],
        status: 'draft' as MediaStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '',
    });

    // UI state
    const [submitted, setSubmitted] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [modalState, setModalState] = useState({
        success: false,
        error: false,
        draftSuccess: false,
        cancel: false,
        message: '',
        color: '',
    });

    // Validation
    const [validationErrors, setValidationErrors] = useState({
        title: false,
        file: false,
        tags: false,
        thumbnail: false,
    });

    // Loading states
    const [isPosting, setIsPosting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (editingMedia) {
                setFormState(prev => ({
                    ...prev,
                    ...editingMedia,
                    file: {
                        uri: editingMedia.url,
                        name: editingMedia.title,
                        type: editingMedia.type,
                        size: 0
                    },
                    thumbnail: editingMedia.thumbnailUrl ? {
                        uri: editingMedia.thumbnailUrl,
                        name: 'thumbnail',
                        type: 'image',
                        size: 0
                    } : null,
                    tags: editingMedia.tags || [],
                    status: editingMedia.status,
                }));
            }
            return () => {
                if (!editingMedia) {
                    resetForm();
                    dispatch(setEditingMedia(null));
                }
            };
        }, [editingMedia, dispatch])
    );

    useEffect(() => {
        if (submitted) validateForm();
    }, [formState, submitted]);

    // Ensure modalState.cancel is reset on unmount
    useEffect(() => {
        return () => {
            setModalState(prev => ({ ...prev, cancel: false }));
        };
    }, []);

    const validateForm = useCallback(() => {
        const errors = {
            title: !formState.title.trim(),
            file: !formState.file,
            tags: formState.tags.length === 0,
            thumbnail: formState.type === 'video' && !formState.thumbnail,
        };

        setValidationErrors(errors);
        return !Object.values(errors).some(Boolean);
    }, [formState]);

    // Map media validation errors to question validation errors structure for FormActions
    const mappedValidationErrors = {
        questionText: validationErrors.title, // Map media title error to questionText
        courseName: false, // Not applicable for media
        description: false, // Description is optional for media
        grade: false, // Not applicable for media
        difficulty: false, // Not applicable for media
        questionType: false, // Not applicable for media
        point: false, // Not applicable for media
        options: [false, false, false, false], // Not applicable for media
        explanation: false, // Not applicable for media
        tags: validationErrors.tags, // Map media tags error to tags
        correctOption: false, // Not applicable for media
        // Include other properties expected by FormActions with default false values
    };

    const handleFilePick = useCallback(async (type: 'file' | 'thumbnail') => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: type === 'file' ? FILE_TYPES[formState.type] : ['image/*'],
                copyToCacheDirectory: true,
            });

            if (result.assets?.[0]) {
                const asset = result.assets[0];
                const newFile = {
                    uri: asset.uri,
                    name: asset.name || 'unnamed_file',
                    type: asset.mimeType || (type === 'thumbnail' ? 'image/*' : FILE_TYPES[formState.type][0]),
                    size: asset.size || 0,
                };

                setFormState(prev => ({
                    ...prev,
                    [type]: newFile,
                    ...(type === 'file' && formState.type === 'video' ? { thumbnail: null } : {})
                }));
            }
        } catch (error) {
            console.error('File pick error:', error);
            setModalState({
                success: false,
                error: true,
                draftSuccess: false,
                cancel: false,
                message: 'Failed to select file. Please try again.',
                color: '',
            });
        }
    }, [formState.type]);

    // Helper to restore form state from modal media
    const restoreFormState = (media: any) => ({
        id: media.id || uuidv4(),
        title: media.title || '',
        description: media.description || '',
        type: media.type || 'image',
        file: media.file && typeof media.file === 'object' && media.file !== null
            ? media.file
            : (media.url
                ? {
                    uri: media.url,
                    name: media.title,
                    type: media.type,
                    size: 0
                }
                : null),
        thumbnail: media.thumbnail && typeof media.thumbnail === 'object' && media.thumbnail !== null
            ? media.thumbnail
            : (media.thumbnailUrl
                ? {
                    uri: media.thumbnailUrl,
                    name: 'thumbnail',
                    type: 'image',
                    size: 0
                }
                : null),
        tags: media.tags || [],
        status: media.status || 'draft',
        createdAt: media.createdAt || new Date().toISOString(),
        updatedAt: media.updatedAt || new Date().toISOString(),
        createdBy: media.createdBy || '',
    });

    const handleSubmit = useCallback(async (status: MediaStatus) => {
        setSubmitted(true);
        setModalState(prev => ({ ...prev, error: false }));

        if (!validateForm()) {
            setModalState(prev => ({
                ...prev,
                error: true,
                message: 'Please complete all required fields (*)'
            }));
            return;
        }

        try {
            status === 'posted' ? setIsPosting(true) : setIsSavingDraft(true);

            // Set status in formState for UI consistency
            setFormState(prev => ({ ...prev, status }));

            // Create FormData with proper file formatting
            const formData = new FormData();
            formData.append('title', formState.title);
            formData.append('description', formState.description || '');
            formData.append('type', formState.type);
            formData.append('status', status);
            formData.append('tags', JSON.stringify(formState.tags));

            if (formState.file) {
                formData.append('file', {
                    uri: formState.file.uri,
                    name: formState.file.name,
                    type: formState.file.type,
                } as any);
            }
            if (formState.thumbnail) {
                formData.append('thumbnail', {
                    uri: formState.thumbnail.uri,
                    name: formState.thumbnail.name,
                    type: formState.thumbnail.type,
                } as any);
            }

            let result;
            if (editingMedia) {
                result = await dispatch(updateMediaContent({
                    id: editingMedia.id,
                    type: editingMedia.type,
                    data: formData
                })).unwrap();
            } else {
                result = await dispatch(createMediaContent(formData)).unwrap();
            }

            // Use returned status if available
            setFormState((prev: any) => ({ ...prev, status: result?.status || status }));

            setModalState({
                success: true,
                error: false,
                draftSuccess: false,
                cancel: false,
                message: status === 'posted' ? "Posted Successfully!" : "Saved as Draft!",
                color: status === 'posted' ? "#22c55e" : "#4F46E5",
            });

            if (!editingMedia) resetForm();
        } catch (error: any) {
            const errorMessage = error.payload?.message || error.message || 'Submission failed. Please try again.';
            setModalState({
                success: false,
                error: true,
                draftSuccess: false,
                cancel: false,
                message: errorMessage,
                color: '',
            });
        } finally {
            setIsPosting(false);
            setIsSavingDraft(false);
        }
    }, [formState, validateForm, dispatch, editingMedia]);

    const resetForm = useCallback(() => {
        // Only reset if we're not in edit mode
        if (!editingMedia) {
            setFormState({
                id: uuidv4(),
                title: '',
                description: '',
                type: 'image' as MediaType,
                file: null,
                thumbnail: null,
                tags: [],
                status: 'draft' as MediaStatus,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: '',
            });
            setValidationErrors({ title: false, file: false, tags: false, thumbnail: false });
            setSubmitted(false);
            dispatch(setEditingMedia(null));
        }
    }, [dispatch, editingMedia]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (modalState.success || modalState.draftSuccess) {
            // Refresh media list after successful post/draft
            dispatch({ type: 'media/fetch', payload: formState.type });
            timeoutId = setTimeout(() => {
                router.push('/teacher/ContentList');
                setModalState(prev => ({
                    ...prev,
                    success: false,
                    draftSuccess: false
                }));
            }, 2000);
        }

        if (modalState.error) {
            timeoutId = setTimeout(() => {
                setModalState(prev => ({ ...prev, error: false }));
            }, 3000);
        }

        return () => timeoutId && clearTimeout(timeoutId);
    }, [modalState, router, dispatch, formState.type]);

    const handleCancel = useCallback(() => {
        setModalState(prev => ({ ...prev, cancel: true }));
    }, []);

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <AppHeader 
                  title="Upload Content" 
                  onBack={() => router.back()}
                  showResetButton={true}
                  onReset={resetForm}
                  buttons={[
                    {
                      icon: 'folder-open',
                      onPress: () => router.push("/teacher/(tabs)/ContentList"),
                      side: 'right',
                      key: 'exit-button'
                    }
                  ]}
                />
                <ContentTypeSelector currentScreen="UploadOther" />

                <View className="px-4 pt-4 mt-2">
                    {/* Media Type Selection */}
                    <View className="bg-white p-4 rounded-lg shadow mb-4">
                        <Text className="text-lg font-psemibold mb-2">Media Type</Text>
                        <View className="flex-row gap-2">
                            {Object.keys(FILE_TYPES).map((type) => (
                                <Pressable
                                    key={type}
                                    className={`px-4 py-2 rounded-full ${formState.type === type ? 'bg-indigo-600' : 'bg-slate-100'
                                        }`}
                                    onPress={() => setFormState(prev => ({
                                        ...prev,
                                        type: type as MediaType,
                                        file: null,
                                        thumbnail: null
                                    }))}
                                >
                                    <Text className={`font-pmedium ${formState.type === type ? 'text-white' : 'text-slate-600'
                                        }`}>
                                        {type.toUpperCase()}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* File Upload Section */}
                    <View className="bg-white p-4 rounded-lg shadow mb-4">
                        <Text className="text-lg font-psemibold mb-2">Media File</Text>
                        <FilePicker
                            allowedTypes={FILE_TYPES[formState.type]}
                            fileTypeLabel={formState.type}
                            onFilePicked={file => setFormState(prev => ({ ...prev, file }))}
                            error={submitted && validationErrors.file}
                        />

                        {formState.type === 'video' && (
                            <>
                                <Text className="text-lg font-psemibold mt-4 mb-2">Thumbnail</Text>
                                <FilePicker
                                    allowedTypes={FILE_TYPES.image}
                                    fileTypeLabel="image"
                                    onFilePicked={thumbnail => setFormState(prev => ({ ...prev, thumbnail }))}
                                    error={submitted && validationErrors.thumbnail}
                                />
                            </>
                        )}
                    </View>

                    {/* Media Details */}
                    <View className="bg-white p-4 rounded-lg shadow mb-4">
                        <Text className="text-lg font-psemibold mb-2">Details</Text>

                        <TitleInput
                            value={formState.title}
                            onChange={(text) => setFormState(prev => ({ ...prev, title: text }))}
                            error={validationErrors.title}
                            submitted={submitted}
                            placeholder="Enter media title"
                        />

                        <DescriptionInput
                            value={formState.description}
                            onChange={(text) => setFormState(prev => ({ ...prev, description: text }))}
                            placeholder="Enter media description"
                            error={false}
                            submitted={false}
                        />

                        <TagsInput
                            value={formState.tags || []}
                            onChange={tags => setFormState(prev => ({ ...prev, tags }))}
                            error={validationErrors.tags}
                            submitted={submitted}
                        />
                    </View>

                    <FormActions
                        onSaveDraft={() => handleSubmit('draft')}
                        onPost={() => {
                            setSubmitted(true);
                            if (validateForm()) setShowPreviewModal(true);
                        }}
                        onCancel={handleCancel}
                        isSavingDraft={isSavingDraft}
                        isPosting={isPosting}
                        validationErrors={mappedValidationErrors}
                    />
                </View>
            </ScrollView>

            {/* Modals */}
            <MediaPreviewModal
                visible={showPreviewModal}
                media={{
                    ...formState,
                    url: formState.file?.uri || '',
                    thumbnailUrl: formState.thumbnail?.uri || '',
                    createdBy: formState.createdBy || '',
                }}
                onClose={() => setShowPreviewModal(false)}
                onEdit={() => {
                    setShowPreviewModal(false);
                    setFormState(restoreFormState(formState));
                }}
                onConfirm={() => {
                    setShowPreviewModal(false);
                    handleSubmit('posted');
                }}
                loading={isPosting}
                mode={editingMedia ? 'edit' : 'create'}
                status={formState.status}
            />

            <SuccessModal
                isVisible={modalState.success}
                onDismiss={() => setModalState(prev => ({ ...prev, success: false }))}
                message={modalState.message}
                icon={formState.type === 'image' ? 'image' : 'videocam'}
                color={modalState.color}
            />

            <SuccessModal
                isVisible={modalState.draftSuccess}
                onDismiss={() => setModalState(prev => ({ ...prev, draftSuccess: false }))}
                message={modalState.message}
                icon="save"
            />

            <ErrorModal
                isVisible={modalState.error}
                message={modalState.message}
                onDismiss={() => setModalState(prev => ({ ...prev, error: false }))}
            />

            <CancelModal
                isVisible={modalState.cancel}
                onConfirm={() => {
                    resetForm();
                    router.push('/teacher/ContentList');
                    setModalState(prev => ({ ...prev, cancel: false }));
                }}
                onCancel={() => setModalState(prev => ({ ...prev, cancel: false }))}
            />

            {/* Reset Confirmation Modal (hidden button, controlled by state) */}
            {/* Removed redundant ResetFormButton component call */}
        </View>
    );
};

export default UploadOtherScreen;