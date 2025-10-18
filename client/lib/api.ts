import axios from 'axios';
import Router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Set, User, Word } from '@/types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
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

export const useSetById = (setId: string | number) => {
  const query = useQuery({
    queryKey: ['sets', setId],
    queryFn: async () => (await api.get<Set>(`/sets/${setId}`)).data,
    enabled: !!setId,
  });

  return {
    set: query.data,
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

// -------- Progress API --------
export type WordStatus = 'NEW' | 'LEARNING' | 'LEARNED' | 'KNOWN';

export interface ProgressItem {
  userId: number;
  wordId: number;
  status: WordStatus;
  correctCount: number;
  wrongCount: number;
  streak: number;
  lastAnsweredAt?: string;
  firstLearnedAt?: string;
  word: Word;
}

export async function postTrainingEvent(params: {
  wordId: number;
  result: 'correct' | 'wrong';
  elapsedSeconds?: number;
}) {
  return api.post('/progress/events', params);
}

export async function updateWordStatus(wordId: number, status: WordStatus) {
  return api.patch('/progress/status', { wordId, status });
}

export function useProgress(options: {
  status?: WordStatus;
  search?: string;
  setId?: number;
}) {
  const { status, search, setId } = options;

  const qs = new URLSearchParams();
  if (status) qs.set('status', status);
  if (search) qs.set('search', search);
  if (setId) qs.set('setId', String(setId));

  const query = useQuery({
    queryKey: ['progress', { status, search, setId }],
    queryFn: async () =>
      (await api.get<ProgressItem[]>(`/progress?${qs.toString()}`)).data,
  });
  return {
    items: query.data,
    error: query.error as any,
    isLoading: query.isLoading,
    mutate: query.refetch,
  };
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
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
