// src/redux/teacherReducer/mediaSlice.ts
import { createAsyncThunk, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';
import type { MediaItem, MediaType, MediaState, MediaError, MediaStatus } from '@/types/mediaTypes';
import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';
import { formatError } from '@/util/error';

// Create axios instance directly
const api = axios.create({
  baseURL: Platform.OS === 'android' || Platform.OS === 'ios' 
    ? 'https://cognify-d5we.onrender.com'
    : 'http://localhost:5019',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  },
});

const initialState: MediaState = {
  images: [],
  videos: [],
  loading: false,
  error: null,
  selectedIds: [],
  editingMedia: null,
  searchTerm: '',
  filter: 'all',
  uploadProgress: 0,
  currentUpload: undefined,
  mediaTypeFilter: [],
};

const handleApiError = (error: AxiosError<MediaError>) => ({
  code: error.response?.status || 500,
  message: error.response?.data?.message || formatError(error),
  details: error.response?.data?.details || [],
  timestamp: new Date().toISOString(),
  path: error.config?.url
});

// Async Thunks
export const createMediaContent = createAsyncThunk<
  MediaItem,
  FormData,
  { rejectValue: MediaError }
>('media/create', async (formData, { rejectWithValue }) => {
  try {
    // MOCK IMPLEMENTATION START
    // await new Promise(res => setTimeout(res, 500));
    // Build a fake MediaItem from the formData
    const type = formData.get('type') as MediaType;
    const status = formData.get('status') as MediaStatus;
    const now = new Date().toISOString();
    return {
      id: Math.random().toString(36).slice(2),
      type,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      url: (formData.get('file') as any)?.uri || 'https://placehold.co/400x400.png',
      thumbnailUrl: (formData.get('thumbnail') as any)?.uri || '',
      tags: JSON.parse(formData.get('tags') as string) || [],
      status,
      createdAt: now,
      updatedAt: now,
      createdBy: 'mock-user',
      views: 0,
    };
    // MOCK IMPLEMENTATION END

  } catch (err) {
    return rejectWithValue({
      code: 500,
      message: 'Mock error',
    });
  }
});

export const fetchMedia = createAsyncThunk<
  MediaItem[],
  MediaType,
  { rejectValue: MediaError }
>('media/fetch', async (type, { rejectWithValue }) => {
  try {
    // MOCK IMPLEMENTATION START
    // await new Promise(res => setTimeout(res, 300));
    // Return a static or locally stored array for testing
    return [];
    // MOCK IMPLEMENTATION END

  } catch (err) {
    return rejectWithValue({
      code: 500,
      message: 'Mock fetch error',
    });
  }
});

export const updateMediaContent = createAsyncThunk<
  MediaItem,
  { id: string; data: FormData; type: MediaType },
  { rejectValue: MediaError }
>('media/update', async ({ id, data, type }, { rejectWithValue }) => {
  try {
    // MOCK IMPLEMENTATION START
    // await new Promise(res => setTimeout(res, 300));
    // Build a fake updated MediaItem from the data
     const status = data.get('status') as MediaStatus;
     const now = new Date().toISOString();
     return {
       id: id,
       type: type,
       title: data.get('title') as string,
       description: data.get('description') as string,
       url: (data.get('file') as any)?.uri || 'https://placehold.co/400x400.png',
       thumbnailUrl: (data.get('thumbnail') as any)?.uri || '',
       tags: JSON.parse(data.get('tags') as string) || [],
       status: status,
       createdAt: '', // Preserve original creation date if available in state
       updatedAt: now,
       createdBy: 'mock-user', // Preserve original creator if available
       views: 0, // Preserve original views if available
     };
    // MOCK IMPLEMENTATION END

  } catch (err) {
    return rejectWithValue(handleApiError(err as AxiosError<MediaError>));
  }
});

export const deleteMediaContent = createAsyncThunk<
  { id: string; type: MediaType },
  { id: string; type: MediaType },
  { rejectValue: MediaError }
