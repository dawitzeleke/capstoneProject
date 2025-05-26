import React, { useMemo } from 'react';
import {
  SectionList,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import { format } from 'date-fns';
import type { Notification } from '@/redux/teacherReducer/notificationsSlice';
import NotificationItem from '@/components/teacher/Notifications/NotificationItem';
import SkeletonLoader from '@/components/teacher/Notifications/SkeletonLoader';

interface Props {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  onDelete: (id: string) => void;
  onPressItem: (notification: Notification) => void;
}

const NotificationListView: React.FC<Props> = ({
  notifications,
  loading,
  error,
  refreshing,
  onRefresh,
  onDelete,
  onPressItem,
}) => {
  const sections = useMemo(() => {
    const map: Record<string, Notification[]> = {};
    notifications.forEach((n) => {
      const key = format(new Date(n.timestamp), 'MMMM d, yyyy');
      if (!map[key]) map[key] = [];
      map[key].push(n);
    });
    return Object.entries(map)
      .map(([title, data]) => ({
        title,
        data,
        date: new Date(data[0].timestamp),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [notifications]);

  if (loading && notifications.length === 0) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-white">
        <Text className="text-red-500 text-lg font-psemibold text-center">
          ⚠️ Error loading notifications
        </Text>
        <Text className="text-gray-600 mt-2 text-center">{error}</Text>
      </View>
    );
  }

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center p-8">
      <View className="bg-[#EEECFF] p-6 rounded-full mb-4">
        <Text className="text-[#4F46E5] text-3xl">📭</Text>
      </View>
      <Text className="text-gray-800 text-lg font-semibold mb-2">
        No notifications yet
      </Text>
      <Text className="text-gray-500 text-center px-8">
        Interactions will appear here
      </Text>
    </View>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderSectionHeader={({ section: { title } }) => (
        <Text className="px-4 py-2 text-gray-500 text-sm font-pmedium bg-white">
          {title}
        </Text>
      )}
      renderItem={({ item }) => (
        <NotificationItem
          notification={item}
          onDelete={onDelete}
          onPressItem={onPressItem}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#4F46E5"
        />
      }
      contentContainerStyle={
        notifications.length === 0 ? { flex: 1 } : undefined
      }
      ListEmptyComponent={!loading ? renderEmpty : null}
      className="bg-white"
    />
  );
};

export default NotificationListView;
