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
} from "@/redux/teacherReducer/teacherQuestionSlice";
import {
  deleteMedia,
  deleteMultipleMedia,
  selectDisplayMedia,
} from "@/redux/teacherReducer/mediaSlice";
import TabSwitcher from "@/components/teacher/TabSwitcher";
import ContentList from "@/components/teacher/ContentList";
import EmptyState from "@/components/teacher/EmptyState";
import { DifficultyLevel, QuestionTypeEnum, type QuestionItem } from "@/types/questionTypes";
import type { MediaItem } from "@/types/mediaTypes";
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

  // Get data from Redux
  const displayQuestions = useSelector(selectDisplayQuestions) || [];
  const displayMedia = useSelector(selectDisplayMedia) || [];
  const allQuestions = useSelector((state: RootState) => state.teacherQuestions.questions || []);

  // Filter options
  const difficulties = [...new Set(allQuestions.map(q => q.difficulty))];
  const questionTypes = [...new Set(allQuestions.map(q => q.questionType))];
  const grades = [...new Set(allQuestions.map(q => q.grade))].sort();
  const points = [...new Set(allQuestions.map(q => q.point))].sort();

  // Combined and sorted items
  const combinedItems = [...displayQuestions, ...displayMedia].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelectionMode(false);
    }
  }, [selectedIds]);

  const toggleSelectionHandler = (id: string) => {
    dispatch(toggleSelection(id));
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);

    if (itemToDelete) {
      const isMedia = displayMedia.some(m => m.id === itemToDelete);
      if (isMedia) dispatch(deleteMedia(itemToDelete));
      else dispatch(deleteQuestion(itemToDelete));
      setSuccessMessage("Item deleted successfully");
    } else if (selectedIds.length > 0) {
      const count = selectedIds.length;
      dispatch(deleteMultipleQuestions(selectedIds));
      dispatch(deleteMultipleMedia(selectedIds));
      setSuccessMessage(
        `${count} ${count === 1 ? 'item' : 'items'} deleted successfully`
      );
    }

    setPreviewQuestion(null);
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
            onBack={() => router.back()}
            buttons={[
              {
                component: (
                  <Pressable onPress={() => setShowFilters(!showFilters)}>
                    <Ionicons
                      name="filter"
                      size={24}
                      color={showFilters ? "#4F46E5" : "#64748b"} />
                  </Pressable>
                ),
                side: 'right',
                onPress: function (): void {
                  throw new Error("Function not implemented.");
                }
              },
              {
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
                onPress: () => { }
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
          onTabChange={tab => dispatch(setActiveTab(tab))}
        />

        {/* Content List or Empty State */}
        {combinedItems.length === 0 ? (
          <EmptyState onPress={() => router.push("/teacher/AddQuestion")} />
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
            onEdit={id => {
              dispatch(setEditingQuestion(id));
              router.push("/teacher/AddQuestion");
            }}
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

      {showMediaPreview && (
        <MediaPreviewModal
          visible={showMediaPreview}
          media={previewMedia}
          onClose={() => setShowMediaPreview(false)}
          onEdit={() => {
            if (previewMedia) {
              router.push(`/teacher/EditMedia?id=${previewMedia.id}`);
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
        />
      )}

      {showSuccessToast && <SuccessToast message={successMessage} />}
    </View>
  );
};

export default ContentListScreen;