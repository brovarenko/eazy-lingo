'use client';
import { FC } from 'react';

interface LoginProps {}

const Login: FC<LoginProps> = ({}) => {
  const onSubmit = async () => {
    try {
      window.location.href = 'http://localhost:3000/auth/google';
    } catch (err) {
      console.log(err);
    }
  };
  return <button onClick={onSubmit}>Sign in</button>;
};

export default Login;
