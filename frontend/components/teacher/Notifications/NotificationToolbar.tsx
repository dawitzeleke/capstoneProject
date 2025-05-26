import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface Props {
  count: number;
  onFilterPress: () => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onGoBack: () => void;
}

const NotificationToolbar: React.FC<Props> = ({
  count,
  onFilterPress,
  onMarkAllRead,
  onClearAll,
  onGoBack,
}) => {
  return (
    <View className="bg-[#4F46E5] border-b border-gray-200">
      {/* Row 1: Title + Filter */}
      <View className="flex-row items-center justify-between px-4 py-3 mt-3">
        <Pressable onPress={onGoBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-xl font-psemibold text-white">
          Notifications
        </Text>
        <Pressable onPress={onFilterPress}>
          <Ionicons name="options" size={24} color="white" />
        </Pressable>
      </View>

      {/* Row 2: Subtitle + Bulk Actions */}
      <View className="flex-row items-center justify-between px-4 pb-2">
        <Text className="text-xs text-gray-100 font-pregular">
          You have {count} Notifications today.
        </Text>
        <View className="flex-row space-x-4">
          <Pressable
            onPress={onMarkAllRead}
            className="p-1"
            hitSlop={8}
          >
            <MaterialIcons name="done-all" size={22} color="white" />
          </Pressable>
          <Pressable
            onPress={onClearAll}
            className="p-1"
            hitSlop={8}
          >
            <MaterialIcons name="delete-sweep" size={22} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default NotificationToolbar;
