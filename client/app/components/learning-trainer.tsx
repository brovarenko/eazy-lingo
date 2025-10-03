'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Word } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type ResponseIndicatorColor = 'green' | 'yellow' | 'red';

type LearningTrainerProps = {
  words: Word[];
  onExit: () => void;
  onComplete?: () => void;
};

const indicatorColorMap: Record<ResponseIndicatorColor, string> = {
  green: 'bg-emerald-400',
  yellow: 'bg-amber-400',
  red: 'bg-rose-400',
};

const getTimeIndicator = (elapsedSeconds: number): ResponseIndicatorColor => {
  if (elapsedSeconds < 3) {
    return 'green';
  }
  if (elapsedSeconds < 5) {
    return 'yellow';
  }
  return 'red';
};

export function LearningTrainer({ words, onExit, onComplete }: LearningTrainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(true);
  const [tense, setTense] = useState<'present' | 'perfect'>('present');
  const [wordStartTime, setWordStartTime] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseIndicator, setResponseIndicator] =
    useState<ResponseIndicatorColor | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const currentWord = words[currentIndex] ?? null;
  const progress = words.length ? Math.min(100, (currentIndex / words.length) * 100) : 0;

  const resetTrainerState = () => {
    setCurrentIndex(0);
    setUserInput('');
    setHasError(false);
    setIsFlipped(true);
    setTense('present');
    setResponseIndicator(null);
    setResponseTime(null);
    setWordStartTime(null);
    setHasCompleted(false);
  };

  useEffect(() => {
    resetTrainerState();
  }, [words]);

  useEffect(() => {
    if (currentWord) {
      setWordStartTime(Date.now());
    }
  }, [currentWord?.id]);

  useEffect(() => {
    if (!currentWord && words.length && currentIndex >= words.length && !hasCompleted) {
      setHasCompleted(true);
      onComplete?.();
    }
  }, [currentWord, currentIndex, hasCompleted, onComplete, words.length]);

  if (!words.length) {
    return (
      <div className='mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 text-center'>
        <h2 className='text-2xl font-semibold text-zinc-100'>No words available</h2>
        <Button
          onClick={() => {
            resetTrainerState();
            onExit();
          }}
          className='rounded-lg bg-zinc-800 px-6 py-2 text-sm font-semibold text-zinc-100 shadow-lg transition hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500/60'
        >
          Back
        </Button>
      </div>
    );
  }

  const answer = currentWord
    ? (tense === 'present' ? currentWord.german : currentWord.perfekt || currentWord.german) ?? ''
    : '';

  const handleExit = () => {
    resetTrainerState();
    onExit();
  };

  const checkAnswer = () => {
    if (!currentWord) {
      return;
    }

    const normalizedInput = userInput.trim().toLowerCase();
    const normalizedAnswer = answer.trim().toLowerCase();

    if (normalizedInput === normalizedAnswer) {
      const now = Date.now();
      const startedAt = wordStartTime ?? now;
      const elapsedSeconds = (now - startedAt) / 1000;
      const indicator = getTimeIndicator(elapsedSeconds);

      const nextIndex = currentIndex + 1;

      setIsFlipped(true);
      setUserInput('');
      setHasError(false);
      setResponseIndicator(indicator);
      setResponseTime(elapsedSeconds);
      setCurrentIndex(nextIndex);
    } else {
      setHasError(true);
      setResponseIndicator(null);
      setResponseTime(null);
    }
  };

  if (!currentWord) {
    return (
      <div className='mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 text-center'>
        <h1 className='text-3xl font-bold text-zinc-100'>Finished!</h1>
        <p className='text-zinc-400'>Great job! You can keep practicing or return to your sets.</p>
        <Button
          onClick={handleExit}
          className='rounded-lg bg-zinc-800 px-6 py-2 text-sm font-semibold text-zinc-100 shadow-lg transition hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500/60'
        >
          Back to sets
        </Button>
      </div>
    );
  }

  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-6'>
      <div className='space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl backdrop-blur'>
        <div className='flex-col items-center justify-center content-center text-sm text-zinc-300'>
          <span>
            {currentIndex + 1} of {words.length}
          </span>
          <div className='flex items-center gap-3'>
            <div className='my-4 flex gap-2'>
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
          <div className='my-2'>
            {responseIndicator && responseTime !== null && (
              <div className='flex items-center gap-1 text-xs text-zinc-400'>
                <span
                  className={cn(
                    'inline-flex h-2.5 w-2.5 rounded-full',
                    indicatorColorMap[responseIndicator]
                  )}
                />
                <span>{responseTime.toFixed(1)}s</span>
              </div>
            )}
          </div>
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
                hasError &&
                  '!border-rose-500 !bg-rose-500/10 text-rose-200 focus:ring-rose-400/40',
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
              onClick={handleExit}
              variant='outline'
              className='w-full rounded-xl border border-zinc-700 bg-zinc-900/60 text-zinc-100 transition hover:bg-zinc-800 hover:text-zinc-100'
            >
              Stop Learning
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
