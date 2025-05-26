import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://your-api.example.com', // ← replace with your real base URL
  timeout: 10000,                          // 10s timeout
});

// Optional: add request interceptor for auth when you have a token
// apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
//   const token = '<YOUR_TOKEN_HERE>';
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

apiClient.interceptors.response.use(
  response => response,
  error => {
    // You can inspect error.response here and handle global errors if desired
    return Promise.reject(error);
  },
);

export default apiClient;
