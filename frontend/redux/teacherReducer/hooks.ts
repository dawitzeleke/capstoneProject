// File: src/redux/hooks.ts

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { UpdateImagePayload } from '@/types/teacherTypes';
import { fetchTeacherProfile, updateProfileImage } from './teacherSlice';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Teacher specific hook
export const useTeacher = () => {
  const dispatch = useAppDispatch();
  
  return {
    profile: useAppSelector(state => state.teacher.profile),
    stats: useAppSelector(state => state.teacher.stats),
    loading: useAppSelector(state => state.teacher.loading),
    errors: useAppSelector(state => state.teacher.errors),
    refreshProfile: (teacherId: string) => dispatch(fetchTeacherProfile(teacherId)),
    updateProfileImage: (payload: UpdateImagePayload) => dispatch(updateProfileImage(payload))
  };
};