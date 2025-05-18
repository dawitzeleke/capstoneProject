import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { TeacherProfile, TeacherStats } from '@/types/teacherTypes';

// Base selector
const teacherState = (state: RootState) => state.teacher;

// Profile selectors
export const selectTeacherProfile = createSelector(
  teacherState,
  ts => ts.profile
);

export const selectIsProfileLoading = createSelector(
  teacherState,
  ts => ts.loadingProfile
);

export const selectProfileError = createSelector(
  teacherState,
  ts => ts.errorProfile
);

// Stats selectors
export const selectTeacherStats = createSelector(
  teacherState,
  ts => ts.stats
);

export const selectIsStatsLoading = createSelector(
  teacherState,
  ts => ts.loadingStats
);

export const selectStatsError = createSelector(
  teacherState,
  ts => ts.errorStats
);

// Image upload selectors
export const selectIsUploadingImage = createSelector(
  teacherState,
  ts => ts.uploadingImage
);

export const selectImageUploadError = createSelector(
  teacherState,
  ts => ts.errorUpload
);
