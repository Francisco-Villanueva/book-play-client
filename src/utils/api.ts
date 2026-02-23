import axios from "axios";
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
export const BASE_URL: string = `${API_BASE_URL}/api`;

export const axiosInstance = axios.create({ baseURL: BASE_URL });

let authInterceptorId: number | null = null;

export const setAuthInterceptor = async (token: string | null) => {
  if (authInterceptorId !== null) {
    axiosInstance.interceptors.request.eject(authInterceptorId);
    authInterceptorId = null;
  }
  if (token) {
    authInterceptorId = axiosInstance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );
  }
};
