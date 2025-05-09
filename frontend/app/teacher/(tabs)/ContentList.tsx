import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppHeader from "@/components/teacher/Header";
import SearchFilter from "@/components/teacher/SearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import QuestionPreviewModal from "@/components/teacher/popups/QuestionPreviewModal";
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
} from "@/redux/teacherReducer/contentSlice";
import TabSwitcher from "@/components/teacher/TabSwitcher";
import ContentList from "@/components/teacher/ContentList";
import EmptyState from "@/components/teacher/EmptyState";
import type { QuestionItem } from "@/types";
import BulkActionsBar from "@/components/teacher/BulkActionsBar";

const ContentListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIds, activeTab, searchTerm } = useSelector(
    (state: RootState) => state.content
  );
  const displayQuestions = useSelector(selectDisplayQuestions);
  const [previewQuestion, setPreviewQuestion] = useState<QuestionItem | null>(null);
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);

  const toggleSelectionHandler = (id: string) => {
    dispatch(toggleSelection(id));
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);

    if (itemToDelete) {
      dispatch(deleteQuestion(itemToDelete));
      setSuccessMessage("Question deleted successfully");
    } else if (selectedIds.length > 0) {
      const count = selectedIds.length;
      dispatch(deleteMultipleQuestions(selectedIds));
      setSuccessMessage(`${count} ${count === 1 ? 'question' : 'questions'} deleted successfully`);
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

  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelectionMode(false);
    }
  }, [selectedIds]);

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: selectedIds.length > 0 ? 100 : 0 }}>
        <View className="bg-white pb-2 border-b border-gray-200">
          <AppHeader
            title="Content Management"
            onBack={() => router.back()}
            buttons={[
              {
                component: (
                  <Pressable onPress={() => setShowSearch(!showSearch)}>
                    <Ionicons
                      name={showSearch ? "close" : "search"}
                      size={24}
                      color="#4F46E5" />
                  </Pressable>
                ),
                side: "right",
                onPress: () => { }
              },
            ]}
          />
        </View>

        {showSearch && (
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={(term: string) => dispatch(setSearchTerm(term))}
            onClose={() => setShowSearch(false)}
            placeholder="Search questions, options or dates..."
          />
        )}

        <TabSwitcher
          activeTab={activeTab}
          onTabChange={(tab) => dispatch(setActiveTab(tab))}
        />

        {displayQuestions.length === 0 ? (
          <EmptyState onPress={() => router.push("/teacher/AddQuestion")} />
        ) : (
          <ContentList
            questions={displayQuestions}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelectionHandler}
            onDelete={handleDelete}
            onPreview={setPreviewQuestion}
            onEdit={(id) => {
              dispatch(setEditingQuestion(id));
              router.push("/teacher/AddQuestion");
            }}
            selectionMode={selectionMode}
            setSelectionMode={setSelectionMode}
          />
        )}
      </ScrollView>

      {selectedIds.length > 0 && (
        <BulkActionsBar
          count={selectedIds.length}
          onClear={handleClearSelections}
          onDelete={handleBulkDelete}
        />
      )}

      {/* Modals and Toasts */}
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
      />

      {showSuccessToast && (
        <SuccessToast message={successMessage} />
      )}
    </View>
  );
};

export default ContentListScreen;