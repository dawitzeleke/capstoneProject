import { Ionicons } from '@expo/vector-icons';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/teacherReducer/hooks';
import NotificationItem from '@/components/teacher/NotificationItem';
import { fetchNotifications, removeMultipleNotifications } from '@/redux/teacherReducer/notificationsSlice';
import { RootState } from '@/redux/store';
import React, { useState } from 'react';
import { format } from 'date-fns';
import type { Notification as AppNotification } from '@/redux/teacherReducer/notificationsSlice';

const NotificationsScreen = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useSelector((state: RootState) => state.notifications);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const teacherId = 'current-teacher-id';

  React.useEffect(() => {
    dispatch(fetchNotifications(teacherId));
  }, [dispatch, teacherId]);

  const handleBulkDelete = () => {
    dispatch(removeMultipleNotifications(selectedIds));
    setSelectedIds([]);
  };

  const groupedNotifications = items.reduce((acc: Record<string, AppNotification[]>, notification) => {
    const date = format(new Date(notification.timestamp), 'MMMM d, yyyy');
    if (!acc[date]) acc[date] = [];
    acc[date].push(notification);
    return acc;
  }, {});

  const groupedItems = Object.entries(groupedNotifications);

  if (status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-[#4F46E5]">Loading notifications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-white">
        <Text className="text-red-500 text-center text-lg font-medium">
          ⚠️ Error loading notifications:
        </Text>
        <Text className="text-gray-600 mt-2 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
        {selectedIds.length > 0 ? (
          <>
            <Pressable onPress={() => setSelectedIds([])} className="flex-row items-center">
              <Ionicons name="close" size={24} color="#4F46E5" />
              <Text className="text-[#4F46E5] ml-2">{selectedIds.length} selected</Text>
            </Pressable>
            <Pressable onPress={handleBulkDelete} className="bg-red-500 px-4 py-2 rounded-lg">
              <Text className="text-white">Delete</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable onPress={() => {/* navigation.goBack() */}}>
              <Ionicons name="arrow-back" size={24} color="#4F46E5" />
            </Pressable>
            <Text className="text-xl font-semibold text-gray-900">Notifications</Text>
            <Pressable onPress={() => dispatch(removeMultipleNotifications(items.map(i => i.id)))}>
              <Text className="text-[#4F46E5]">Clear All</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* List */}
      <FlatList
        data={groupedItems}
        keyExtractor={([date]) => date}
        renderItem={({ item: [date, notifications] }) => (
          <View className="px-4">
            <Text className="text-gray-500 text-sm font-medium py-3">{date}</Text>
            {notifications.map((notification: AppNotification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                isSelecting={selectedIds.length > 0}
                isSelected={selectedIds.includes(notification.id)}
                onSelect={(id) => setSelectedIds(prev => 
                  prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                )}
              />
            ))}
          </View>
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={items.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
      />
    </View>
  );
};

const EmptyState = () => (
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

export default NotificationsScreen;