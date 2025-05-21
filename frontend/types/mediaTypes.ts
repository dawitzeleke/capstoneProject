// src/types/mediaTypes.ts

import { ApiResponse } from "./teacherTypes";

export type MediaType = "image" | "video";
export type MediaStatus = "draft" | "posted" | "archived";

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  description?: string;
  
  // Core media properties
  url: string;
  thumbnailUrl?: string;
  publicId?: string;
  
  // Metadata
  tags: string[];
  status: MediaStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  
  // Analytics
  views?: number;
  downloads?: number;
  shares?: number;
  
  // Video-specific properties
  duration?: number;
  aspectRatio?: string;
  
  // Image-specific properties
  dimensions?: {
    width: number;
    height: number;
  };
}

// API Response Types
export interface MediaApiResponse<T> extends ApiResponse<T> {
  statusCode: number;
  timestamp?: string;
  path?: string;
}

export interface MediaUploadResponse {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  duration?: number;
  width?: number;
  height?: number;
}

// Redux State Types
export interface MediaState {
  images: MediaItem[];
  videos: MediaItem[];
  loading: boolean;
  error: string | null;
  selectedIds: string[];
  editingMedia: MediaItem | null;
  searchTerm: string;
  filter: 'all' | MediaStatus;
  mediaTypeFilter: string[];
  
  // Upload progress tracking
  uploadProgress: number;
  currentUpload?: {
    fileName: string;
    fileSize: number;
    type: MediaType;
  };
}

// Form Data Type
export interface MediaFormData {
  title: string;
  description?: string;
  file: File;
  thumbnail?: File;
  tags: string[];
  status: MediaStatus;
  type: MediaType;
}

// Error Handling
export interface MediaError {
   code: number;
  message: string;
  details?: Array<{
    field?: string;
    reason?: string;
  }>;
  timestamp?: string;
  path?: string;
}

// Enum for Upload Status
export enum UploadStatus {
  IDLE = "idle",
  PREPARING = "preparing",
  UPLOADING = "uploading",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

// Type for File Upload Payload
export interface FileUploadPayload {
  file: File;
  type: MediaType;
  onProgress?: (progress: number) => void;
}

// Utility Types
export type MediaCardProps = {
  item: MediaItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPreview?: (item: MediaItem) => void;
};

export type MediaPreviewType = "full" | "thumbnail" | "list";