>('media/delete', async ({ id, type }, { rejectWithValue }) => {
  try {
    // MOCK IMPLEMENTATION
    // await new Promise(res => setTimeout(res, 200));
    return { id, type };
  } catch (err) {
    return rejectWithValue(handleApiError(err as AxiosError<MediaError>));
  }
});

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setMediaSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setMediaFilter: (state, action: PayloadAction<MediaState['filter']>) => {
      state.filter = action.payload;
    },
    toggleMediaSelection: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.includes(action.payload)
        ? state.selectedIds.filter(id => id !== action.payload)
        : [...state.selectedIds, action.payload];
    },
    clearMediaSelections: (state) => {
      state.selectedIds = [];
    },
    setEditingMedia: (state, action: PayloadAction<MediaItem | null>) => {
      state.editingMedia = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
      state.currentUpload = undefined;
    },
    setMediaTypeFilter: (state, action: PayloadAction<string[]>) => {
      state.mediaTypeFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMediaContent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
        state.currentUpload = {
          fileName: state.editingMedia?.title || 'New media',
          fileSize: 0,
          type: state.editingMedia?.type || 'image'
        };
      })
      .addCase(createMediaContent.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadProgress = 100;
        const mediaArray = action.payload.type === 'image' 
          ? state.images 
          : state.videos;
        mediaArray.unshift(action.payload);
      })
      .addCase(createMediaContent.rejected, (state, action) => {
        state.loading = false;
        state.uploadProgress = 0;
        state.error = action.payload?.message || 'Failed to create media';
      })
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg === 'image') {
          state.images = action.payload;
        } else {
          state.videos = action.payload;
        }
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch media';
      })
      .addCase(updateMediaContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMediaContent.fulfilled, (state, action) => {
        state.loading = false;
        const mediaArray = action.payload.type === 'image' 
          ? state.images 
          : state.videos;
        const index = mediaArray.findIndex(m => m.id === action.payload.id);
        if (index !== -1) mediaArray[index] = action.payload;
      })
      .addCase(updateMediaContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update media';
      })
      .addCase(deleteMediaContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMediaContent.fulfilled, (state, action) => {
        state.loading = false;
        const { id, type } = action.payload;
        if (type === 'image') {
          state.images = state.images.filter(m => m.id !== id);
        } else {
          state.videos = state.videos.filter(m => m.id !== id);
        }
        state.selectedIds = state.selectedIds.filter(selId => selId !== id);
      })
      .addCase(deleteMediaContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete media';
      });
  }
});

// Selectors
export const selectDisplayMedia = createSelector(
  [
    (state: RootState) => state.media.images,
    (state: RootState) => state.media.videos,
    (state: RootState) => state.media.searchTerm,
    (state: RootState) => state.media.filter,
    (state: RootState) => state.media.mediaTypeFilter
  ],
  (images, videos, searchTerm, filter, mediaTypeFilter) => {
    const combined = [...images, ...videos];
    return combined.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filter === 'all' || item.status === filter;
      const matchesType = !mediaTypeFilter || mediaTypeFilter.length === 0 || mediaTypeFilter.includes(item.type);
      return matchesSearch && matchesFilter && matchesType;
    });
  }
);

export const selectMediaByType = (type: MediaType) => (state: RootState) =>
  type === 'image' ? state.media.images : state.media.videos;

export const selectFilteredMedia = createSelector(
  [
    (state: RootState, type: MediaType) => selectMediaByType(type)(state),
    (state: RootState) => state.media.searchTerm,
    (state: RootState) => state.media.filter
  ],
  (media, searchTerm, filter) => 
    media.filter(item => {
      const searchMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const filterMatch = filter === 'all' || item.status === filter;
      return searchMatch && filterMatch;
    })
);

export const {
  setMediaSearchTerm,
  setMediaFilter,
  toggleMediaSelection,
  clearMediaSelections,
  setEditingMedia,
  resetUploadProgress,
  setMediaTypeFilter
} = mediaSlice.actions;

export default mediaSlice.reducer;