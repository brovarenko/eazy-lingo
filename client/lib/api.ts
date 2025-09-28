import axios from 'axios';
import Router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Set, User, Word } from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

export const logout = async () => {
  await api.post('/auth/logout');
};

export const useUserSets = () => {
  const query = useQuery({
    queryKey: ['userSets'],
    queryFn: async () => (await api.get<Set[]>('/sets/user')).data,
  });
  return {
    sets: query.data,
    error: query.error as any,
    isLoading: query.isLoading,
    mutate: query.refetch,
  };
};

export const useCommonSets = () => {
  const query = useQuery({
    queryKey: ['sets', { isCommon: true }],
    queryFn: async () => (await api.get<Set[]>('/sets?isCommon=true')).data,
  });
  return {
    sets: query.data,
    error: query.error as any,
    isLoading: query.isLoading,
    mutate: query.refetch,
  };
};

export const useUser = () => {
  const query = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => (await api.get<User>('/auth/profile')).data,
  });
  return {
    user: query.data,
    error: query.error as any,
    isLoading: query.isLoading,
    mutate: query.refetch,
  };
};

export const useSetWords = (setId: string) => {
  const query = useQuery({
    queryKey: ['sets', setId, 'words'],
    queryFn: async () => (await api.get<Word[]>(`/sets/${setId}/words`)).data,
    enabled: !!setId,
  });
  return {
    words: query.data,
    error: query.error as any,
    isLoading: query.isLoading,
    mutate: query.refetch,
  };
};

export const useAllWords = () => {
  const query = useQuery({
    queryKey: ['words'],
    queryFn: async () => (await api.get<Word[]>('/words')).data,
  });
  return {
    words: query.data,
    error: query.error as any,
    isLoading: query.isLoading,
    mutate: query.refetch,
  };
};

export const removeWordFromSet = (setId: string | number, wordId: number) =>
  api.delete(`/sets/${setId}/words/${wordId}`);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          'http://localhost:3001/auth/refresh',
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
