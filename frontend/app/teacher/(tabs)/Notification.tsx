import React, { useState } from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NotificationToolbar from '@/components/teacher/Notifications/NotificationToolbar';
import Filter from '@/components/teacher/Notifications/Filter';
import NotificationListView from '@/components/teacher/Notifications/NotificationListView';
import useNotifications from '@/redux/teacherReducer/useNotifications';

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();

  // pull in everything from the hook
  const {
    notifications,
    loading,
    error,
    refreshing,
    filter,
    onFilterChange,
    onRefresh,
    onDelete,
    onMarkAllRead,
    onClearAll,
    onPressItem,
    selectedIds,
    onClearSelection,
  } = useNotifications();

  // local UI state
  const [showFilter, setShowFilter] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Toolbar */}
      <NotificationToolbar
        count={notifications.length}
          onGoBack={() => (navigation as any).navigate('Home')}
        onFilterPress={() => setShowFilter(v => !v)}
        onMarkAllRead={onMarkAllRead}
        onClearAll={onClearAll}
      />

      {/* Filter bar */}
      {showFilter && (
        <Filter
          filter={filter}
          onChange={opt => {
            onFilterChange(opt);
            setShowFilter(false);
          }}
        />
      )}

      {/* Notification list */}
      <View className="flex-1">
        <NotificationListView
          notifications={notifications}
          loading={loading}
          error={error}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onDelete={onDelete}
          onPressItem={onPressItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
