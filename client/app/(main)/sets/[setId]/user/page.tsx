'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import api, { useAllWords, useSetWords } from '@/lib/api';
import { Word } from '@/types';

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
  const { words, error, isLoading } = useSetWords(setId);
  const {
    words: allWords,
    error: allError,
    isLoading: allLoading,
  } = useAllWords();

  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isSelecting, setIsSelecting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(true);
  const [tense, setTense] = useState<'present' | 'perfect'>('present');

  const resetStudyState = () => {
    setProgress(0);
    setUserInput('');
    setHasError(false);
    setIsFlipped(true);
    setTense('present');
  };

  const getAnswer = (word: Word) =>
    (tense === 'present' ? word.german : word.perfekt || word.german) ?? '';

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
      window.location.reload();
    } catch (error) {
      console.error('Failed to add word to set:', error);
    }
  };

  const startLearning = () => {
    if (!words?.length) return;
    resetStudyState();
    setCurrentWord(words[0]);
    setIsSelecting(false);
  };

  const stopLearning = () => {
    resetStudyState();
    setCurrentWord(null);
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
    const wordsInSetIds = new Set(words?.map((w) => w.id));
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

  if (!currentWord) {
    return (
      <main className={pageWrapperClasses}>
        <div className='mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 text-center'>
          <h1 className='text-3xl font-bold'>Finished!</h1>
          <p className='text-zinc-400'>
            Great job! You can go back to the list and keep practicing.
          </p>
          <Button
            onClick={() => setIsSelecting(true)}
            className='rounded-lg bg-zinc-800 px-6 py-2 text-sm font-semibold text-zinc-100 shadow-lg transition hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500/60'
          >
            Back to sets
          </Button>
        </div>
      </main>
    );
  }

  const answer = getAnswer(currentWord);

  const checkAnswer = () => {
    const normalizedInput = userInput.trim().toLowerCase();
    const normalizedAnswer = answer.trim().toLowerCase();

    if (normalizedInput === normalizedAnswer) {
      const wordsCount = words.length || 1;
      const currentIndex = words.findIndex((word) => word.id === currentWord.id);
      const nextIndex = currentIndex + 1;

      setIsFlipped(true);
      setUserInput('');
      setHasError(false);
      setProgress((prev) =>
        nextIndex < wordsCount ? Math.min(100, prev + 100 / wordsCount) : 100
      );

      if (nextIndex < wordsCount) {
        setCurrentWord(words[nextIndex]);
      } else {
        setCurrentWord(null);
      }
    } else {
      setHasError(true);
    }
  };

  return (
    <main className={pageWrapperClasses}>
      <div className='mx-auto flex w-full max-w-lg flex-col gap-6'>
        <div className='space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl backdrop-blur'>
          <div className='flex items-center justify-between text-sm text-zinc-300'>
            <span>
              {words.findIndex((word) => word.id === currentWord.id) + 1} of {words.length}
            </span>
            <div className='flex gap-2'>
              <Button
                onClick={() => setTense('present')}
                size='sm'
                className={cn(
                  'rounded-md border border-zinc-700 bg-zinc-900/60 text-zinc-200 transition hover:bg-zinc-800',
                  tense === 'present' &&
                    'border-zinc-300 bg-zinc-300 text-zinc-900 hover:bg-zinc-300'
                )}
              >
                Present
              </Button>
              <Button
                onClick={() => setTense('perfect')}
                size='sm'
                className={cn(
                  'rounded-md border border-zinc-700 bg-zinc-900/60 text-zinc-200 transition hover:bg-zinc-800',
                  tense === 'perfect' &&
                    'border-zinc-300 bg-zinc-300 text-zinc-900 hover:bg-zinc-300'
                )}
              >
                Perfect
              </Button>
            </div>
          </div>
          <Progress
            value={progress}
            className='h-2 w-full overflow-hidden rounded-full bg-zinc-800 [&>div]:bg-zinc-200'
          />
        </div>

        <Card className='w-full border border-zinc-800 bg-zinc-900/70 shadow-2xl backdrop-blur'>
          <CardHeader>
            <CardTitle
              className='cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950/60 px-6 py-6 text-center text-2xl font-semibold text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-900'
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {isFlipped ? currentWord.english : answer}
            </CardTitle>
            <p className='mt-2 text-center text-sm text-zinc-400'>
              Click to {isFlipped ? 'reveal answer' : 'show question'}
            </p>
          </CardHeader>
          <CardContent className='space-y-3'>
            <Input
              type='text'
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  checkAnswer();
                }
              }}
              placeholder={`Enter ${
                tense === 'present' ? 'German' : 'Perfect tense'
              } translation`}
              className={cn(
                'w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-4 py-3 text-center text-lg font-medium text-zinc-100 placeholder:text-zinc-500 transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/40',
                hasError && '!border-rose-500 !bg-rose-500/10 text-rose-200 focus:ring-rose-400/40',
                !hasError &&
                  userInput.trim() !== '' &&
                  '!border-emerald-400 !bg-emerald-500/10 text-emerald-200 focus:ring-emerald-400/40'
              )}
            />
            {hasError && (
              <p className='text-center text-sm text-rose-300'>
                Try again! The correct answer is: {answer}
              </p>
            )}
          </CardContent>
          <CardFooter className='flex flex-col gap-3'>
            <Button
              onClick={checkAnswer}
              className='w-full rounded-xl bg-zinc-800 py-3 text-base font-semibold text-zinc-100 shadow-lg transition hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500/60 disabled:opacity-60'
              disabled={!userInput.trim()}
            >
              Check Answer
            </Button>
            <Button
              onClick={stopLearning}
              variant='outline'
              className='w-full rounded-xl border border-zinc-700 bg-zinc-900/60 text-zinc-100 transition hover:bg-zinc-800 hover:text-zinc-100'
            >
              Stop Learning
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
