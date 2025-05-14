import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialIcons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/redux/teacherReducer/notificationsSlice';

interface Props {
  notification: Notification;
  onPressItem: (n: Notification) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<Props> = ({
  notification,
  onPressItem,
  onDelete,
}) => {
  const swipeRef = useRef<Swipeable>(null);
  const isUnread = !notification.read;

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  const avatarUri = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    notification.message.split(' ')[0]
  )}&background=4F46E5&color=fff`;

  const renderRightActions = () => (
    <Pressable
      onPress={() => {
        swipeRef.current?.close();
        onDelete(notification.id);
      }}
      className="bg-red-500 justify-center items-center px-4 mx-1 rounded-lg"
      style={{ height: '80%', alignSelf: 'center' }}
    >
      <MaterialIcons name="delete" size={24} color="#FFF" />
    </Pressable>
  );

  // Safely grab thumbnailUrl if present
  const thumbnailUrl =
    typeof notification.meta?.thumbnailUrl === 'string'
      ? notification.meta.thumbnailUrl
      : undefined;

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      <Pressable
        onPress={() => onPressItem(notification)}
        className="flex-row items-center px-4 py-3 bg-white"
      >
        {/* unread dot */}
        {isUnread && <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />}

        {/* avatar */}
        <Image
          source={{ uri: avatarUri }}
          className="w-10 h-10 rounded-full mr-3"
        />

        {/* text */}
        <View className="flex-1">
          <Text
            className={`text-base ${
              isUnread ? 'font-psemibold text-gray-900' : 'text-gray-600 font-pregular'
            }`}
            numberOfLines={2}
          >
            {notification.message}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(notification.timestamp))} ago
          </Text>
        </View>

        {/* optional thumbnail */}
        {thumbnailUrl && (
          <Image
            source={{ uri: thumbnailUrl }}
            className="w-12 h-12 rounded-lg ml-3"
          />
        )}
      </Pressable>
    </Swipeable>
  );
};

export default NotificationItem;
