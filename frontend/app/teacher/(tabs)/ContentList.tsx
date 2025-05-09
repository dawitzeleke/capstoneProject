import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable } from "react-native";
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
} from "@/redux/teacherReducer/contentSlice";
import { deleteMedia, deleteMultipleMedia, selectDisplayMedia } from "@/redux/teacherReducer/mediaSlice";
import TabSwitcher from "@/components/teacher/TabSwitcher";
import ContentList from "@/components/teacher/ContentList";
import EmptyState from "@/components/teacher/EmptyState";
import type { QuestionItem } from "@/types";
import type { MediaItem } from "@/types/mediaTypes";
import BulkActionsBar from "@/components/teacher/BulkActionsBar";

const ContentListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIds, activeTab, searchTerm } = useSelector(
    (state: RootState) => state.content
  );
 

  const [previewQuestion, setPreviewQuestion] = useState<QuestionItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);

  

  const router = useRouter();

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
            // Check if the item is a media item
            const isMedia = displayMedia.some(m => m.id === itemToDelete);
            if (isMedia) {
                dispatch(deleteMedia(itemToDelete));
            } else {
                dispatch(deleteQuestion(itemToDelete));
            }
            setSuccessMessage("Item deleted successfully");
        } else if (selectedIds.length > 0) {
            const count = selectedIds.length;
            dispatch(deleteMultipleQuestions(selectedIds));
            dispatch(deleteMultipleMedia(selectedIds));
            setSuccessMessage(`${count} ${count === 1 ? 'item' : 'items'} deleted successfully`);
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

  // Get sorted display items
  const displayQuestions = useSelector(selectDisplayQuestions);
  const displayMedia = useSelector(selectDisplayMedia);
  
  // Combine and sort by date descending
  const combinedItems = [...displayQuestions, ...displayMedia]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    

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

        {combinedItems.length === 0 ? (
          <EmptyState onPress={() => router.push("/teacher/AddQuestion")} />
        ) : (
          <ContentList
            items={combinedItems}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelectionHandler}
            onDelete={handleDelete}
            onPreview={(item) => {
              if ("type" in item) {
                setPreviewMedia(item);
                setShowMediaPreview(true);
              } else {
                setPreviewQuestion(item);
              }
            }}
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

      {showSuccessToast && (
        <SuccessToast message={successMessage} />
      )}
    </View>
  );
};

export default ContentListScreen;