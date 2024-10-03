'use client';
import { FC, useEffect, useState } from 'react';

interface LoginProps {}
interface User {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

const Profile: FC<LoginProps> = ({}) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    async function fetchPosts() {
      let res = await fetch('http://localhost:3000/auth/profile', {
        method: 'GET',
        credentials: 'include',
      });
      let data = await res.json();
      setUser(data);
    }
    fetchPosts();
  }, []);

  return <div>{user?.email}</div>;
};

export default Profile;
