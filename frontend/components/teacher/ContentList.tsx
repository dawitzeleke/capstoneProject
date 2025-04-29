import { View } from "react-native";
import React from "react";
import ManageQuestionCard from "@/components/teacher/ManageQuestionCard";
import EmptyState from "@/components/teacher/EmptyState";
import type { QuestionItem } from "@/types";

interface ContentListProps {
  questions: QuestionItem[];
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (item: QuestionItem) => void;
  selectionMode: boolean;
  setSelectionMode: (value: boolean) => void;
}

const ContentList = ({
  questions,
  selectedIds,
  onToggleSelection,
  onEdit,
  onDelete,
  onPreview,
  selectionMode,
  setSelectionMode,
}: ContentListProps) => {
  if (questions.length === 0) {
    return <EmptyState onPress={() => {}} />;
  }

  return (
    <View className="px-4 pb-6">
      {questions.map((item) => (
        <ManageQuestionCard
          key={item.id}
          item={item}
          isSelected={selectedIds.includes(item.id)}
          onToggleSelection={() => onToggleSelection(item.id)}
          onEdit={() => onEdit(item.id)}
          onDelete={() => onDelete(item.id)}
          onPreview={() => onPreview(item)}
          loading={false}
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
        />
      ))}
    </View>
  );
};

export default ContentList;