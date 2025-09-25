'use client';

import { FC, useEffect, useState } from 'react';
import api, { useUserSets } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreateSetForm from '@/app/components/create-set-form';

const Page: FC = () => {
  const { sets, error, isLoading, mutate } = useUserSets(); // Add mutate from SWR to revalidate data
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load sets: {error.message}</p>;

  return (
    <div className='flex w-full justify-center'>
      <div className='max-w-2xl w-full'>
        <h2 className='text-2xl font-bold mb-4'>Your Sets</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='mb-4'>Create New Set</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Set</DialogTitle>
            </DialogHeader>
            <CreateSetForm
              onSetCreated={() => {
                setIsDialogOpen(false);
                mutate(); // Revalidate sets data
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
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
