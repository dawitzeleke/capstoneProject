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
  selectDisplayQuestions,
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

const ContentListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Redux state
  const {
    selectedIds = [],
    activeTab = 'all',
    searchTerm = '',
    filters
  } = useSelector((state: RootState) => state.teacherQuestions);

  // Get all questions for filters
  const allQuestions = useSelector((state: RootState) => state.teacherQuestions.questions || []);

  // Get media data
  const mediaTypeFilter = useSelector((state: RootState) => state.media.mediaTypeFilter);
  const showQuestions = !mediaTypeFilter || mediaTypeFilter.length === 0 || mediaTypeFilter.includes('question');
  const showImages = !mediaTypeFilter || mediaTypeFilter.length === 0 || mediaTypeFilter.includes('image');
  const showVideos = !mediaTypeFilter || mediaTypeFilter.length === 0 || mediaTypeFilter.includes('video');

  const allMedia = useSelector((state: RootState) => [
    ...state.media.images,
    ...state.media.videos,
  ]);
  
  // Filter media based on activeTab
  const filteredMedia = allMedia.filter(item => {
    const typeMatch = (item.type === 'image' && showImages) || (item.type === 'video' && showVideos);
    const statusMatch = activeTab === 'all' || item.status === activeTab;
    return typeMatch && statusMatch;
  });

  const displayQuestions = useSelector(selectDisplayQuestions) || [];
  const filteredQuestions = showQuestions ? displayQuestions : [];
  
  // Apply search term to questions
  const searchedQuestions = filteredQuestions.filter(item => 
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
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  // Filter options
  const difficulties = [...new Set(allQuestions.map(q => q.difficulty))];
  const questionTypes = [...new Set(allQuestions.map(q => q.questionType))];
  const grades = [...new Set(allQuestions.map(q => q.grade))].sort();
  const points = [...new Set(allQuestions.map(q => q.point))].sort();

  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelectionMode(false);
    }
  }, [selectedIds]);

  const toggleSelectionHandler = (id: string) => {
    dispatch(toggleSelection(id));
  };

  const handleEditQuestion = (item: QuestionItem) => {
    dispatch(setEditingQuestion(item));
    router.push({
      pathname: "/teacher/(tabs)/AddQuestion",
      params: { questionId: item.id }
    });
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);

    if (itemToDelete) {
      const isMedia = filteredMedia.some(m => m.id === itemToDelete);
      if (isMedia) {
        const media = filteredMedia.find(m => m.id === itemToDelete);
        if (media) await dispatch(deleteMediaContent({ id: media.id, type: media.type }));
      } else {
        dispatch(deleteQuestion(itemToDelete));
      }
      setSuccessMessage("Item deleted successfully");
    } else if (selectedIds.length > 0) {
      // Bulk delete for both questions and media
      const mediaToDelete = filteredMedia.filter(m => selectedIds.includes(m.id));
      const questionsToDelete = displayQuestions.filter(q => selectedIds.includes(q.id));
      if (questionsToDelete.length > 0) {
        dispatch(deleteMultipleQuestions(questionsToDelete.map(q => q.id)));
      }
      for (const media of mediaToDelete) {
        await dispatch(deleteMediaContent({ id: media.id, type: media.type }));
      }
      setSuccessMessage(
        `${selectedIds.length} ${selectedIds.length === 1 ? 'item' : 'items'} deleted successfully`
      );
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
            difficulties={Object.values(DifficultyLevel)}
            selectedDifficulties={filters.difficulties}
            onDifficultyChange={(values) => dispatch(setDifficultyFilter(values))}
            questionTypes={Object.values(QuestionTypeEnum)}
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
            // Also update media filter if needed
            // The logic here might need refinement based on desired filtering behavior
            // For now, leaving the mediaTypeFilter dispatch commented out or adjusted if needed.
            // if (tab !== 'all') {
            //   dispatch(setMediaTypeFilter(['question', 'image', 'video']));
            // }
          }}
        />

        {/* Content List or Empty State */}
        {combinedItems.length === 0 ? (
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
        (() => {
          const selectedMedia = filteredMedia.filter(m => (itemToDelete ? [itemToDelete] : selectedIds).includes(m.id));
          const selectedQuestions = displayQuestions.filter(q => (itemToDelete ? [itemToDelete] : selectedIds).includes(q.id));
          let deleteTitle = "Delete Item?";
          let deleteMessage = "Are you sure you want to delete this item? This action cannot be undone.";
          if ((itemToDelete ? 1 : selectedIds.length) === 1) {
            if (selectedMedia.length === 1) {
              deleteTitle = "Delete Media?";
              deleteMessage = "Are you sure you want to delete this media? This action cannot be undone.";
            } else if (selectedQuestions.length === 1) {
              deleteTitle = "Delete Question?";
              deleteMessage = "Are you sure you want to delete this question? This action cannot be undone.";
            }
          } else if ((itemToDelete ? 1 : selectedIds.length) > 1) {
            if (selectedMedia.length > 0 && selectedQuestions.length > 0) {
              deleteTitle = "Delete Items?";
              deleteMessage = "Are you sure you want to delete the selected items? This action cannot be undone.";
            } else if (selectedMedia.length > 0) {
              deleteTitle = "Delete Media?";
              deleteMessage = "Are you sure you want to delete the selected media? This action cannot be undone.";
            } else if (selectedQuestions.length > 0) {
              deleteTitle = "Delete Questions?";
              deleteMessage = "Are you sure you want to delete the selected questions? This action cannot be undone.";
            }
          }
          return (
        <DeleteConfirmationModal
          visible={showDeleteModal}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          count={itemToDelete ? 1 : selectedIds.length}
              title={deleteTitle}
              message={deleteMessage}
        />
          );
        })()
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

      {showMediaPreview && (
        <MediaPreviewModal
          visible={showMediaPreview}
          media={previewMedia}
          onClose={() => setShowMediaPreview(false)}
          onEdit={() => {
            if (previewMedia) {
              router.push({ pathname: '/teacher/UploadOther', params: { mediaId: previewMedia.id } });
              setShowMediaPreview(false);
            }
          } }
          onDelete={() => {
            if (previewMedia) {
              setItemToDelete(previewMedia.id);
              setShowDeleteModal(true);
              setShowMediaPreview(false);
            }
          } }
          loading={false} mode={"preview"}        />
      )}

      {showSuccessToast && <SuccessToast message={successMessage} />}
    </View>
  );
};

export default ContentListScreen;