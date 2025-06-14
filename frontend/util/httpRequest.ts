import getBaseUrl from "@/scripts/api";
import axios, { AxiosRequestConfig, Method } from "axios";

const API_BASE_URL = getBaseUrl();
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODQ5ODNkNWIzNDFiNDU5ODE4NGI3OGUiLCJlbWFpbCI6InRlc3Rfc3RkQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiNjg0OTgzZDViMzQxYjQ1OTgxODRiNzhlIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoidGVzdF9zdGRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3R1ZGVudCIsImp0aSI6ImE2MTgzNTA2LTlhZDYtNDdiZS05NDIxLWMyZjM2MmQ2ZWFiYyIsImV4cCI6MTc1MjI0MDM0MSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDE5IiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIn0._zu7T4OkocC69-ZFMWd-5u10I9VAlMKaUNb7IvpUvdU`,
  },
});

export const httpRequest = async (
  endpoint: string,
  data?: any,
  method: Method = "POST",
  token?: string,
  config?: AxiosRequestConfig,
) => {
  console.log("Making request to:", endpoint);

  try {
    const response = await axiosInstance.request({
      url: endpoint,
      method,
      data,
      headers: {
        ...(config?.headers || {}),
        Authorization: `Bearer ${token}`, // optional
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
