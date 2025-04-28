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
import { toggleSelection } from "@/redux/teacherReducer/contentSlice";
import ManageQuestionCard from "@/components/teacher/ManageQuestionCard";

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "posted" | "draft">("all");
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionItem[]>(
    []
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<QuestionItem | null>(
    null
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [originalEditItem, setOriginalEditItem] = useState<QuestionItem | null>(
    null
  );
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
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
              onEdit={() => console.log("Edit", item.id)}
              onDelete={() => console.log("Delete", item.id)}
              loading={loading}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ContentListScreen;
