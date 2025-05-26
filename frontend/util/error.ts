// src/utils/error.ts
import { AxiosError } from 'axios';

export const formatError = (error: AxiosError) => {
  return error.response?.data?.message || error.message || 'An unknown error occurred';
};