import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
} from "react-native";
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
  setActiveTab
} from "@/redux/teacherReducer/contentSlice";
import TabSwitcher from "@/components/teacher/TabSwitcher";
import ContentList from "@/components/teacher/ContentList";
import EmptyState from "@/components/teacher/EmptyState";
import type { QuestionItem } from "@/types";

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

  const toggleSelectionHandler = (id: string) => {
    dispatch(toggleSelection(id));
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    dispatch(deleteQuestion(itemToDelete!));
    setPreviewQuestion(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
    setItemToDelete(null);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1">
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
                onPress: function (): void {
                  throw new Error("Function not implemented.");
                }
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
          <EmptyState  onPress={() => router.push("/teacher/AddQuestion")} />
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
          />
        )}
      </ScrollView>

      {/* Modals and Toasts */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          visible={showDeleteModal}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
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
        <SuccessToast message="Question deleted successfully" />
      )}
    </View>
  );
};

export default ContentListScreen;