import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "posted" | "draft">("all");
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<QuestionItem | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [originalEditItem, setOriginalEditItem] = useState<QuestionItem | null>(null);
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



  useEffect(() => {
    setFilteredQuestions(questions);
  }, [questions]);

  // Keep this for tab filtering
  useEffect(() => {
    const tabFiltered = activeTab === 'all'
      ? filteredQuestions
      : filteredQuestions.filter(item => item.status === activeTab);
    setDisplayQuestions(tabFiltered);
  }, [activeTab, filteredQuestions]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // Add new state:
  const [displayQuestions, setDisplayQuestions] = useState<QuestionItem[]>([]);

  // Delete fun
  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteModalVisible(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      setLoading(true);
      try {
        await new Promise((resolve, reject) => {
          // Simulate potential failure
          if (Math.random() < 0.9) { // 10% chance of failure
            setTimeout(resolve, 1000);
          } else {
            setTimeout(() => reject(new Error("Delete failed. Please try again.")), 1000);
          }
        });

        setQuestions(prev => prev.filter(question => question.id !== itemToDelete));
        setSelectedIds(prev => prev.filter(id => id !== itemToDelete));
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 2000);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Delete failed");
        setShowErrorToast(true);
        setTimeout(() => {
          setShowErrorToast(false);
          setErrorMessage(null);
        }, 2000);
      } finally {
        setLoading(false);
        setDeleteModalVisible(false);
      }
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    setShowBulkDeleteModal(true);
  };

  // Bulk Delete confirmation handler
  const handleConfirmBulkDelete = async () => {
    setLoading(true);
    try {
      await new Promise((resolve, reject) => {
        if (Math.random() < 0.9) {
          setTimeout(resolve, 1000);
        } else {
          reject(new Error("Bulk delete failed. Please try again."));
        }
      });

      setQuestions(prev => prev.filter(question => !selectedIds.includes(question.id)));
      setSelectedIds([]);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Bulk delete failed");
      setShowErrorToast(true);
      setTimeout(() => {
        setShowErrorToast(false);
        setErrorMessage(null);
      }, 2000);
    } finally {
      setLoading(false);
      setShowBulkDeleteModal(false);
    }
  };

  // Clear selection handler
  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Edit fun
  const handleEdit = (id: string) => {
    const questionToEdit = questions.find((q) => q.id === id);
    if (questionToEdit) {
      setCurrentEditItem(questionToEdit);
      setOriginalEditItem(questionToEdit); // Store original values
      setShowEditModal(true);
    }
  };
  // Save the edits
  const handleSaveEdit = async () => {
    if (currentEditItem) {
      setLoading(true);
      try {
        await new Promise((resolve, reject) => {
          if (Math.random() < 0.9) {
            setTimeout(resolve, 1000);
          } else {
            reject(new Error("Save failed. Please try again."));
          }
        });

        setQuestions(prevQuestions =>
          prevQuestions.map(q => q.id === currentEditItem.id ? currentEditItem : q)
        );
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Save failed");
        setShowErrorToast(true);
        setTimeout(() => {
          setShowErrorToast(false);
          setErrorMessage(null);
        }, 2000);
      } finally {
        setLoading(false);
        setShowEditModal(false);
        setCurrentEditItem(null);
        setOriginalEditItem(null);
      }
    }
  };

  // Unsaved changes
  const hasUnsavedChanges = () => {
    if (!currentEditItem || !originalEditItem) return false;
    return JSON.stringify(currentEditItem) !== JSON.stringify(originalEditItem);
  };

  // Cancel handler for Edit modal
  const handleCancelEdit = () => {
    if (hasUnsavedChanges()) {
      setShowDiscardModal(true);
    } else {
      closeEditModal();
    }
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentEditItem(null);
    setOriginalEditItem(null);
  };


  return (

    <>
      <ScrollView style={styles.container}>
        {/* Header  */}
        <View style={styles.header}>
          <AppHeader
            title="Content Management"
            onBack={() => navigation.navigate('Home')}
            buttons={[{
              component: (
                <Pressable onPress={() => setShowSearch(!showSearch)}>
                  <Ionicons
                    name={showSearch ? "close" : "search"}
                    size={24}
                    color="#4F46E5" />
                </Pressable>
              ),
              side: 'right',
              onPress: function (): void {
                throw new Error("Function not implemented.");
              }
            }]}
          />
        </View>

        {/* Search Filter Section */}
        {showSearch && (
          <SearchFilter
            data={questions}
            searchKeys={['question', 'options', 'date']}
            onFilter={setFilteredQuestions}
            onClose={() => setShowSearch(false)}
            placeholder="Search questions, options or dates..."
          />
        )}

        {selectedIds.length > 0 && (
          <View style={styles.bulkActionsContainer}>
            <Pressable
              style={styles.bulkCancelButton}
              onPress={handleClearSelection}
              disabled={loading}
            >
              <Text style={styles.bulkCancelText}>
                Clear Selection ({selectedIds.length})
              </Text>
            </Pressable>

            <Pressable
              style={styles.bulkDeleteButton}
              onPress={handleBulkDelete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.bulkDeleteText}>
                  Delete Selected ({selectedIds.length})
                </Text>
              )}
            </Pressable>
          </View>
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
          {displayQuestions.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="document-text-outline" size={64} color="#cbd5e1" />
              <Text style={styles.emptyStateTitle}>No Items Found</Text>
              <Text style={styles.emptyStateText}>
                {filteredQuestions.length === 0
                  ? 'No results for your search'
                  : 'Start by creating a new question'}
              </Text>
              <Pressable
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('AddQuestion')}
              >
                <Ionicons name="add-circle" size={20} color="white" />
                <Text style={styles.emptyStateButtonText}>Add New Question</Text>
              </Pressable>
            </View>
          ) : (
            displayQuestions.map((item) => (
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
                    <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />
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
                    className="bg-[#d6ddff]"
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#4F46E5" />
                    ) : (
                      <Ionicons name="create-outline" size={20} color="#4F46E5" />
                    )}
                  </Pressable>

                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleDelete(item.id)}
                    className="bg-[#fdbab4]"
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#dc2626" />
                    ) : (
                      <Ionicons name="trash-outline" size={20} color="#dc2626" />
                    )}
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
              </Pressable>)
            ))}
        </View>
      </ScrollView>

      {/* success toast */}
      {showSuccessToast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>Question deleted successfully</Text>
        </View>
      )}

      {/* Delete Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setDeleteModalVisible(false);
          setItemToDelete(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Question</Text>
            <Text style={styles.deleteConfirmationText}>
              Are you sure you want to delete this question? This action cannot be undone.
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setItemToDelete(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.deleteButtonText}>Confirm Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          handleCancelEdit();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Question</Text>

            <Text style={styles.inputLabel}>Question</Text>
            <TextInput
              style={styles.input}
              value={currentEditItem?.question ?? ""}
              onChangeText={(text) => setCurrentEditItem((prev) => prev ? { ...prev, question: text } : null
              )} />

            <Text style={styles.inputLabel}>Options</Text>
            {currentEditItem?.options.map((option, index) => (
              <TextInput
                key={index}
                style={styles.input}
                value={option}
                onChangeText={(text) => {
                  const newOptions = [...currentEditItem.options];
                  newOptions[index] = text;
                  setCurrentEditItem((prev) => prev ? { ...prev, options: newOptions } : null
                  );
                }} />
            ))}

            <Text style={styles.inputLabel}>Status</Text>
            <View style={styles.statusContainer}>
              <Pressable
                style={[
                  styles.statusButton,
                  currentEditItem?.status === "draft" && styles.activeStatusButton,
                ]}
                onPress={() => setCurrentEditItem((prev) => prev ? { ...prev, status: "draft" } : null
                )}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    currentEditItem?.status === "draft" && styles.activeStatusText,
                  ]}
                >
                  Draft
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.statusButton,
                  currentEditItem?.status === "posted" && styles.activeStatusButton,
                ]}
                onPress={() => setCurrentEditItem((prev) => prev ? { ...prev, status: "posted" } : null
                )}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    currentEditItem?.status === "posted" && styles.activeStatusText,
                  ]}
                >
                  Posted
                </Text>
              </Pressable>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>


      <Modal
        visible={showDiscardModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDiscardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Unsaved Changes</Text>
            <Text style={styles.deleteConfirmationText}>
              You have unsaved changes. Are you sure you want to discard them?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDiscardModal(false)}
              >
                <Text style={styles.cancelButtonText}>Keep Editing</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={() => {
                  closeEditModal();
                  setShowDiscardModal(false);
                }}
              >
                <Text style={styles.deleteButtonText}>Discard Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Bulk Delete Modal component */}
      <Modal
        visible={showBulkDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBulkDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Selected Items</Text>
            <Text style={styles.deleteConfirmationText}>
              Are you sure you want to delete {selectedIds.length} items?
              This action cannot be undone.
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowBulkDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleConfirmBulkDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.deleteButtonText}>Confirm Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Error Toast */}
      {showErrorToast && (
        <View style={styles.errorToastContainer}>
          <Ionicons name="warning" size={16} color="white" />
          <Text style={styles.toastText}>{errorMessage ?? "Something went wrong"}</Text>
        </View>
      )}
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    backgroundColor: '#fff',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: 'center',
    marginHorizontal: 8,
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
    backgroundColor: "#4F46E5",
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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    // backgroundColor: "#f8fafc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  bulkDeleteButton: {
    flex: 1,
    backgroundColor: "#dc2626",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bulkActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  bulkDeleteText: {
    color: "white",
    fontWeight: "600",
  },
  bulkCancelButton: {
    flex: 1,
    backgroundColor: "#64748b",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bulkCancelText: {
    color: "white",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    marginLeft: 20,
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
    borderColor: "#4F46E5",
    borderWidth: 2,
    backgroundColor: "#f5f3ff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "90%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeStatusButton: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  statusButtonText: {
    color: "#64748b",
  },
  activeStatusText: {
    color: "white",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1f2937",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  cancelButtonText: {
    color: "#64748b",
  },
  saveButton: {
    backgroundColor: "#4F46E5",
  },
  saveButtonText: {
    color: "white",
  },
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toastText: {
    color: 'white',
    fontWeight: '500',
  },
  deleteConfirmationText: {
    color: '#64748b',
    marginBottom: 24,
  },
  deleteConfirmButton: {
    backgroundColor: '#dc2626',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300, // Prevents layout glitches
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  errorToastContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ContentListScreen;