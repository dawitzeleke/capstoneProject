import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuestionItem {
  id: string;
  question: string;
  options: string[];
  status: "draft" | "posted";
  date: string;
}

export default function ContentListScreen() {
  const [activeTab, setActiveTab] = useState<"all" | "posted" | "draft">("all");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const filteredQuestions = questions.filter((item) => {
    const matchesTab = activeTab === "all" ? true : item.status === activeTab;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.options
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.date.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Question",
      "Are you sure you want to delete this question?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setQuestions((prev) =>
              prev.filter((question) => question.id !== id)
            );
            setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
          },
        },
      ]
    );
  };

  const handleBulkDelete = () => {
    Alert.alert(
      "Delete Selected",
      `Are you sure you want to delete ${selectedIds.length} items?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setQuestions((prev) =>
              prev.filter((question) => !selectedIds.includes(question.id))
            );
            setSelectedIds([]);
          },
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    // Implement edit logic
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Content List</Text>
        <Pressable
          onPress={() => setShowSearch(!showSearch)}
          style={styles.searchIcon}
        >
          <Ionicons name="search" size={24} color="#6D28D9" />
        </Pressable>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search questions, options or dates..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

      {selectedIds.length > 0 && (
        <Pressable style={styles.bulkDeleteButton} onPress={handleBulkDelete}>
          <Text style={styles.bulkDeleteText}>
            Delete Selected ({selectedIds.length})
          </Text>
        </Pressable>
      )}

      {/* Navigation Tabs */}
      <View style={styles.navContainer}>
        <Pressable
          style={[styles.navButton, activeTab === "all" && styles.activeNav]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.navText,
              activeTab === "all" && styles.activeNavText,
            ]}
          >
            All
          </Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, activeTab === "posted" && styles.activeNav]}
          onPress={() => setActiveTab("posted")}
        >
          <Text
            style={[
              styles.navText,
              activeTab === "posted" && styles.activeNavText,
            ]}
          >
            Posted
          </Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, activeTab === "draft" && styles.activeNav]}
          onPress={() => setActiveTab("draft")}
        >
          <Text
            style={[
              styles.navText,
              activeTab === "draft" && styles.activeNavText,
            ]}
          >
            Drafts
          </Text>
        </Pressable>
      </View>

      {/* Questions List */}
      <View style={styles.contentContainer}>
        {filteredQuestions.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.questionCard,
              selectedIds.includes(item.id) && styles.selectedCard,
            ]}
            onLongPress={() => toggleSelection(item.id)}
          >
            <Pressable
              style={styles.checkbox}
              onPress={() => toggleSelection(item.id)}
            >
              {selectedIds.includes(item.id) ? (
                <Ionicons name="checkmark-circle" size={24} color="#6D28D9" />
              ) : (
                <Ionicons name="ellipse-outline" size={24} color="#cbd5e1" />
              )}
            </Pressable>

            <Text style={styles.dateText}>
              {new Date(item.date).toLocaleDateString()}
            </Text>

            <Text style={styles.questionText}>{item.question}</Text>

            <View style={styles.optionsContainer}>
              {item.options.map((option, index) => (
                <Text key={`${item.id}-${index}`} style={styles.optionText}>
                  {option}
                </Text>
              ))}
            </View>

            <View style={styles.actionsContainer}>
              <Pressable
                style={styles.actionButton}
                onPress={() => handleEdit(item.id)}
              >
                <Ionicons name="create-outline" size={20} color="#6D28D9" />
              </Pressable>

              <Pressable
                style={styles.actionButton}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
              </Pressable>
            </View>

            <View
              style={[
                styles.statusBadge,
                item.status === "draft"
                  ? styles.draftBadge
                  : styles.postedBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937",
  },
  navContainer: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  activeNav: {
    backgroundColor: "#6D28D9",
  },
  navText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeNavText: {
    color: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 12,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionText: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  actionButton: {
    padding: 6,
  },

  searchIcon: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#1f2937",
  },
  bulkDeleteButton: {
    backgroundColor: "#dc2626",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  bulkDeleteText: {
    color: "white",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  draftBadge: {
    backgroundColor: "#fef3c7",
  },
  postedBadge: {
    backgroundColor: "#dbeafe",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  draftText: {
    color: "#92400e",
  },
  postedText: {
    color: "#1e40af",
  },
  checkbox: {
    position: "absolute",
    left: 8,
    top: 8,
    zIndex: 1,
  },
  selectedCard: {
    borderColor: "#6D28D9",
    borderWidth: 2,
    backgroundColor: "#f5f3ff",
  },
});
