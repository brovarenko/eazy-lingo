'use client';
import { FC, useEffect, useState } from 'react';
import api from '@/lib/api';

interface LoginProps {}
interface User {
  username: string;
  iat: number;
  exp: number;
}

const Profile: FC<LoginProps> = ({}) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    async function fetchPosts() {
      const data = await api.get('http://localhost:3000/auth/profile');
      //let data = await res.json();

      setUser(data.data);
    }
    fetchPosts();
  }, []);

  return <div>{user?.username}</div>;
};

export default Profile;
