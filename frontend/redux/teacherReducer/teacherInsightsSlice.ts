import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { QuestionItem } from '@/types/questionTypes'; // Assuming QuestionItem is defined here
import { MediaItem } from '@/types/mediaTypes'; // Assuming MediaItem is defined here
import apiClient from '@/services/apiClient';

// Define types for insights data
interface SummaryStats {
  totalFollowers: number;
  questionsThisWeek: number;
  avgLikesPerQ: number;
  avgSavesPerQ: number;
}

interface EngagementData {
  title: string;
  engagementScore: number; // Combined metric or specific metric
}

// Export FlaggedItem interface
export interface FlaggedItem {
  id: string;
  title: string;
  type: 'question' | 'media';
  flagType: string; // e.g., 'Inappropriate', 'Misleading'
  reportsCount: number;
  dateReported: string;
  // Add more fields needed for the detail panel
  content: QuestionItem | MediaItem | null; // Store full content for detail view
  reports: { reportedBy: string; reportType: string; comment?: string; date: string }[]; // Details of each report
}

interface TeacherInsightsState {
  summaryStats: SummaryStats | null;
  engagementChartData: EngagementData[];
  flaggedItems: FlaggedItem[];
  filters: {
    dateRange: string; // e.g., 'this_week', 'this_month'
    contentType: ('question' | 'image' | 'video')[]; // Content types
    searchQuery: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: TeacherInsightsState = {
  summaryStats: null,
  engagementChartData: [],
  flaggedItems: [],
  filters: {
    dateRange: 'this_week',
    contentType: ['question', 'image', 'video'],
    searchQuery: '',
  },
  loading: false,
  error: null,
};

// Add the async thunk for fetching insights
export const fetchTeacherInsights = createAsyncThunk(
  'teacherInsights/fetchInsights',
  async (filters: TeacherInsightsState['filters'], { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/teacher/insights', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch insights data');
    }
  }
);

const teacherInsightsSlice = createSlice({
  name: 'teacherInsights',
  initialState,
  reducers: {
    setSummaryStats(state, action: PayloadAction<SummaryStats | null>) {
      state.summaryStats = action.payload;
    },
    setEngagementChartData(state, action: PayloadAction<EngagementData[]>) {
      state.engagementChartData = action.payload;
    },
    setFlaggedItems(state, action: PayloadAction<FlaggedItem[]>) {
      state.flaggedItems = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<TeacherInsightsState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    // Reducer to update a single flagged item (e.g., after review)
    updateFlaggedItem(state, action: PayloadAction<FlaggedItem>) {
      const index = state.flaggedItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.flaggedItems[index] = action.payload;
      }
    },
    // Reducer to remove a flagged item after resolution
    removeFlaggedItem(state, action: PayloadAction<string>) {
      state.flaggedItems = state.flaggedItems.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.summaryStats = action.payload.summaryStats;
        state.engagementChartData = action.payload.engagementChartData;
        state.flaggedItems = action.payload.flaggedItems;
      })
      .addCase(fetchTeacherInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSummaryStats,
  setEngagementChartData,
  setFlaggedItems,
  setFilters,
  setLoading,
  setError,
  updateFlaggedItem,
  removeFlaggedItem,
} = teacherInsightsSlice.actions;

export default teacherInsightsSlice.reducer; 