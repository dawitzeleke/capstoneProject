// src/types/mediaTypes.ts
export type MediaType = "image" | "video";
export type MediaStatus = "draft" | "posted";

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  status: MediaStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  publicId?: string;
  views?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// API Configuration
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5019";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;