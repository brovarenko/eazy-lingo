'use client';

import { useEffect, useState } from 'react';

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
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useSetWords, useUser } from '@/lib/api';
import { Word } from '@/types';

export default function WordsPage({ params }: { params: { setId: string } }) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isSelecting, setIsSelecting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [falseValue, setFalseValue] = useState(false);
  const [isFlipped, setIsFlipped] = useState(true);
  const [tense, setTense] = useState<'present' | 'perfect'>('present');

  const setId = params.setId;
  const { words, error, isLoading } = useSetWords(setId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load sets: {error.message}</p>;

  if (!words || words.length === 0) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>No words found for the selected set.</p>
      </div>
    );
  }

  const checkAnswer = () => {
    if (
      currentWord &&
      userInput.trim().toLowerCase() ===
        currentWord[tense === 'present' ? 'german' : 'perfekt'].toLowerCase()
    ) {
      setIsFlipped(true);
      setProgress((prev) => prev + 100 / words.length);

      setUserInput('');
      setFalseValue(false);

      const nextIndex = words.indexOf(currentWord!) + 1;

      if (nextIndex < words.length) {
        setCurrentWord(words[nextIndex]);
        console.log(currentWord);
      } else {
        setCurrentWord(words[0]);
      }
    } else {
      setFalseValue(true);
    }
  };

  const startLearning = () => {
    setCurrentWord(words[0]);
    setIsSelecting(false);
  };

  const stopLearning = () => {
    setCurrentWord(null);
  };

  if (isSelecting) {
    return (
      <div className='flex justify-center w-full h-screen dark:bg-gray-900'>
        <div>
          <h1 className='text-2xl font-bold mb-4'>Set Words</h1>
          {words?.length === 0 ? (
            <p>No sets found.</p>
          ) : (
            words?.map((word) => (
              <div key={word.id} className='mb-2'>
                <Label htmlFor={`word-${word.id}`} className='ml-2'>
                  {word.english}
                </Label>
              </div>
            ))
          )}
          <button
            onClick={startLearning}
            className='bg-blue-500 text-white p-2 rounded mt-4'
            disabled={words.length === 0}
          >
            Start
          </button>
          <div className='p-2'>Add word to set</div>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Finish!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <Card className='max-w-md w-full'>
        <CardHeader>
          <CardTitle
            className='cursor-pointer mb-4 p-4 border rounded'
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {isFlipped
              ? currentWord.english
              : currentWord[tense === 'present' ? 'german' : 'perfekt']}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type='text'
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className={cn('border rounded p-2', {
              'border-red-500 text-red-500': falseValue,
            })}
          />
        </CardContent>
        <CardFooter className='flex flex-col justify-between'>
          <Button onClick={checkAnswer} className='m-4'>
            Check
          </Button>
          <Button onClick={stopLearning} className='m-4'>
            Stop
          </Button>
          <Progress value={progress} className='w-full' />
        </CardFooter>
      </Card>
    </div>
  );
}
