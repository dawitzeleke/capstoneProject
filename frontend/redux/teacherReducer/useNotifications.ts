import { useState, useEffect, useCallback } from 'react';
import {
  fetchNotifications,
  receiveNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll,
  selectFilteredNotifications,
  Notification,
  NotificationType,
} from '@/redux/teacherReducer/notificationsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/teacherReducer/hooks';

interface UseNotificationsResult {
  notifications: Notification[];
  loading: boolean;
  error: string | null;

  filter: NotificationType | 'all';
  onFilterChange: (filter: NotificationType | 'all') => void;

  refreshing: boolean;
  onRefresh: () => void;

  selectedIds: string[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;

  onMarkAllRead: () => void;
  onClearAll: () => void;
  onClearSelection: () => void;

  onGoBack: () => void;
  onPressItem: (notification: Notification) => void;
}

const useNotifications = (
  teacherId: string = 'current-teacher-id'
): UseNotificationsResult => {
  const dispatch = useAppDispatch();

  // UI state
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mode, setMode] = useState<'view' | 'select'>('view');

  // Redux state
  const notifications = useAppSelector((state) =>
    selectFilteredNotifications(state, filter)
  );
  const loading = useAppSelector(
    (state) => state.notifications.status === 'loading'
  );
  const error = useAppSelector((state) => state.notifications.error);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchNotifications(teacherId));
  }, [dispatch, teacherId]);

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchNotifications(teacherId)).then(() => {
      setRefreshing(false);
    });
  }, [dispatch, teacherId]);

  // Real-time + polling
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket('wss://your-api.example.com/notifications');
      ws.onopen = () => {
        // guard ws in case it became null
        if (ws) {
          ws.send(JSON.stringify({ type: 'subscribe', teacherId }));
        }
      };
      ws.onmessage = (e) => {
        const newNotification: Notification = JSON.parse(e.data);
        dispatch(receiveNotification(newNotification));
      };
    } catch {
      // ignore any WebSocket errors
    }

    const poll = setInterval(
      () => dispatch(fetchNotifications(teacherId)),
      30000
    );
    return () => {
      if (ws) ws.close();
      clearInterval(poll);
    };
  }, [dispatch, teacherId]);

  // Selection handlers
  const onSelect = useCallback(
    (id: string) => {
      if (mode === 'view') setMode('select');
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    },
    [mode]
  );

  const onClearSelection = useCallback(() => {
    setSelectedIds([]);
    setMode('view');
  }, []);

  // Actions
  const onMarkAllRead = useCallback(
    () => dispatch(markAllAsRead()),
    [dispatch]
  );
  const onDelete = useCallback(
    (id: string) => dispatch(removeNotification(id)),
    [dispatch]
  );
  const onClearAll = useCallback(() => dispatch(clearAll()), [dispatch]);

  // Navigation stubs
  const onGoBack = () => {
    /* navigation.goBack() */
  };
  const onPressItem = (notification: Notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }
    /* navigate to detail */
  };

  return {
    notifications,
    loading,
    error,

    filter,
    onFilterChange: setFilter,

    refreshing,
    onRefresh,

    selectedIds,
    onSelect,
    onDelete,

    onMarkAllRead,
    onClearAll,
    onClearSelection,

    onGoBack,
    onPressItem,
  };
};

export default useNotifications;
