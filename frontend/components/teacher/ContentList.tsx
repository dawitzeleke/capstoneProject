import { View } from "react-native";
import React from "react";
import type { QuestionItem } from "@/types/questionTypes";
import type { MediaItem } from "@/types/mediaTypes";
import ManageQuestionCard from "@/components/teacher/ManageQuestionCard";
import MediaCard from "@/components/teacher/MediaCard";
import EmptyState from "@/components/teacher/EmptyState";

interface ContentListProps {
  items: (QuestionItem | MediaItem)[];
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (item: QuestionItem | MediaItem) => void;
  selectionMode: boolean;
  setSelectionMode: (value: boolean) => void;
}

const ContentList = ({
  items,
  selectedIds,
  onToggleSelection,
  onEdit,
  onDelete,
  onPreview,
  selectionMode,
  setSelectionMode,
}: ContentListProps) => {
  if (items.length === 0) {
    return <EmptyState onPress={() => {}} />;
  }

  return (
    <View className="px-4 pb-6">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        const toggleSelection = () => onToggleSelection(item.id);
        const editItem = () => onEdit(item.id);
        const deleteItem = () => onDelete(item.id);
        const previewItem = () => onPreview(item);

        // Check if the item is a MediaItem by checking for the type property
        if ('type' in item && (item.type === 'image' || item.type === 'video')) {
          return (
            <MediaCard
              key={item.id}
              item={item as MediaItem}
              isSelected={isSelected}
              onToggleSelection={toggleSelection}
              onEdit={editItem}
              onDelete={deleteItem}
              onPreview={previewItem}
              loading={false}
              selectionMode={selectionMode}
              setSelectionMode={setSelectionMode}
            />
          );
        } else {
          // If it's not a MediaItem, it must be a QuestionItem
          return (
            <ManageQuestionCard
              key={item.id}
              item={item as QuestionItem}
              isSelected={isSelected}
              onToggleSelection={toggleSelection}
              onEdit={editItem}
              onDelete={deleteItem}
              onPreview={previewItem}
              loading={false}
              selectionMode={selectionMode}
              setSelectionMode={setSelectionMode}
            />
          );
        }
      })}
    </View>
  );
};

export default ContentList;