'use client';

import { FC, useState } from 'react';
import { useUserSets, useCommonSets } from '@/lib/api';
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
import { Plus } from 'lucide-react';

const Page: FC = () => {
  const { sets, error, isLoading, mutate } = useUserSets();
  const { sets: commonSets, isLoading: isCommonLoading } = useCommonSets();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading || isCommonLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load sets: {error.message}</p>;

  return (
    <div className='flex w-full justify-center px-4'>
      <div className='w-full max-w-5xl'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-3xl font-semibold tracking-tight'>My Sets</h2>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className='grid grid-cols-1 gap-4 mb-10 sm:grid-cols-2 lg:grid-cols-3'>
            {sets && sets.length > 0 ? (
              sets.map((set) => (
                <div
                  key={set.id}
                  className='group rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition hover:bg-zinc-900 cursor-pointer'
                  onClick={() => router.push(`sets/${set.id}/user`)}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='text-lg font-medium'>{set.name}</h3>
                    <span className='text-xs text-zinc-400'>
                      words: {set.words?.length ?? 0}
                    </span>
                  </div>
                  <div className='text-xs text-zinc-400'>Open Set</div>
                </div>
              ))
            ) : (
              <div className='flex min-h-[160px] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-zinc-400 col-span-full'>
                No sets yet. Create your first one!
              </div>
            )}
            <DialogTrigger asChild>
              <button
                type='button'
                className='group flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-4 text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900'
              >
                <span>
                  <Plus className='h-6 w-6' />
                </span>
              </button>
            </DialogTrigger>
          </div>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Set</DialogTitle>
            </DialogHeader>
            <CreateSetForm
              onSetCreated={() => {
                setIsDialogOpen(false);
                mutate();
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-xl font-semibold tracking-tight'>
            Ready-made Sets
          </h2>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {commonSets && commonSets.length > 0 ? (
            commonSets.map((set) => (
              <div
                key={set.id}
                className='rounded-xl border border-zinc-800 bg-zinc-900/40 p-4'
              >
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-lg font-medium'>{set.name}</h3>
                  <span className='text-xs text-zinc-400'>
                    words: {set.words?.length ?? 0}
                  </span>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => router.push(`sets/${set.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size='sm'
                    onClick={() => router.push(`sets/${set.id}/user`)}
                  >
                    Learn
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className='text-zinc-400'>No ready-made sets</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
