'use client';

import { API_BASE_URL } from '@/lib/api';
import { useState } from 'react';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${API_BASE_URL}/auth/google`;
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-sm'>
        <h1 className='text-2xl font-bold text-gray-800 text-center mb-6'>
          Welcome
        </h1>
        <p className='text-gray-600 text-center mb-6'>
          Sign in with Google to continue
        </p>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;
