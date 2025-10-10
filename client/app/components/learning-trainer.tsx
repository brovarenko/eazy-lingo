'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
import { Mic, MicOff } from 'lucide-react';
import { postTrainingEvent } from '@/lib/api';

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
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentWord = words[currentIndex] ?? null;
  const answer = useMemo(() => {
    if (!currentWord) {
      return '';
    }

    return (tense === 'present' ? currentWord.german : currentWord.perfekt || currentWord.german) ?? '';
  }, [currentWord, tense]);
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
    setSpeechError(null);
    setIsListening(false);
    recognitionRef.current?.stop?.();
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

  const checkAnswer = useCallback(
    (inputOverride?: string) => {
      if (!currentWord) {
        return;
      }

      const inputToCheck = (inputOverride ?? userInput).trim();
      if (!inputToCheck) {
        return;
      }

      const normalizedInput = inputToCheck.toLowerCase();
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
        // fire-and-forget progress event
        try {
          void postTrainingEvent({ wordId: currentWord.id, result: 'correct', elapsedSeconds });
        } catch {}
      } else {
        setHasError(true);
        setResponseIndicator(null);
        setResponseTime(null);
        try {
          if (currentWord) {
            void postTrainingEvent({ wordId: currentWord.id, result: 'wrong' });
          }
        } catch {}
      }
    },
    [answer, currentIndex, currentWord, userInput, wordStartTime]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setSpeechError(event?.error ?? 'Speech recognition error');
    };

    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setUserInput(transcript);
        checkAnswer(transcript);
      }
    };

    recognitionRef.current = recognition;
    setIsSpeechSupported(true);

    return () => {
      recognition.stop();
      recognitionRef.current = null;
      setIsListening(false);
    };
  }, [checkAnswer]);

  const handleExit = () => {
    resetTrainerState();
    onExit();
  };

  const handleMicToggle = () => {
    if (!isSpeechSupported || !recognitionRef.current) {
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    setSpeechError(null);
    setHasError(false);

    try {
      recognitionRef.current.start();
    } catch (error) {
      setSpeechError('Unable to access microphone');
      setIsListening(false);
    }
  };

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
            <div className='flex justify-center'>
              <Button
                type='button'
                variant='outline'
                onClick={handleMicToggle}
                disabled={!isSpeechSupported}
                className='flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-800 disabled:opacity-60'
              >
                {isListening ? <MicOff className='h-4 w-4' /> : <Mic className='h-4 w-4' />}
                {isListening ? 'Listening…' : 'Speak'}
              </Button>
            </div>
            {!isSpeechSupported && (
              <p className='text-center text-xs text-zinc-500'>Speech recognition not supported in this browser.</p>
            )}
            {speechError && (
              <p className='text-center text-xs text-rose-300'>{speechError}</p>
            )}
            {hasError && (
              <p className='text-center text-sm text-rose-300'>
                Try again! The correct answer is: {answer}
              </p>
            )}
          </CardContent>
          <CardFooter className='flex flex-col gap-3'>
            <Button
              onClick={() => checkAnswer()}
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
