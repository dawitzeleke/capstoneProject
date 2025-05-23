import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { FlaggedItem } from '@/redux/teacherReducer/teacherInsightsSlice';

interface FlaggedItemDetailPanelProps {
  isVisible: boolean;
  onClose: () => void;
  flaggedItem: FlaggedItem | null;
  onMarkSafe: (item: FlaggedItem) => void;
  onRemove: (item: FlaggedItem) => void;
}

const FlaggedItemDetailPanel: React.FC<FlaggedItemDetailPanelProps> = ({
  isVisible,
  onClose,
  flaggedItem,
  onMarkSafe,
  onRemove,
}) => {
  if (!flaggedItem) {
    return null; // Don't render if no item is selected
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-2xl p-6 h-3/4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-pmedium text-slate-800">Flagged Item Details</Text>
            <Pressable onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#64748B" />{/* slate-500 */}
            </Pressable>
          </View>

          {/* Placeholder for item details */}
          <ScrollView className="flex-1">
            <Text className="text-lg font-psemibold text-slate-700 mb-2">{flaggedItem.title}</Text>
            <Text className="text-sm text-slate-600 mb-2">Type: {flaggedItem.type}</Text>
            <Text className="text-sm text-slate-600 mb-4">Flag Type: {flaggedItem.flagType}</Text>

            <Text className="text-md font-pmedium text-slate-700 mb-2">Reports:</Text>
            {flaggedItem.reports.map((report, index) => (
              <View key={index} className="bg-slate-50 p-3 rounded-lg mb-2">
                <Text className="text-sm text-slate-700">Reported By: {report.reportedBy}</Text>
                <Text className="text-sm text-slate-700">Report Type: {report.reportType}</Text>
                {report.comment && <Text className="text-sm text-slate-700 italic">Comment: {report.comment}</Text>}
                <Text className="text-xs text-slate-500 mt-1">Date: {new Date(report.date).toLocaleDateString()}</Text>
              </View>
            ))}

            {/* Content Preview Placeholder */}
             <View className="mt-4 p-4 bg-slate-100 rounded-lg">
                <Text className="text-md font-pmedium text-slate-700 mb-2">Content Preview:</Text>
                 {flaggedItem.content ? (
                    <Text className="text-sm text-slate-600">Content preview will be implemented here based on item type (question/media).</Text>
                 ) : (
                    <Text className="text-sm text-slate-600 italic">Content not available for preview.</Text>
                 )}
             </View>

          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row justify-around mt-6">
            <Pressable
              className="bg-green-600 rounded-lg px-6 py-3 active:bg-green-700"
              onPress={() => onMarkSafe(flaggedItem)}
            >
              <Text className="text-white text-base font-pmedium">Mark as Safe</Text>
            </Pressable>
            <Pressable
              className="bg-rose-600 rounded-lg px-6 py-3 active:bg-rose-700"
              onPress={() => onRemove(flaggedItem)}
            >
              <Text className="text-white text-base font-pmedium">Remove Item</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Add any specific styles here if needed
});

export default FlaggedItemDetailPanel; 