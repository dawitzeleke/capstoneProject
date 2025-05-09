// NotificationItem.tsx
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native'; // Added Pressable
import { useDispatch } from 'react-redux';
import { markAsRead, removeNotification } from '@/redux/teacherReducer/notificationsSlice';
import type { Notification } from '@/redux/teacherReducer/notificationsSlice';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import React, { useRef } from 'react';

type Props = {
  notification: Notification;
  isSelecting: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

const NotificationItem = ({ notification, isSelecting, isSelected, onSelect }: Props) => {
  const dispatch = useDispatch();
  const swipeRef = useRef<Swipeable>(null);
  const isUnread = !notification.read;

  const handlePress = () => {
    if (isSelecting) {
      onSelect(notification.id);
    } else if (isUnread) {
      dispatch(markAsRead(notification.id));
    }
  };

  const handleDelete = () => {
    swipeRef.current?.close();
    dispatch(removeNotification(notification.id));
  };

  const renderRightActions = () => (
    <RectButton
      style={{ backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 24, marginVertical: 8, borderRadius: 8 }}
      onPress={handleDelete}
    >
      <MaterialIcons name="delete" size={24} color="white" />
    </RectButton>
  );

  const getAvatar = () => {
    return `https://ui-avatars.com/api/?name=${notification.message.split(' ')[0]}&background=4F46E5&color=fff`;
  };

  return (
    <Swipeable
      ref={swipeRef}
      enabled={!isSelecting}
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      <TouchableOpacity
        className={`p-4 mb-2 rounded-lg flex-row items-center ${
          isUnread ? 'bg-[#F5F3FF] border-l-4 border-[#4F46E5]' : 'bg-white'
        } ${isSelected ? 'bg-[#4F46E5]/10' : ''}`}
        onPress={handlePress}
        onLongPress={() => onSelect(notification.id)}
      >
        {isSelecting && (
          <MaterialIcons 
            name={isSelected ? 'check-box' : 'check-box-outline-blank'}
            size={24} 
            color="#4F46E5" 
            style={{ marginRight: 12 }}
          />
        )}

        <Image
          source={{ uri: getAvatar() }}
          className="w-10 h-10 rounded-full mr-3"
        />

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text 
              className={`text-base ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-600'}`}
              numberOfLines={2}
            >
              {notification.message}
            </Text>
            <Text className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(notification.timestamp))} ago
            </Text>
          </View>

          {notification.type === 'report' && (
            <Pressable
              className="mt-2 self-start px-3 py-1 bg-[#4F46E5] rounded-full"
              onPress={() => {/* Handle report review */}}
            >
              <Text className="text-white text-sm">Review Report</Text>
            </Pressable>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default NotificationItem;