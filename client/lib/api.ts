import axios from 'axios';
import Router from 'next/router';
import useSWR from 'swr';
import { Set, User } from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const logout = async () => {
  await api.post('/auth/logout');
};

export const useUserSets = () => {
  const { data, error, isLoading } = useSWR<Set[]>('/sets/user', fetcher);

  return {
    sets: data,
    error,
    isLoading,
  };
};

export const useUser = () => {
  const { data, error, isLoading } = useSWR<User>('/auth/profile', fetcher);

  return {
    user: data,
    error,
    isLoading,
  };
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          'http://localhost:3000/auth/refresh',
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (err) {
        Router.push('/login');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
