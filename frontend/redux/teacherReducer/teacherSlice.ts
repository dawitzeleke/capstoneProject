import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TeacherProfile, TeacherStats, UpdateImagePayload } from '@/types/teacherTypes';
import apiClient from '@/services/apiClient';

interface TeacherState {
  profile: TeacherProfile | null;
  stats: TeacherStats | null;
  loading: {
    profile: boolean;
    stats: boolean;
    image: boolean;
  };
  errors: {
    profile: string | null;
    stats: string | null;
    image: string | null;
  };
}

const initialState: TeacherState = {
  profile: null,
  stats: null,
  loading: {
    profile: false,
    stats: false,
    image: false
  },
  errors: {
    profile: null,
    stats: null,
    image: null
  }
};

export const fetchTeacherProfile = createAsyncThunk<TeacherProfile, string>(
  'teacher/fetchProfile',
  async (teacherId, { rejectWithValue }) => {
    try {
      // TEMPORARY: Mock data until backend is connected
      const mockProfile: TeacherProfile = {
        id: teacherId,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        school: 'Bright Future Academy',
        profilePictureUrl: 'https://example.com/avatar.jpg',
        followersCount: 1234,
        postsCount: 56,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return mockProfile;
      
      // REAL IMPLEMENTATION (uncomment later):
      // const response = await apiClient.get(`/teachers/${teacherId}`);
      // return response.data;

    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load profile');
    }
  }
);

export const updateProfileImage = createAsyncThunk<string, UpdateImagePayload>(
  'teacher/updateImage',
  async ({ teacherId, imageUri }, { rejectWithValue }) => {
    try {
      // TEMPORARY: Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return 'https://example.com/new-avatar.jpg';
      
      // REAL IMPLEMENTATION:
      // const formData = new FormData();
      // formData.append('image', { uri: imageUri, name: 'profile.jpg', type: 'image/jpeg' });
      // const response = await apiClient.patch(`/teachers/${teacherId}/image`, formData);
      // return response.data.url;

    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Image upload failed');
    }
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    resetTeacherState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Profile Fetch
      .addCase(fetchTeacherProfile.pending, (state) => {
        state.loading.profile = true;
        state.errors.profile = null;
      })
      .addCase(fetchTeacherProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.errors.profile = action.payload as string;
      })
      
      // Image Update
      .addCase(updateProfileImage.pending, (state) => {
        state.loading.image = true;
        state.errors.image = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading.image = false;
        if (state.profile) {
          state.profile.profilePictureUrl = action.payload;
        }
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading.image = false;
        state.errors.image = action.payload as string;
      });
  }
});

export const { resetTeacherState } = teacherSlice.actions;
export default teacherSlice.reducer;