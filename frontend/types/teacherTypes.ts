// File: src/types/teacherTypes.ts

export interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  profilePictureUrl: string;
  followersCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherStats {
  totalViews: number;
  totalLikes: number;
  engagementLast7Days: number[];
  engagementLabels: string[];
}

export interface UpdateImagePayload {
  teacherId: string;
  imageUri: string;
  base64Data?: string | null;
}

// Backend DTO alignment
export interface TeacherDto {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  SchoolName: string;
  ProfilePictureUrl: string;
  FollowersCount: number;
  PostsCount: number;
}

// API Response format
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}