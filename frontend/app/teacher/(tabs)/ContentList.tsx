import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppHeader from "@/components/teacher/Header";
import SearchFilter from "@/components/teacher/SearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import QuestionPreviewModal from "@/components/teacher/popups/QuestionPreviewModal";
import MediaPreviewModal from "@/components/teacher/popups/MediaPreviewModal";
import { DeleteConfirmationModal } from "@/components/teacher/popups/DeleteConfirmationModal";
import { SuccessToast } from "@/components/teacher/popups/SuccessToast";
import {
  toggleSelection,
  deleteQuestion,
  setEditingQuestion,
  setSearchTerm,
  setActiveTab,
  clearSelections,
  deleteMultipleQuestions,
  setDifficultyFilter,
  setTypeFilter,
  setGradeFilter,
  setPointFilter,
  clearEditingQuestion
} from "@/redux/teacherReducer/teacherQuestionSlice";
import {
  deleteMediaContent,
  selectDisplayMedia,
  clearMediaSelections,
  setMediaTypeFilter,
  setEditingMedia
} from "@/redux/teacherReducer/mediaSlice";
import TabSwitcher from "@/components/teacher/TabSwitcher";
import ContentList from "@/components/teacher/ContentList";
import EmptyState from "@/components/teacher/EmptyState";
import { DifficultyLevel, QuestionTypeEnum, type QuestionItem, ContentStatus } from "@/types/questionTypes";
import type { MediaItem, MediaStatus } from "@/types/mediaTypes";
import BulkActionsBar from "@/components/teacher/BulkActionsBar";
import FilterPanel from "@/components/teacher/FilterPanel";
import httpRequest from "@/util/httpRequest";

const ContentListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  // Redux state
  const {
    selectedIds = [],
    activeTab = 'all',
    searchTerm = '',
    filters
  } = useSelector((state: RootState) => state.teacherQuestions);

  // Get media data
  const mediaTypeFilter = useSelector((state: RootState) => state.media.mediaTypeFilter);
  const showQuestions = !mediaTypeFilter || mediaTypeFilter.length === 0 || mediaTypeFilter.includes('question');
  const showImages = !mediaTypeFilter || mediaTypeFilter.length === 0 || mediaTypeFilter.includes('image');
  const showVideos = !mediaTypeFilter || mediaTypeFilter.length === 0 || mediaTypeFilter.includes('video');

  // State for API data
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use different endpoint based on active tab
      let endpoint = '/Questions';
      if (activeTab === 'draft') {
        endpoint = '/Questions/draft';
      } else if (activeTab === 'posted') {
        endpoint = '/Questions/posted-questions';
      }

      // Only build query parameters for regular questions endpoint
      let url = endpoint;
      if (activeTab !== 'draft' && activeTab !== 'posted') {
        const params = new URLSearchParams();
        if (activeTab !== 'all') {
          params.append('status', activeTab);
        }
        if (filters.difficulties.length > 0) {
          params.append('difficulty', filters.difficulties.join(','));
        }
        if (filters.questionTypes.length > 0) {
          params.append('questionType', filters.questionTypes.join(','));
        }
        if (filters.grades.length > 0) {
          params.append('grade', filters.grades.join(','));
        }
        if (filters.points.length > 0) {
          params.append('point', filters.points.join(','));
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        url = `${endpoint}?${params.toString()}`;
      }

      const response = await httpRequest(
        url,
        null,
        'GET',
        user?.token
      );

      if (response?.data) {
        setQuestions(response.data.items || []);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch media from API
  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (activeTab !== 'all') {
        params.append('status', activeTab);
      }
      if (mediaTypeFilter.length > 0) {
        params.append('type', mediaTypeFilter.join(','));
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await httpRequest(
        `/Media?${params.toString()}`,
        null,
        'GET',
        user?.token
      );

      if (response?.data) {
        setMedia(response.data.items || []);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
      setError('Failed to fetch media');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters or search term changes
  useEffect(() => {
    if (showQuestions) {
      fetchQuestions();
    }
    if (showImages || showVideos) {
      fetchMedia();
    }
  }, [activeTab, filters, searchTerm, mediaTypeFilter]);

  // Filter media based on activeTab
  const filteredMedia = media.filter(item => {
    const typeMatch = (item.type === 'image' && showImages) || (item.type === 'video' && showVideos);
    const statusMatch = activeTab === 'all' || item.status === activeTab;
    return typeMatch && statusMatch;
  });

  // Apply search term to questions
  const searchedQuestions = questions.filter(item => 
    item.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Apply search term to media
  const searchedMedia = filteredMedia.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const combinedItems = [...searchedQuestions, ...searchedMedia].sort(
    (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );

  // Local state
  const [previewQuestion, setPreviewQuestion] = useState<QuestionItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelectionMode(false);
    }
  }, [selectedIds]);

  const toggleSelectionHandler = (id: string) => {
    dispatch(toggleSelection(id));
  };

  const handleEditQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      dispatch(setEditingQuestion(question.id));
      router.push({
        pathname: "/teacher/(tabs)/AddQuestion",
        params: { questionId: question.id }
      });
    }
  };

  const handleDelete = async (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);

    if (itemToDelete) {
      const isMedia = filteredMedia.some(m => m.id === itemToDelete);
      try {
        if (isMedia) {
          const media = filteredMedia.find(m => m.id === itemToDelete);
          if (media) {
            await httpRequest(
              `/Media/${media.id}`,
              null,
              'DELETE',
              user?.token
            );
            setMedia(prev => prev.filter(m => m.id !== media.id));
          }
        } else {
          await httpRequest(
            `/Questions/${itemToDelete}`,
            null,
            'DELETE',
            user?.token
          );
          setQuestions(prev => prev.filter(q => q.id !== itemToDelete));
        }
        setSuccessMessage("Item deleted successfully");
      } catch (err) {
        console.error('Error deleting item:', err);
        setError('Failed to delete item');
      }
    } else if (selectedIds.length > 0) {
      // Bulk delete for both questions and media
      try {
        const mediaToDelete = filteredMedia.filter(m => selectedIds.includes(m.id));
        const questionsToDelete = questions.filter(q => selectedIds.includes(q.id));

        // Delete questions
        for (const question of questionsToDelete) {
          await httpRequest(
            `/Questions/${question.id}`,
            null,
            'DELETE',
            user?.token
          );
        }

        // Delete media
        for (const media of mediaToDelete) {
          await httpRequest(
            `/Media/${media.id}`,
            null,
            'DELETE',
            user?.token
          );
        }

        // Update local state
        setQuestions(prev => prev.filter(q => !selectedIds.includes(q.id)));
        setMedia(prev => prev.filter(m => !selectedIds.includes(m.id)));

        setSuccessMessage(
          `${selectedIds.length} ${selectedIds.length === 1 ? 'item' : 'items'} deleted successfully`
        );
      } catch (err) {
        console.error('Error deleting items:', err);
        setError('Failed to delete items');
      }
    }

    setPreviewQuestion(null);
    dispatch(clearSelections());
    dispatch(clearMediaSelections());
    setSelectionMode(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
    setItemToDelete(null);
  };

  const handleBulkDelete = () => {
    setItemToDelete(null);
    setShowDeleteModal(true);
  };

  const handleClearSelections = () => {
    dispatch(clearSelections());
    setSelectionMode(false);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: selectedIds.length > 0 ? 100 : 0,
        }}
      >
        {/* Header */}
        <View className="bg-white pb-2 border-b border-gray-200">
          <AppHeader
            title="Content Management"
            titleStyle={{fontFamily: 'Poppins-SemiBold'}}
            onBack={() => router.back()}
            buttons={[
              {
                key: 'filter-btn',
                component: (
                  <Pressable onPress={() => setShowFilters(!showFilters)}>
                    <Ionicons
                      name="filter"
                      size={24}
                      color={showFilters ? "#4F46E5" : "#64748b"} />
                  </Pressable>
                ),
                side: 'right',
                onPress: () => setShowFilters(!showFilters)
              },
              {
                key: 'search-btn',
                component: (
                  <Pressable onPress={() => setShowSearch(!showSearch)}>
                    <Ionicons
                      name={showSearch ? 'close' : 'search'}
                      size={24}
                      color="#4F46E5"
                    />
                  </Pressable>
                ),
                side: 'right',
                onPress: () => setShowSearch(!showSearch)
              }
            ]}
          />
        </View>

        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel
            difficulties={Object.values(DifficultyLevel).filter((value): value is DifficultyLevel => typeof value === 'number')}
            selectedDifficulties={filters.difficulties}
            onDifficultyChange={(values) => dispatch(setDifficultyFilter(values))}
            questionTypes={Object.values(QuestionTypeEnum).filter((value): value is QuestionTypeEnum => typeof value === 'number')}
            selectedTypes={filters.questionTypes}
            onTypeChange={(values) => dispatch(setTypeFilter(values))}
            grades={[]}
            selectedGrades={filters.grades}
            onGradeChange={(values) => dispatch(setGradeFilter(values))}
            points={[]}
            selectedPoints={filters.points}
            onPointChange={(values) => dispatch(setPointFilter(values))}
            onClose={() => setShowFilters(false)}
            onClearAll={() => {
              dispatch(setDifficultyFilter([]));
              dispatch(setTypeFilter([]));
              dispatch(setGradeFilter([]));
              dispatch(setPointFilter([]));
              dispatch(setMediaTypeFilter([]));
            }}
            mediaTypes={['question', 'image', 'video']}
            selectedMediaTypes={mediaTypeFilter}
            onMediaTypeChange={values => dispatch(setMediaTypeFilter(values))}
          />
        )}

        {/* Search Filter */}
        {showSearch && (
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={text => dispatch(setSearchTerm(text))}
            onClose={() => setShowSearch(false)}
            placeholder="Search questions, options or dates..."
          />
        )}

        {/* Tabs */}
        <TabSwitcher
          activeTab={activeTab}
          onTabChange={(tab: ContentStatus | MediaStatus | "all") => {
            dispatch(setActiveTab(tab));
          }}
        />

        {/* Content List or Empty State */}
        {loading ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-500">Loading...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-red-500">{error}</Text>
          </View>
        ) : combinedItems.length === 0 ? (
          <EmptyState onPress={() => {
            dispatch(clearEditingQuestion());
            dispatch(setEditingMedia(null));
            router.push("/teacher/AddQuestion");
          }} />
        ) : (
          <ContentList
            items={combinedItems}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelectionHandler}
            onDelete={handleDelete}
            onPreview={item => {
              if ('type' in item) {
                setPreviewMedia(item);
                setShowMediaPreview(true);
              } else setPreviewQuestion(item);
            }}
            onEdit={handleEditQuestion}
            selectionMode={selectionMode}
            setSelectionMode={setSelectionMode}
          />
        )}
      </ScrollView>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <BulkActionsBar
          count={selectedIds.length}
          onClear={handleClearSelections}
          onDelete={handleBulkDelete}
        />
      )}

      {/* Modals & Toasts */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          visible={showDeleteModal}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          count={itemToDelete ? 1 : selectedIds.length}
          title={(() => {
            const selectedMedia = filteredMedia.filter(m => (itemToDelete ? [itemToDelete] : selectedIds).includes(m.id));
            const selectedQuestions = questions.filter(q => (itemToDelete ? [itemToDelete] : selectedIds).includes(q.id));
            if ((itemToDelete ? 1 : selectedIds.length) === 1) {
              if (selectedMedia.length === 1) return "Delete Media?";
              if (selectedQuestions.length === 1) return "Delete Question?";
              return "Delete Item?";
            }
            if (selectedMedia.length > 0 && selectedQuestions.length > 0) return "Delete Items?";
            if (selectedMedia.length > 0) return "Delete Media?";
            if (selectedQuestions.length > 0) return "Delete Questions?";
            return "Delete Items?";
          })()}
          message={(() => {
            const selectedMedia = filteredMedia.filter(m => (itemToDelete ? [itemToDelete] : selectedIds).includes(m.id));
            const selectedQuestions = questions.filter(q => (itemToDelete ? [itemToDelete] : selectedIds).includes(q.id));
            if ((itemToDelete ? 1 : selectedIds.length) === 1) {
              if (selectedMedia.length === 1) return "Are you sure you want to delete this media? This action cannot be undone.";
              if (selectedQuestions.length === 1) return "Are you sure you want to delete this question? This action cannot be undone.";
              return "Are you sure you want to delete this item? This action cannot be undone.";
            }
            if (selectedMedia.length > 0 && selectedQuestions.length > 0) return "Are you sure you want to delete the selected items? This action cannot be undone.";
            if (selectedMedia.length > 0) return "Are you sure you want to delete the selected media? This action cannot be undone.";
            if (selectedQuestions.length > 0) return "Are you sure you want to delete the selected questions? This action cannot be undone.";
            return "Are you sure you want to delete the selected items? This action cannot be undone.";
          })()}
        />
      )}

      <QuestionPreviewModal
        visible={!!previewQuestion}
        question={previewQuestion}
        onClose={() => setPreviewQuestion(null)}
        onEdit={() => {
          if (previewQuestion) {
            dispatch(setEditingQuestion(previewQuestion.id));
            router.push("/teacher/AddQuestion");
            setPreviewQuestion(null);
          }
        }}
        onDelete={() => {
          if (previewQuestion) {
            setItemToDelete(previewQuestion.id);
            setShowDeleteModal(true);
          }
        }}
        loading={false}
        mode="preview"
      />

      {showMediaPreview && previewMedia && (
        <MediaPreviewModal
          visible={showMediaPreview}
          media={previewMedia}
          onClose={() => setShowMediaPreview(false)}
          onEdit={() => {
            if (previewMedia) {
              router.push({ pathname: '/teacher/UploadOther', params: { mediaId: previewMedia.id } });
              setShowMediaPreview(false);
            }
          }}
          onDelete={() => {
            if (previewMedia) {
              setItemToDelete(previewMedia.id);
              setShowDeleteModal(true);
              setShowMediaPreview(false);
            }
          }}
          loading={false}
          mode="preview"
        />
      )}

      {showSuccessToast && <SuccessToast message={successMessage} />}
    </View>
  );
};

export default ContentListScreen;