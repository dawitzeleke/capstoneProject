import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import ContentTypeSelector from '@/components/teacher/ContentTypeSelector';
import AppHeader from '@/components/teacher/Header';
import TagsInput from '@/components/teacher/QuestionForm/TagsInput';
import { SuccessModal } from '@/components/teacher/popups/SuccessModal';
import { ErrorModal } from '@/components/teacher/popups/ErrorModal';
import { CancelModal } from '@/components/teacher/popups/CancelModal';
import { RootState } from '@/redux/store';
import { addMedia, updateMedia, clearEditingMedia } from '@/redux/teacherReducer/mediaSlice';
import FilePicker, { FileData } from '@/components/teacher/ContentForm/FilePicker';
import { MediaItem, MediaType, MediaStatus } from '@/types/mediaTypes';
import FormActions from '@/components/teacher/QuestionForm/FormActions';
import Video from 'react-native-video';
import { Ionicons } from '@expo/vector-icons';

const FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/quicktime', 'video/x-m4v', 'video/3gpp'],
};

const UploadOtherScreen = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const { media, editingMediaId } = useSelector((state: RootState) => state.media);

    // Form state
    const [formState, setFormState] = useState({
        id: '',
        type: 'image' as MediaType,
        uri: '',
        name: '',
        tags: [] as string[],
        status: 'draft' as MediaStatus,
        date: new Date().toISOString(),
    });

    // File picker state
    const [file, setFile] = useState<FileData | null>(null);
    const [selectedFileType, setSelectedFileType] = useState<keyof typeof FILE_TYPES>('image');

    // Video controls state
    const [isVideoPaused, setIsVideoPaused] = useState(true);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const videoRef = useRef<Video>(null);

    // Modal and loading states
    const [modalState, setModalState] = useState({
        success: false,
        error: false,
        draftSuccess: false,
        cancel: false,
        message: '',
    });

    const [validationErrors, setValidationErrors] = useState({
        file: false,
        tags: false,
    });

    const [isPosting, setIsPosting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (editingMediaId) {
                const mediaToEdit = media.find(m => m.id === editingMediaId);
                if (mediaToEdit) {
                    setFormState({
                        id: mediaToEdit.id,
                        type: mediaToEdit.type,
                        uri: mediaToEdit.uri,
                        name: mediaToEdit.name,
                        tags: mediaToEdit.tags,
                        status: mediaToEdit.status,
                        date: mediaToEdit.date,
                    });
                    setSelectedFileType(mediaToEdit.type);
                    setFile({
                        uri: mediaToEdit.uri,
                        name: mediaToEdit.name,
                        type: mediaToEdit.type,
                        size: 0, // Placeholder for size
                    });
                }
            } else {
                resetForm();
            }

            return () => {
                if (!editingMediaId) {
                    dispatch(clearEditingMedia());
                    resetForm();
                }
            };
        }, [editingMediaId, media, dispatch])
    );

    const validateForm = useCallback(() => {
        const errors = {
            file: !file,
            tags: formState.tags.length === 0,
        };

        setValidationErrors(errors);
        return !Object.values(errors).some(error => error);
    }, [file, formState.tags]);

    const handlePost = useCallback(async () => {
        setSubmitted(true);
        const isValid = validateForm();

        if (!isValid) {
            setModalState(prev => ({
                ...prev,
                error: true,
                message: 'Please select a valid file and add tags',
            }));
            return;
        }

        const mediaData: MediaItem = {
            id: editingMediaId ?? Date.now().toString(),
            type: selectedFileType,
            uri: file?.uri || '',
            name: file?.name || '',
            tags: formState.tags,
            status: 'posted',
            date: new Date().toISOString(),
        };

        setIsPosting(true);

        try {
            if (editingMediaId) {
                dispatch(updateMedia(mediaData));
            } else {
                dispatch(addMedia(mediaData));
            }

            setModalState({
                success: true,
                error: false,
                draftSuccess: false,
                cancel: false,
                message: 'Upload Successful!',
            });
            resetForm();
            setSubmitted(false);
        } catch (error) {
            setModalState({
                success: false,
                error: true,
                draftSuccess: false,
                cancel: false,
                message: error instanceof Error ? error.message : 'Upload failed',
            });
        } finally {
            setIsPosting(false);
        }
    }, [editingMediaId, file, formState.tags, selectedFileType, dispatch, validateForm]);

    const handleSaveDraft = useCallback(async () => {
        if (formState.tags.length === 0) {
            setSubmitted(true);
            setModalState(prev => ({
                ...prev,
                error: true,
                message: 'Please add at least one tag for the draft',
            }));
            return;
        }

        setIsSavingDraft(true);

        try {
            const draftMedia: MediaItem = {
                id: Date.now().toString(),
                type: selectedFileType,
                uri: file?.uri || '',
                name: file?.name || '',
                tags: formState.tags,
                status: 'draft',
                date: new Date().toISOString(),
            };

            dispatch(addMedia(draftMedia));
            setModalState(prev => ({
                ...prev,
                draftSuccess: true,
                message: 'Saved as Draft!',
            }));
            resetForm();
        } catch (error) {
            setModalState(prev => ({
                ...prev,
                error: true,
                message: error instanceof Error ? error.message : 'Saving draft failed',
            }));
        } finally {
            setIsSavingDraft(false);
        }
    }, [file, formState.tags, selectedFileType, dispatch]);

    const resetForm = useCallback(() => {
        setFormState({
            id: '',
            type: 'image',
            uri: '',
            name: '',
            tags: [],
            status: 'draft',
            date: new Date().toISOString(),
        });
        setSelectedFileType('image');
        setFile(null);
        setValidationErrors({
            file: false,
            tags: false,
        });
        setSubmitted(false);
        setIsVideoPaused(true);
        setIsVideoEnded(false);
    }, []);

    useEffect(() => {
        validateForm();
    }, [formState, validateForm]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (modalState.success || modalState.draftSuccess) {
            timeoutId = setTimeout(() => {
                router.push("/teacher/ContentList");
                setModalState(prev => ({
                    ...prev,
                    success: false,
                    draftSuccess: false,
                }));
                dispatch(clearEditingMedia());
            }, 2000);
        }

        if (modalState.error) {
            timeoutId = setTimeout(() => {
                setModalState(prev => ({ ...prev, error: false }));
                setSubmitted(false);
            }, 3000);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [modalState, router, dispatch]);

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <AppHeader title="Upload Content" onBack={() => router.push("../ContentList")} />
                <ContentTypeSelector currentScreen="UploadOther" />
                
                <View className="px-4 pt-4">
                    {/* File Type Selection */}
                    <View className="bg-white mb-4 p-4 rounded-lg shadow">
                        <Text className="text-slate-800 text-base font-psemibold mb-3">File Type</Text>
                        
                        <View className="flex-row flex-wrap gap-2 justify-center items-center mb-4">
                            {Object.keys(FILE_TYPES).map((type) => (
                                <Pressable
                                    key={type}
                                    className={`py-2 px-4 rounded-full border ${
                                        selectedFileType === type 
                                            ? 'bg-indigo-600 border-indigo-600' 
                                            : 'bg-slate-50 border-slate-200'
                                    }`}
                                    onPress={() => setSelectedFileType(type as keyof typeof FILE_TYPES)}
                                >
                                    <Text className={`text-sm font-pmedium ${
                                        selectedFileType === type ? 'text-white' : 'text-slate-500'
                                    }`}>
                                        {type.toUpperCase()}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* File Picker */}
                        <FilePicker
                            allowedTypes={FILE_TYPES[selectedFileType]}
                            fileTypeLabel={selectedFileType}
                            onFilePicked={(file) => {
                                setFile(file);
                                setValidationErrors(prev => ({ ...prev, file: false }));
                                setIsVideoPaused(true);
                                setIsVideoEnded(false);
                            }}
                            error={validationErrors.file}
                        />

                        {/* Selected File Preview */}
                        {file && (
                            <View className="mt-4 p-3 bg-indigo-50 rounded-lg">
                                <Text className="text-indigo-800 font-pmedium">
                                    Selected: {file.name} ({Math.round(file.size / 1024)}KB)
                                </Text>
                                {/* Media Preview */}
                                <View className="mt-4">
                                    {FILE_TYPES.image.includes(file.type) && (
                                        <Image
                                            source={{ uri: file.uri }}
                                            className="w-full h-48 rounded-lg object-cover"
                                            resizeMode="cover"
                                        />
                                    )}
                                    {FILE_TYPES.video.includes(file.type) && (
                                        <View className="w-full h-48 rounded-lg overflow-hidden">
                                            <Video
                                                ref={videoRef}
                                                source={{ uri: file.uri }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode="cover"
                                                controls={false}
                                                paused={isVideoPaused}
                                                onError={(error) => console.error("Video error:", error)}
                                                onReadyForDisplay={() => {
                                                    // Video is ready to play
                                                }}
                                                onEnd={() => {
                                                    setIsVideoEnded(true);
                                                    setIsVideoPaused(true);
                                                }}
                                            />
                                            {/* Video Controls */}
                                            <View className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-2">
                                                {isVideoEnded && (
                                                    <Pressable
                                                        className="flex items-center justify-center bg-black/50 rounded-lg"
                                                        onPress={() => {
                                                            setIsVideoEnded(false);
                                                            setIsVideoPaused(false);
                                                        }}
                                                    >
                                                        <Ionicons 
                                                            name="repeat" 
                                                            size={24} 
                                                            color="#4F46E5" 
                                                        />
                                                    </Pressable>
                                                )}
                                                {!isVideoEnded && (
                                                    <Pressable
                                                        className="flex items-center justify-center bg-black/50 rounded-lg"
                                                        onPress={() => {
                                                            setIsVideoPaused(!isVideoPaused);
                                                        }}
                                                    >
                                                        <Ionicons 
                                                            name={isVideoPaused ? "play-circle" : "pause-circle"} 
                                                            size={48} 
                                                            color="#4F46E5" 
                                                        />
                                                    </Pressable>
                                                )}
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Tags Input */}
                    <TagsInput
                        value={formState.tags}
                        onChange={(newTags) => {
                            setFormState(prev => ({ ...prev, tags: newTags }));
                            setValidationErrors(prev => ({ ...prev, tags: false }));
                        }}
                        placeholder="Add tags separated by comma or space"
                        error={validationErrors.tags}
                        maxLength={20}
                    />

                    {/* Form Actions */}
                    <FormActions
                        onSaveDraft={handleSaveDraft}
                        onPost={handlePost}
                        onCancel={() => setModalState(prev => ({ ...prev, cancel: true }))}
                        isSavingDraft={isSavingDraft}
                        isPosting={isPosting}
                        validationErrors={{
                            file: validationErrors.file,
                            tags: validationErrors.tags,
                        }}
                    />
                </View>
            </ScrollView>

            {/* Modals */}
            <CancelModal
                isVisible={modalState.cancel}
                onConfirm={() => {
                    setModalState(prev => ({ ...prev, cancel: false }));
                    resetForm();
                    router.push("/teacher/ContentList");
                }}
                onCancel={() => setModalState(prev => ({ ...prev, cancel: false }))}
            />

            <SuccessModal
                isVisible={modalState.success}
                onDismiss={() => setModalState(prev => ({ ...prev, success: false }))}
                icon="cloud-done"
                message={modalState.message}
                color="#22c55e"
            />

            <SuccessModal
                isVisible={modalState.draftSuccess}
                onDismiss={() => setModalState(prev => ({ ...prev, draftSuccess: false }))}
                icon="checkmark-circle"
                message={modalState.message}
                color="#3b82f6"
            />

            <ErrorModal
                isVisible={modalState.error}
                message={modalState.message}
                onDismiss={() => setModalState(prev => ({ ...prev, error: false }))}
            />
        </View>
    );
};

export default UploadOtherScreen;