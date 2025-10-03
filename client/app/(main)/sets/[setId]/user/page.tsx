'use client';

import { useState } from 'react';

import { LearningTrainer } from '@/app/components/learning-trainer';
import { Button } from '@/components/ui/button';
import api, { removeWordFromSet, useAllWords, useSetWords } from '@/lib/api';
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
    <span className='text-base font-semibold text-zinc-100'>
      {word.english}
    </span>
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
  const { words, error, isLoading } = useSetWords(setId);
  const {
    words: allWords,
    error: allError,
    isLoading: allLoading,
  } = useAllWords();

  const [isSelecting, setIsSelecting] = useState(true);

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
          <p className='text-base text-rose-300'>
            Failed to load sets: {error.message}
          </p>
        </div>
      </main>
    );
  }

  const addWordToSet = async (wordId: number) => {
    try {
      await api.post(`/sets/${setId}/words`, { wordId });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['sets', setId, 'words'] }),
        queryClient.invalidateQueries({ queryKey: ['words'] }),
      ]);
    } catch (addError) {
      console.error('Failed to add word to set:', addError);
    }
  };

  const deleteWordFromSet = async (wordId: number) => {
    try {
      await removeWordFromSet(setId, wordId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['sets', setId, 'words'] }),
        queryClient.invalidateQueries({ queryKey: ['words'] }),
      ]);
    } catch (removeError) {
      console.error('Failed to remove word from set:', removeError);
    }
  };

  const startLearning = () => {
    if (!words?.length) return;
    setIsSelecting(false);
  };

  const stopLearning = () => {
    setIsSelecting(true);
  };

  if (!words || words.length === 0) {
    return (
      <main className={pageWrapperClasses}>
        <div className='mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 text-center'>
          <h1 className='text-3xl font-bold'>Add Words to Set</h1>
          <div className={panelClasses}>
            {allLoading ? (
              <p className='text-zinc-400'>Loading words...</p>
            ) : allError ? (
              <p className='text-rose-300'>
                Failed to load words: {allError.message}
              </p>
            ) : (
              <div className='grid gap-4'>
                {allWords?.map((word) => (
                  <div key={word.id} className={wordRowClasses}>
                    {renderWordSummary(word)}
                    <Button
                      onClick={() => addWordToSet(word.id)}
                      className='rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 shadow-lg transition hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500/60'
                    >
                      Add to Set
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (isSelecting) {
    const wordsInSetIds = new Set(words.map((w) => w.id));
    const wordsToAdd = allWords?.filter((w) => !wordsInSetIds.has(w.id));

    return (
      <main className={pageWrapperClasses}>
        <div className='mx-auto flex w-full max-w-5xl flex-col gap-8'>
          <section className='space-y-4 text-center'>
            <h1 className='text-3xl font-bold'>Words in Set</h1>
            <div className={panelClasses}>
              {words.length === 0 ? (
                <p className='text-zinc-400'>No words in this set yet.</p>
              ) : (
                <div className='grid gap-3'>
                  {words.map((word) => (
                    <div key={word.id} className={wordRowClasses}>
                      {renderWordSummary(word)}
                      <Button
                        onClick={() => deleteWordFromSet(word.id)}
                        variant='outline'
                        className='rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-500/60'
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {words.length > 0 && (
            <div className='flex justify-center'>
              <Button
                onClick={startLearning}
                className='rounded-lg bg-zinc-800 px-8 py-3 text-lg font-semibold text-zinc-100 shadow-lg transition hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500/60'
              >
                Start Learning
              </Button>
            </div>
          )}

          <section className='space-y-3 text-center'>
            <h2 className='text-2xl font-semibold'>Add Words to Set</h2>
            <div className={panelClasses}>
              {allLoading ? (
                <p className='text-zinc-400'>Loading words...</p>
              ) : allError ? (
                <p className='text-rose-300'>
                  Failed to load words: {allError.message}
                </p>
              ) : wordsToAdd?.length === 0 ? (
                <p className='text-zinc-400'>No more words to add.</p>
              ) : (
                <div className='grid gap-4'>
                  {wordsToAdd?.map((word) => (
                    <div key={word.id} className={wordRowClasses}>
                      {renderWordSummary(word)}
                      <Button
                        onClick={() => addWordToSet(word.id)}
                        className='rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 shadow-lg transition hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500/60'
                      >
                        Add to Set
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={pageWrapperClasses}>
      <LearningTrainer words={words} onExit={stopLearning} />
    </main>
  );
}
