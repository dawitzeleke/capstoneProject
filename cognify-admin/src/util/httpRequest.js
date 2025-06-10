import axios from "axios";

const API_BASE_URL = "https://cognify-d5we.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});



export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const httpRequest = async (
  endpoint,
  data = {},
  method = "POST",
  config = {}
) => {
  try {
    console.log(endpoint, data, method, config);

    // Let axios handle headers properly
    const response = await axiosInstance.request({
      url: endpoint,
      method,
      data,
      ...config, // Spread config to allow overriding anything including headers
    });

    return response.data;
  } catch (error) {
    console.error("Axios Error:", error);
    throw error;
  }
};

export default httpRequest;
