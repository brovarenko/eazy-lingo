'use client';

import { FC, useEffect, useState } from 'react';
import api, { useUserSets } from '@/lib/api';
import { useRouter } from 'next/navigation';

const Page: FC = () => {
  const { sets, error, isLoading } = useUserSets();
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load sets: {error.message}</p>;

  return (
    <div className='flex w-full justify-center'>
      <div className='max-w-2xl w-full'>
        <h2 className='text-2xl font-bold mb-4'>Your Sets</h2>
        {sets?.length === 0 ? (
          <p>No sets found.</p>
        ) : (
          <ul>
            {sets?.map((set) => (
              <li
                key={set.id}
                onClick={() => router.push(`sets/${set.id}/user`)}
                className='cursor-pointer hover:underline'
              >
                {set.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Page;
