import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.error('Unauthorized - maybe refresh token here');
      }

      if (status === 403) {
        console.error('Forbidden');
      }
    }

    return Promise.reject(error);
  }
);

export const GET = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const res = await api.get<T>(url, config);
  return res.data;
};

export const POST = async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const res = await api.post<T>(url, data, config);
  return res.data;
};

export const PUT = async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const res = await api.put<T>(url, data, config);
  return res.data;
};

export const DELETE = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const res = await api.delete<T>(url, config);
  return res.data;
};

export default api;
