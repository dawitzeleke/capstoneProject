import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppHeader from "@/components/teacher/Header";
import SearchFilter from "@/components/teacher/SearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { toggleSelection, deleteQuestion } from "@/redux/teacherReducer/contentSlice";
import ManageQuestionCard from "@/components/teacher/ManageQuestionCard";
import QuestionPreviewModal from "@/components/teacher/popups/QuestionPreviewModal";
import { DeleteConfirmationModal } from "@/components/teacher/popups/DeleteConfirmationModal";
import { SuccessToast } from "@/components/teacher/popups/SuccessToast";

interface QuestionItem {
  id: string;
  question: string;
  options: string[];
  status: "draft" | "posted";
  date: string;
}

const ContentListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { questions, selectedIds } = useSelector(
    (state: RootState) => state.content
  );
  const [previewQuestion, setPreviewQuestion] = useState<QuestionItem | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "posted" | "draft">("all");
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionItem[]>(
    []
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<QuestionItem | null>(
    null
  );
  const [setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);


  const { width } = useWindowDimensions();
  const [showSearch, setShowSearch] = useState(false);


  const [displayQuestions, setDisplayQuestions] = useState<QuestionItem[]>([]);

  useEffect(() => {
    setFilteredQuestions(questions);
  }, [questions]);

  useEffect(() => {
    const tabFiltered =
      activeTab === "all"
        ? filteredQuestions
        : filteredQuestions.filter((item) => item.status === activeTab);
    setDisplayQuestions(tabFiltered);
  }, [activeTab, filteredQuestions]);

  const toggleSelectionHandler = (id: string) => {
    dispatch(toggleSelection(id));
  };

  // Handle delete flow
  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    
    try {
      await dispatch(deleteQuestion(itemToDelete!));
      
      // Close preview modal first
      setPreviewQuestion(null);
      
      // Show toast after modal animation completes
      setTimeout(() => {
        setShowSuccessToast(true);
        
        // Hide toast after 2 seconds
        setTimeout(() => setShowSuccessToast(false), 2000);
      }, 300); // Wait for modal close animation
    } catch (error) {
      // Handle error
    } finally {
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    let toastTimer: NodeJS.Timeout;
    
    if (showSuccessToast) {
      toastTimer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 2000);
    }
    
    return () => {
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, [showSuccessToast]);



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
                      color="#4F46E5"
                    />
                  </Pressable>
                ),
                side: "right",
                onPress: function (): void {
                  throw new Error("Function not implemented.");
                },
              },
            ]}
          />
        </View>

        {showSearch && (
          <SearchFilter
            data={questions}
            searchKeys={["question", "options", "date"]}
            onFilter={setFilteredQuestions}
            onClose={() => setShowSearch(false)}
            placeholder="Search questions, options or dates..."
          />
        )}

        <View className="flex-row m-4 bg-white rounded-lg p-1 shadow">
          {["all", "posted", "draft"].map((tab) => (
            <Pressable
              key={tab}
              className={`flex-1 py-2 rounded-md items-center ${activeTab === tab ? "bg-indigo-600" : ""
                }`}
              onPress={() => setActiveTab(tab as "all" | "posted" | "draft")}
            >
              <Text className={`${activeTab === tab ? "text-white" : "text-gray-500"
                } font-pmedium text-sm`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="px-4 pb-6">
          {displayQuestions.map((item) => (
            <ManageQuestionCard
              key={item.id}
              item={item}
              isSelected={selectedIds.includes(item.id)}
              onToggleSelection={() => toggleSelectionHandler(item.id)}
              onDelete={() => handleDelete(item.id)}
              onPreview={() => setPreviewQuestion(item)}
              loading={loading}
              onEdit={() => {
                dispatch(setEditingQuestion(item.id));
                router.push("/teacher/AddQuestion");
              }}
            />
          ))}
        </View>
      </ScrollView>


      {showDeleteModal && (
  <DeleteConfirmationModal
    visible={showDeleteModal}
    onConfirm={handleConfirmDelete}
    onCancel={() => setShowDeleteModal(false)}
  />
)}

      {/* Preview Modal */}
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
      setShowDeleteModal(true); // Don't close preview modal here
    }
  }}
  loading={loading}
/>

      <>
        <DeleteConfirmationModal
          visible={showDeleteModal}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />

        {showSuccessToast && (
          <SuccessToast message="Question deleted successfully" />
        )}
      </>
    </View>

  );
};

export default ContentListScreen;


