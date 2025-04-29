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
}

const ContentList = ({
  questions,
  selectedIds,
  onToggleSelection,
  onEdit,
  onDelete,
  onPreview,
}: ContentListProps) => {
  if (questions.length === 0) {
    return <EmptyState onPress={function (): void {
      throw new Error("Function not implemented.");
    } } />;
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
          onPreview={() => onPreview(item)} loading={false}        />
      ))}
    </View>
  );
};

export default ContentList;