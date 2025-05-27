import getBaseUrl from "@/scripts/api";
import axios, { AxiosRequestConfig, Method } from "axios";

const API_BASE_URL = getBaseUrl();
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI3M2ZlMmY2NjY3NmUzY2UyODIzYTkiLCJlbWFpbCI6ImRhd2l0c3R1ZGVudEBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjY4MjczZmUyZjY2Njc2ZTNjZTI4MjNhOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImRhd2l0c3R1ZGVudEBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdHVkZW50IiwianRpIjoiMjBmYjBmODktMTRmMC00ZmY4LThjOGUtOWY4MGJhYTY1NjgxIiwiZXhwIjoxNzQ4Mzc4MDY2LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMTkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAifQ.7na6WUcdnni4sMITApCXZ7KzybbEDvk1JEDpAJjx4Ug`,
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
