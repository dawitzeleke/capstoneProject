import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';

export type NotificationType =
  | 'follower'
  | 'like'
  | 'comment'
  | 'report'
  | 'rating';

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  meta?: Record<string, unknown>;
};

// Adapter: no need to specify selectId when your entity has a field called `id`
const notificationsAdapter = createEntityAdapter<Notification>({
  sortComparer: (a: Notification, b: Notification) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
});

const initialState = notificationsAdapter.getInitialState({
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null as string | null,
});

export const fetchNotifications = createAsyncThunk<
  Notification[], // return type
  string // teacherId
>(
  'notifications/fetchAll',
  async (teacherId: string) => {
    // Simulated API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'follower',
        message: 'Abebe started following you.',
        timestamp: '2025-04-15T00:00:00Z',
        read: false,
      },
      {
        id: '2',
        type: 'report',
        message: 'Your post "Cell Biology" was flagged.',
        timestamp: '2025-03-14T00:00:00Z',
        read: false,
        meta: { postId: '123' },
      },
      {
        id: '3',
        type: 'like',
        message: 'You have 4 new likes.',
        timestamp: '2025-05-10T00:00:00Z',
        read: false,
      },
    ];

    await new Promise((res) => setTimeout(res, 800)); // Simulate delay
    return mockNotifications;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.entities[action.payload];
      if (notification) notification.read = true;
    },
    markAllAsRead(state) {
      Object.values(state.entities).forEach((n) => {
        if (n) n.read = true;
      });
    },
    removeNotification(state, action: PayloadAction<string>) {
      notificationsAdapter.removeOne(state, action.payload);
    },
    removeMultipleNotifications(state, action: PayloadAction<string[]>) {
      notificationsAdapter.removeMany(state, action.payload);
    },
    clearAll(state) {
      notificationsAdapter.removeAll(state);
    },
    receiveNotification(state, action: PayloadAction<Notification>) {
      notificationsAdapter.upsertOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        notificationsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch notifications';
      });
  },
});

export const {
  markAsRead,
  markAllAsRead,
  clearAll,
  removeNotification,
  removeMultipleNotifications,
  receiveNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

// === Selectors ===
export const {
  selectAll: selectAllNotifications,
  selectById: selectNotificationById,
  selectIds: selectNotificationIds,
} = notificationsAdapter.getSelectors((state: any) => state.notifications);

/**
 * selectFilteredNotifications
 * @param state  Redux state
 * @param filter one of NotificationType or 'all'
 */
export const selectFilteredNotifications = createSelector(
  [
    selectAllNotifications,
    (_: any, filter: NotificationType | 'all') => filter,
  ],
  (notifications, filter) =>
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filter)
);
