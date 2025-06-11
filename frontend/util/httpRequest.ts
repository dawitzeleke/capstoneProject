import getBaseUrl from "@/scripts/api";
import axios, { AxiosRequestConfig, Method } from "axios";

const API_BASE_URL = getBaseUrl();
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
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

  console.log("here", data);
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
