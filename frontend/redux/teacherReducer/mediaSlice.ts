import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { MediaItem, MediaStatus } from "@/types/mediaTypes";
import type { RootState } from "@/redux/store";

interface MediaState {
  media: MediaItem[];
  selectedIds: string[];
  editingMediaId: string | null;
  searchTerm: string;
  activeTab: "all" | "posted" | "draft";
}

const initialState: MediaState = {
  media: [],
  selectedIds: [],
  editingMediaId: null,
  searchTerm: "",
  activeTab: "all",
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    toggleMediaSelection(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter(mediaId => mediaId !== id)
        : [...state.selectedIds, id];
    },
    setEditingMedia: (state, action: PayloadAction<string>) => {
      state.editingMediaId = action.payload;
    },
    clearEditingMedia: (state) => {
      state.editingMediaId = null;
    },
    addMedia: (state, action: PayloadAction<MediaItem>) => {
      // Add new media to the beginning of the array
      state.media.unshift(action.payload);
    },
    updateMedia: (state, action: PayloadAction<MediaItem>) => {
      const index = state.media.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.media[index] = action.payload;
      }
    },
    deleteMedia: (state, action: PayloadAction<string>) => {
      state.media = state.media.filter(m => m.id !== action.payload);
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    setMediaSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setMediaActiveTab: (state, action: PayloadAction<"all" | "posted" | "draft">) => {
      state.activeTab = action.payload;
    },
    clearMediaSelections(state) {
      state.selectedIds = [];
    },
    deleteMultipleMedia(state, action: PayloadAction<string[]>) {
      const idsToDelete = action.payload;
      state.media = state.media.filter(m => !idsToDelete.includes(m.id));
      state.selectedIds = state.selectedIds.filter(id => !idsToDelete.includes(id));
    },
  },
});

// Selectors
export const selectFilteredMedia = createSelector(
  [(state: RootState) => state.media.media, (state: RootState) => state.media.searchTerm],
  (media, searchTerm) => {
    if (!searchTerm) return media;
    const lowerSearch = searchTerm.toLowerCase();
    return media.filter(item =>
      item.name.toLowerCase().includes(lowerSearch) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
    );
  }
);

export const selectDisplayMedia = createSelector(
  [selectFilteredMedia, (state: RootState) => state.media.activeTab],
  (filtered, activeTab) => activeTab === 'all'
    ? filtered
    : filtered.filter(item => item.status === activeTab)
);

export const {
  toggleMediaSelection,
  setEditingMedia,
  clearEditingMedia,
  addMedia,
  updateMedia,
  deleteMedia,
  setMediaSearchTerm,
  setMediaActiveTab,
  clearMediaSelections,
  deleteMultipleMedia,
} = mediaSlice.actions;

export default mediaSlice.reducer;