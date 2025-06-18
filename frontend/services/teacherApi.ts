import apiClient from '@/services/apiClient';
import {
  TeacherProfile,
  TeacherStats,
  UpdateImagePayload,
} from '@/types/teacherTypes';

// Fetch the teacher's profile by ID
export const getProfile = async (teacherId: string): Promise<TeacherProfile> => {
  const response = await apiClient.get<TeacherProfile>(`/teachers/${teacherId}`);
  return response.data;
};

// Fetch summary stats (views, shares, engagement over last 7 days)
export const getStats = async (teacherId: string): Promise<TeacherStats> => {
  const response = await apiClient.get<TeacherStats>(`/teachers/${teacherId}/stats`);
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

// Search teachers (public endpoint)
export const searchTeachers = async (searchTerm?: string, pageNumber: number = 1, pageSize: number = 10) => {
  const params = new URLSearchParams();
  if (searchTerm) {
    params.append('searchTerm', searchTerm);
  }
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());
  
  const response = await apiClient.get(`/api/teachers/search?${params.toString()}`);
  return response.data;
};
