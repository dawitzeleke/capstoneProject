// src/redux/teacherReducer/mediaSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';
import api, { MediaItem, MediaType, MediaStatus, ApiResponse } from '@/types/mediaTypes';
import { AxiosError } from 'axios';

interface MediaState {
  images: MediaItem[];
  videos: MediaItem[];
  loading: boolean;
  error: string | null;
  selectedIds: string[];
  editingMedia: MediaItem | null;
  searchTerm: string;
  filter: 'all' | MediaStatus;
}

const initialState: MediaState = {
  images: [],
  videos: [],
  loading: false,
  error: null,
  selectedIds: [],
  editingMedia: null,
  searchTerm: '',
  filter: 'all',
};

// Async Thunks with proper typing
export const createMediaContent = createAsyncThunk(
  'media/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const type = payload.get('type') as MediaType;
      const response = await api.post<ApiResponse<MediaItem>>(
        `/api/${type}-content`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<ApiResponse<never>>;
      return rejectWithValue(err.response?.data?.message || 'Failed to create media');
    }
  }
);

export const fetchAllMedia = createAsyncThunk(
  'media/fetchAll',
  async (type: MediaType, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<MediaItem[]>>(`/api/${type}-content`);
      return { type, data: response.data.data || [] };
    } catch (error) {
      const err = error as AxiosError<ApiResponse<never>>;
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch media');
    }
  }
);

export const updateMediaContent = createAsyncThunk(
  'media/update',
  async ({ id, type, ...payload }: { id: string; type: MediaType } & Partial<MediaItem>, 
  { rejectWithValue }) => {
    try {
      const response = await api.patch<ApiResponse<MediaItem>>(
        `/api/${type}-content/${id}`,
        payload
      );
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<ApiResponse<never>>;
      return rejectWithValue(err.response?.data?.message || 'Failed to update media');
    }
  }
);

export const deleteMediaContent = createAsyncThunk(
  'media/delete',
  async ({ id, type }: { id: string; type: MediaType }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/${type}-content/${id}`);
      return { id, type };
    } catch (error) {
      const err = error as AxiosError<ApiResponse<never>>;
      return rejectWithValue(err.response?.data?.message || 'Failed to delete media');
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    toggleMediaSelection: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.includes(action.payload)
        ? state.selectedIds.filter(id => id !== action.payload)
        : [...state.selectedIds, action.payload];
    },
    setEditingMedia: (state, action: PayloadAction<MediaItem | null>) => {
      state.editingMedia = action.payload;
    },
    setMediaSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setMediaFilter: (state, action: PayloadAction<'all' | MediaStatus>) => {
      state.filter = action.payload;
    },
    clearMediaSelections: (state) => {
      state.selectedIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMediaContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMediaContent.fulfilled, (state, action) => {
        state.loading = false;
        const mediaArray = action.payload.type === 'image' ? state.images : state.videos;
        mediaArray.unshift(action.payload);
      })
      .addCase(createMediaContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMedia.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.type === 'image') {
          state.images = action.payload.data;
        } else {
          state.videos = action.payload.data;
        }
      })
      .addCase(fetchAllMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMediaContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMediaContent.fulfilled, (state, action) => {
        state.loading = false;
        const mediaArray = action.payload.type === 'image' ? state.images : state.videos;
        const index = mediaArray.findIndex(m => m.id === action.payload.id);
        if (index !== -1) mediaArray[index] = action.payload;
      })
      .addCase(deleteMediaContent.fulfilled, (state, action) => {
        let mediaArray = action.payload.type === 'image' ? state.images : state.videos;
        mediaArray = mediaArray.filter(m => m.id !== action.payload.id);
        state.selectedIds = state.selectedIds.filter(id => id !== action.payload.id);
      });
  }
});

// Selectors
export const selectMediaByType = (type: MediaType) => (state: RootState) => 
  type === 'image' ? state.media.images : state.media.videos;

export const selectFilteredMedia = (type: MediaType) => (state: RootState) => {
  const media = selectMediaByType(type)(state);
  return media.filter(item => {
    const searchMatch = item.title.toLowerCase().includes(state.media.searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(state.media.searchTerm.toLowerCase()));
    const filterMatch = state.media.filter === 'all' || item.status === state.media.filter;
    return searchMatch && filterMatch;
  });
};

export const selectMediaById = (id: string, type: MediaType) => (state: RootState) =>
  selectMediaByType(type)(state).find(m => m.id === id);

export const { 
  toggleMediaSelection,
  setEditingMedia,
  setMediaSearchTerm,
  setMediaFilter,
  clearMediaSelections
} = mediaSlice.actions;

export default mediaSlice.reducer;