'use client';

import { FC, useEffect, useState } from 'react';
import api from '@/lib/api';
import useSWR from 'swr';

interface LoginProps {}
interface User {
  username: string;
  iat: number;
  exp: number;
}
const fetcher = (url: string) => api.get(url).then((res) => res.data);

const Profile: FC<LoginProps> = ({}) => {
  const { data: user, error } = useSWR(
    'http://localhost:3000/auth/profile',
    fetcher
  );

  if (error) return <div>Error loading user</div>;
  if (!user) return <div>Loading...</div>;

  return <h1>Welcome, {user.username}!</h1>;
};

export default Profile;
