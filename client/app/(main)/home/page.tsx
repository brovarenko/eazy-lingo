'use client';

import { FC, useEffect, useState } from 'react';
import api, { getUserSets } from '@/lib/api';

interface Set {
  id: number;
  name: string;
  isCommon: boolean;
  words: { id: number; english: string; german: string }[];
}

const Page: FC = () => {
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const userSets = await getUserSets();
        setSets(userSets);
      } catch (error) {
        console.error('Failed to fetch user sets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='flex w-full justify-center'>
      <div className='max-w-2xl w-full'>
        <h2 className='text-2xl font-bold mb-4'>Your Sets</h2>
        {sets.length === 0 ? (
          <p>No sets found.</p>
        ) : (
          <ul>
            {sets.map((set) => (
              <li key={set.id} className='mb-4 border-b pb-2'>
                <h3 className='text-lg font-semibold'>{set.name}</h3>
                <p>Common: {set.isCommon ? 'Yes' : 'No'}</p>
                <ul className='ml-4 mt-2'>
                  {set.words.map((word) => (
                    <li key={word.id}>
                      {word.english} - {word.german}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Page;
