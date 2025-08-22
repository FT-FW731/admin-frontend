import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "../utils/constants";
import { tokenControl } from "../utils/helpers";
import { asyncHandler } from "@/lib/asyncHandler";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenControl("get");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function wrapWithAsyncHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T
): (...args: Parameters<T>) => Promise<any> {
  return async (...args) => {
    const result = await asyncHandler(fn(...args));
    // If result is null, return an object with data: null for safe destructuring
    if (result === null) return { data: null };
    return result?.data || result;
  };
}

export const API = {
  get: wrapWithAsyncHandler((url, params?) =>
    axiosInstance.get(url, { params })
  ),
  post: wrapWithAsyncHandler((url, data) => axiosInstance.post(url, data)),
  put: wrapWithAsyncHandler((url, data) => axiosInstance.put(url, data)),
  delete: wrapWithAsyncHandler((url) => axiosInstance.delete(url)),
};
