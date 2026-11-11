import axios from 'axios';
import type { Page } from '../types/api';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.headers.Authorization
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('purchase');
      window.dispatchEvent(new Event('kicket:logout'));
    }
    return Promise.reject(error);
  },
);
export function errorMessage(error: unknown) {
  return axios.isAxiosError<{ message?: string }>(error)
    ? error.response?.data.message || 'No se pudo completar la operación'
    : 'No se pudo completar la operación';
}
export async function getAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  let page = 1,
    total = 1;
  do {
    const response = await api.get<Page<T>>(path, {
      params: { page, limit: 100 },
    });
    items.push(...response.data.data);
    total = response.data.pagination.totalPages;
    page++;
  } while (page <= total);
  return items;
}
export default api;
