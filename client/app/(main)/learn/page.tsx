'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserSets } from '@/lib/api';

const LearnPage: FC = () => {
  const { sets, error, isLoading } = useUserSets();
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load sets: {error.message}</p>;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='max-w-4xl w-full'>
        <h1 className='text-4xl font-bold text-center mb-8'>Learn Words</h1>
        <p className='text-center text-gray-600 mb-8'>
          Choose a set to start learning German words
        </p>

        {sets?.length === 0 ? (
          <div className='text-center'>
            <p className='text-gray-500 mb-4'>No sets found.</p>
            <Button onClick={() => router.push('/home')}>Go to Home</Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sets?.map((set) => (
              <Card
                key={set.id}
                className='cursor-pointer hover:shadow-lg transition-shadow'
                onClick={() => router.push(`/sets/${set.id}/user`)}
              >
                <CardHeader>
                  <CardTitle className='text-xl'>{set.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-600 mb-4'>
                    {set.words?.length || 0} words
                  </p>
                  <Button
                    className='w-full bg-blue-500 hover:bg-blue-600'
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/sets/${set.id}/user`);
                    }}
                  >
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnPage;
