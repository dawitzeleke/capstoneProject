import getBaseUrl from "@/scripts/api";
import axios, { AxiosRequestConfig, Method } from "axios";

const API_BASE_URL = getBaseUrl();
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODQ4YWYxOGYwNmJmMTkyZTQ1Zjc3ZDEiLCJlbWFpbCI6IkJldHlAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI2ODQ4YWYxOGYwNmJmMTkyZTQ1Zjc3ZDEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJCZXR5QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRlYWNoZXIiLCJqdGkiOiJlZWQ1Zjc0ZS02NWUyLTQyOGMtOGE2ZC04MTgyYTMyNDMxZDIiLCJleHAiOjE3NTIxODU4ODEsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAxOSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9.wdJbgmmFop8Y_HnbzxPhffgrGsXrsyaVEUxOlFzGUmg`,
  },
});

export const httpRequest = async (
  endpoint: string,
  data?: any,
  method: Method = "POST",
  config?: AxiosRequestConfig
) => {
  console.log("Making request to:", endpoint);

  console.log("here", data);
  try {
    const response = await axiosInstance.request({
      url: endpoint,
      method,
      data,
      headers: {
        ...(config?.headers || {}),
        // Authorization: `Bearer ${yourToken}`, // optional
      },
      ...config,
    });

    return response.data;
  } catch (error: any) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

export default httpRequest;
