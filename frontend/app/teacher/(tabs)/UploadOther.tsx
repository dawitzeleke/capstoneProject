import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, ScrollView, Pressable, Text, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { v4 as uuidv4 } from 'uuid';

// Components
import ContentTypeSelector from '@/components/teacher/ContentTypeSelector';
import AppHeader from '@/components/teacher/Header';
import TagsInput from '@/components/teacher/QuestionForm/TagsInput';
import FormActions from '@/components/teacher/QuestionForm/FormActions';
import FilePicker, { FileData } from '@/components/teacher/ContentForm/FilePicker';
import MediaPreviewModal from '@/components/teacher/popups/MediaPreviewModal';
import { SuccessModal } from '@/components/teacher/popups/SuccessModal';
import { ErrorModal } from '@/components/teacher/popups/ErrorModal';
import { CancelModal } from '@/components/teacher/popups/CancelModal';
import TitleInput from '@/components/teacher/ContentForm/TitleInput';
import DescriptionInput from '@/components/teacher/ContentForm/DescriptionInput';

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
    const dispatch = useDispatch();
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
    });

    // UI state
    const [submitted, setSubmitted] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [modalState, setModalState] = useState({
        success: false,
        error: false,
        draftSuccess: false,
        cancel: false,
        message: '',
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
        }
    }, [formState.type]);

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

            const mediaPayload: MediaItem = {
                ...formState,
                id: editingMedia?.id || uuidv4(),
                url: formState.file?.uri || '',
                thumbnailUrl: formState.thumbnail?.uri || null,
                status,
                createdAt: editingMedia?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (editingMedia) {
                await dispatch(updateMediaContent(mediaPayload)).unwrap();
            } else {
                await dispatch(createMediaContent(mediaPayload)).unwrap();
            }

            setModalState({
                success: status === 'posted',
                error: false,
                draftSuccess: status === 'draft',
                cancel: false,
                message: status === 'draft'
                    ? 'Draft saved successfully!'
                    : 'Media uploaded successfully!',
            });

            if (!editingMedia) resetForm();
        } catch (error: any) {
            setModalState({
                success: false,
                error: true,
                draftSuccess: false,
                cancel: false,
                message: error.message || 'Submission failed. Please try again.',
            });
        } finally {
            setIsPosting(false);
            setIsSavingDraft(false);
        }
    }, [formState, validateForm, dispatch, editingMedia]);

    const resetForm = useCallback(() => {
        setFormState({
            id: uuidv4(),
            title: '',
            description: '',
            type: 'image',
            file: null,
            thumbnail: null,
            tags: [],
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        setValidationErrors({ title: false, file: false, tags: false, thumbnail: false });
        setSubmitted(false);
        dispatch(setEditingMedia(null));
    }, [dispatch]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (modalState.success || modalState.draftSuccess) {
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
    }, [modalState, router]);

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <AppHeader title="Upload Media" onBack={() => router.back()} />
                <ContentTypeSelector currentScreen="UploadOther" />

                <View className="px-4 pt-4">
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
                        onCancel={() => setModalState(prev => ({ ...prev, cancel: true }))}
                        isSavingDraft={isSavingDraft}
                        isPosting={isPosting}
                        validationErrors={validationErrors}
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
                }}
                onClose={() => setShowPreviewModal(false)}
                onConfirm={() => handleSubmit('posted')}
                loading={isPosting}
                mode={editingMedia ? 'edit' : 'create'}
                status="posted"
            />

            <SuccessModal
                isVisible={modalState.success}
                onDismiss={() => setModalState(prev => ({ ...prev, success: false }))}
                message={modalState.message}
                icon={formState.type === 'image' ? 'image' : 'videocam'}
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
                }}
                onCancel={() => setModalState(prev => ({ ...prev, cancel: false }))}
            />
        </View>
    );
};

export default UploadOtherScreen;