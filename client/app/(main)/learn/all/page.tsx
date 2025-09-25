'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAllWords } from '@/lib/api';
import { Word } from '@/types';
import { cn } from '@/lib/utils';

const LearnAllPage: FC = () => {
  const { words, error, isLoading } = useAllWords();
  const router = useRouter();

  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isSelecting, setIsSelecting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [falseValue, setFalseValue] = useState(false);
  const [isFlipped, setIsFlipped] = useState(true);
  const [tense, setTense] = useState<'present' | 'perfect'>('present');

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load words: {error.message}</p>;

  const checkAnswer = () => {
    if (
      currentWord &&
      userInput.trim().toLowerCase() ===
        currentWord[tense === 'present' ? 'german' : 'perfekt'].toLowerCase()
    ) {
      setIsFlipped(true);
      setProgress((prev) => prev + 100 / (words?.length || 1));

      setUserInput('');
      setFalseValue(false);

      const nextIndex = words?.indexOf(currentWord!) + 1;

      if (nextIndex && nextIndex < (words?.length || 0)) {
        setCurrentWord(words![nextIndex]);
      } else {
        setCurrentWord(words![0]);
      }
    } else {
      setFalseValue(true);
    }
  };

  const startLearning = () => {
    if (words && words.length > 0) {
      setCurrentWord(words[0]);
      setIsSelecting(false);
    }
  };

  const stopLearning = () => {
    setCurrentWord(null);
    setIsSelecting(true);
    setProgress(0);
  };

  if (!words || words.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-4'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold mb-4'>No Words Available</h1>
          <p className='text-gray-600 mb-6'>There are no words to learn yet.</p>
          <Button onClick={() => router.push('/home')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (isSelecting) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-4'>
        <div className='max-w-2xl w-full'>
          <h1 className='text-3xl font-bold text-center mb-6'>
            Learn All Words
          </h1>
          <p className='text-center text-gray-600 mb-6'>
            Practice with all available words ({words.length} words)
          </p>

          <div className='mb-6'>
            <div className='flex gap-4 justify-center mb-4'>
              <Button
                onClick={() => setTense('present')}
                className={tense === 'present' ? 'bg-blue-500' : 'bg-gray-300'}
              >
                Present Tense
              </Button>
              <Button
                onClick={() => setTense('perfect')}
                className={tense === 'perfect' ? 'bg-blue-500' : 'bg-gray-300'}
              >
                Perfect Tense
              </Button>
            </div>
          </div>

          <div className='text-center'>
            <Button
              onClick={startLearning}
              className='bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg'
            >
              Start Learning All Words
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Finish!</h1>
          <p className='text-gray-600 mt-4'>You've completed all words!</p>
          <Button onClick={stopLearning} className='mt-4'>
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='max-w-md w-full'>
        <div className='mb-4'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm text-gray-600'>
              {words.indexOf(currentWord) + 1} of {words.length}
            </span>
            <div className='flex gap-2'>
              <Button
                onClick={() => setTense('present')}
                size='sm'
                className={tense === 'present' ? 'bg-blue-500' : 'bg-gray-300'}
              >
                Present
              </Button>
              <Button
                onClick={() => setTense('perfect')}
                size='sm'
                className={tense === 'perfect' ? 'bg-blue-500' : 'bg-gray-300'}
              >
                Perfect
              </Button>
            </div>
          </div>
          <Progress value={progress} className='w-full' />
        </div>

        <Card className='w-full'>
          <CardHeader>
            <CardTitle
              className='cursor-pointer text-center p-6 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {isFlipped
                ? currentWord.english
                : currentWord[tense === 'present' ? 'german' : 'perfekt']}
            </CardTitle>
            <p className='text-center text-sm text-gray-500 mt-2'>
              Click to {isFlipped ? 'reveal answer' : 'show question'}
            </p>
          </CardHeader>
          <CardContent>
            <Input
              type='text'
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder={`Enter ${
                tense === 'present' ? 'German' : 'Perfect tense'
              } translation`}
              className={cn('w-full p-3 text-center text-lg', {
                'border-red-500 text-red-500 bg-red-50': falseValue,
                'border-green-500 text-green-500 bg-green-50':
                  !falseValue && userInput.trim() !== '',
              })}
            />
            {falseValue && (
              <p className='text-red-500 text-sm mt-2 text-center'>
                Try again! The correct answer is:{' '}
                {currentWord[tense === 'present' ? 'german' : 'perfekt']}
              </p>
            )}
          </CardContent>
          <CardFooter className='flex flex-col gap-3'>
            <Button
              onClick={checkAnswer}
              className='w-full bg-blue-500 hover:bg-blue-600'
              disabled={!userInput.trim()}
            >
              Check Answer
            </Button>
            <Button onClick={stopLearning} variant='outline' className='w-full'>
              Stop Learning
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LearnAllPage;
