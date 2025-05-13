import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppHeader from "@/components/teacher/Header";
import SearchFilter from "@/components/teacher/SearchFilter";

interface QuestionItem {
  id: string;
  question: string;
  options: string[];
  status: "draft" | "posted";
  date: string;
}

const ContentListScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "posted" | "draft">("all");
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionItem[]>(
    []
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: "1",
      question: 'Which organelle is known as the "powerhouse of the cell"?',
      options: [
        "A. Nucleus",
        "B. Mitochondria",
        "C. Ribosome",
        "D. Organelles",
      ],
      status: "posted",
      date: "2024-03-15",
    },
    {
      id: "2",
      question: "What is the process of cell division called?",
      options: ["A. Mitosis", "B. Meiosis", "C. Both A and B", "D. None"],
      status: "draft",
      date: "2024-03-14",
    },
  ]);

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

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
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
              className={`flex-1 py-2 rounded-md items-center ${
                activeTab === tab ? "bg-indigo-600" : ""
              }`}
              onPress={() => setActiveTab(tab as any)}>
              <Text
                className={`${
                  activeTab === tab ? "text-white" : "text-gray-500"
                } font-pmedium text-sm`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="px-4 pb-6">
          {displayQuestions.map((item) => (
            <Pressable
              key={item.id}
              className={`bg-white rounded-lg p-4 mb-3 shadow ${
                selectedIds.includes(item.id)
                  ? "border-2 border-indigo-600 bg-indigo-50"
                  : ""
              }`}
              onLongPress={() => toggleSelection(item.id)}>
              <Pressable
                className="absolute left-2 top-2 z-10"
                onPress={() => toggleSelection(item.id)}>
                <Ionicons
                  name={
                    selectedIds.includes(item.id)
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={24}
                  color={selectedIds.includes(item.id) ? "#4F46E5" : "#cbd5e1"}
                />
              </Pressable>

              <Text className="text-xs text-gray-500 ml-6 mb-1">
                {new Date(item.date).toLocaleDateString()}
              </Text>
              <Text className="text-base font-pmedium text-gray-800 mb-3">
                {item.question}
              </Text>

              <View className="mb-4">
                {item.options.map((option, index) => (
                  <Text
                    key={`${item.id}-${index}`}
                    className="text-sm text-gray-600 mb-1">
                    {option}
                  </Text>
                ))}
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <Pressable
                  className="p-2 rounded-lg bg-indigo-100"
                  onPress={() => console.log("Edit")}
                  disabled={loading}>
                  <Ionicons name="create-outline" size={20} color="#4F46E5" />
                </Pressable>

                <Pressable
                  className="p-2 rounded-lg bg-red-200"
                  onPress={() => console.log("Delete")}
                  disabled={loading}>
                  <Ionicons name="trash-outline" size={20} color="#dc2626" />
                </Pressable>
              </View>

              <View
                className={`absolute top-2 right-2 px-2 py-1 rounded ${
                  item.status === "draft" ? "bg-yellow-100" : "bg-blue-100"
                }`}>
                <Text className="text-xs font-pmedium">
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ContentListScreen;
