import apiClient from '@/services/apiClient';
import {
  TeacherProfile,
  TeacherStats,
  UpdateImagePayload,
} from '@/types/teacherTypes';

// Fetch the teacher’s profile by ID
export const getProfile = async (teacherId: string): Promise<TeacherProfile> => {
  const response = await apiClient.get<TeacherProfile>(`/api/teachers/${teacherId}`);
  return response.data;
};

// Fetch summary stats (views, shares, engagement over last 7 days)
export const getStats = async (teacherId: string): Promise<TeacherStats> => {
  const response = await apiClient.get<TeacherStats>(`/api/teachers/${teacherId}/stats`);
  return response.data;
};

// Upload a new profile image
export const updateProfileImage = async ({
  teacherId,
  imageUri,
}: UpdateImagePayload): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('profilePicture', imageUri);
  formData.append('teacherId', teacherId);

  const response = await apiClient.patch<{ url: string }>(
    '/api/teachers/settings',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};
