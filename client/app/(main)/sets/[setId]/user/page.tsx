'use client';

import { useState } from 'react';

import { LearningTrainer } from '@/app/components/learning-trainer';
import { Button } from '@/components/ui/button';
import { removeWordFromSet, useSetById } from '@/lib/api';
import { Word } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

const pageWrapperClasses =
  'min-h-screen w-full bg-zinc-950 px-4 py-10 text-zinc-100';
const panelClasses =
  'rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur';
const wordRowClasses =
  'flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 transition-colors hover:border-zinc-600';

const renderWordSummary = (word: Word) => (
  <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-zinc-300'>
    <span className='text-base font-semibold text-zinc-100'>{word.english}</span>
    <span className='text-zinc-500'>-</span>
    <span>{word.german}</span>
    {word.perfekt && (
      <>
        <span className='text-zinc-500'>|</span>
        <span>{word.perfekt}</span>
      </>
    )}
  </div>
);

export default function WordsPage({ params }: { params: { setId: string } }) {
  const setId = params.setId;
  const queryClient = useQueryClient();
  const { set, error, isLoading } = useSetById(setId);
  const [isTraining, setIsTraining] = useState(false);

  if (isLoading) {
    return (
      <main className={pageWrapperClasses}>
        <div className='mx-auto flex w-full max-w-xl flex-1 items-center justify-center text-center'>
          <p className='text-base text-zinc-400'>Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={pageWrapperClasses}>
        <div className='mx-auto flex w-full max-w-xl flex-1 items-center justify-center text-center'>
          <p className='text-base text-rose-300'>Failed to load set: {error.message}</p>
        </div>
      </main>
    );
  }

  if (!set) {
    return (
      <main className={pageWrapperClasses}>
        <div className='mx-auto flex w-full max-w-xl flex-1 items-center justify-center text-center'>
          <p className='text-base text-zinc-400'>Set not found.</p>
        </div>
      </main>
    );
  }

  const words = set.words ?? [];

  const invalidateQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['sets', setId] }),
      queryClient.invalidateQueries({ queryKey: ['sets', setId, 'words'] }),
      queryClient.invalidateQueries({ queryKey: ['userSets'] }),
    ]);
  };

  const handleRemoveWord = async (wordId: number) => {
    try {
      await removeWordFromSet(setId, wordId);
      await invalidateQueries();
    } catch (removeError) {
      console.error('Failed to remove word from set:', removeError);
    }
  };

  const startTraining = () => {
    if (words.length === 0) {
      return;
    }
    setIsTraining(true);
  };

  const handleExitTraining = () => {
    setIsTraining(false);
  };

  if (isTraining) {
    return (
      <main className={pageWrapperClasses}>
        <LearningTrainer words={words} onExit={handleExitTraining} />
      </main>
    );
  }

  return (
    <main className={pageWrapperClasses}>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-8'>
        <section className={panelClasses}>
          <div className='flex items-center justify-between border-b border-zinc-800 pb-4'>
            <div>
              <h1 className='text-3xl font-semibold text-zinc-100'>{set.name}</h1>
              <p className='text-sm text-zinc-400'>Words in this set: {words.length}</p>
            </div>
            <Button
              onClick={startTraining}
              disabled={words.length === 0}
              className='rounded-lg bg-zinc-800 px-6 py-2 text-base font-semibold text-zinc-100 shadow-lg transition hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500/60 disabled:opacity-60'
            >
              Start Learning
            </Button>
          </div>

          <div className='mt-6 grid gap-3'>
            {words.length === 0 ? (
              <p className='text-sm text-zinc-400'>This set has no words yet.</p>
            ) : (
              words.map((word) => (
                <div key={word.id} className={wordRowClasses}>
                  {renderWordSummary(word)}
                  <Button
                    onClick={() => handleRemoveWord(word.id)}
                    variant='outline'
                    className='rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-500/60'
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
