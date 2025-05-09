import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type NotificationType = 'follower' | 'like' | 'comment' | 'report' | 'rating';

export type Notification = {
  id: string;
  type: 'follower' | 'report' | 'like' | 'comment' | 'rating' | 'invite' | 'mention';
  message: string;
  timestamp: string; 
  read: boolean;
  meta?: Record<string, unknown>;
};


interface NotificationsState {
  items: Notification[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  status: 'idle',
  error: null,
};


// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (teacherId: string) => {
    // Actual API call would go here
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'follower',
        message: 'Abebe started following you',
        timestamp: '2024-03-15T00:00:00Z',
        read: false,
      },
      {
        id: '2',
        type: 'report',
        message: 'Your post "Cell Biology" was flagged',
       timestamp: '2025-03-14T00:00:00Z',
        read: false,
        meta: { postId: '123' },
      },
    ];
    return mockNotifications;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    },
    clearAll: (state) => {
      state.items = [];
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(n => n.id !== action.payload);
    },
    removeMultipleNotifications: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(n => !action.payload.includes(n.id));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch notifications';
      });
  },
});

export const { markAsRead, clearAll, removeMultipleNotifications, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;