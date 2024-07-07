'use client';

import { useToast } from '@/components/ui/use-toast';

import { useEffect, useState } from 'react';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import WordSelector from './word-selector';

interface Word {
  id: number;
  english: string;
  german: string;
  perfekt: string;
}

export default function Words() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);

  const [isSelecting, setIsSelecting] = useState(true);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [progress, setProgress] = useState(13);
  const [falseValue, setFalseValue] = useState(false);
  const [isFlipped, setIsFlipped] = useState(true);
  const [tense, setTense] = useState<'present' | 'perfect'>('present');

  const { toast } = useToast();

  useEffect(() => {
    async function fetchWords() {
      const response = await fetch('/api/words');
      const data = await response.json();
      setWords(data);
      setCurrentWord(data[0]);
    }
    fetchWords();
  }, []);

  const checkAnswer = () => {
    if (
      currentWord &&
      userInput.trim().toLowerCase() ===
        currentWord[tense === 'present' ? 'german' : 'perfekt'].toLowerCase()
    ) {
      setScore(score + 1);
      toast({
        description: 'Correct',
      });
      setIsFlipped(true);
      setProgress((prev) => prev + 100 / selectedWords.length);
      setUserInput('');
      setFalseValue(false);
      const nextIndex = selectedWords.indexOf(currentWord!) + 1;
      if (nextIndex < selectedWords.length) {
        setCurrentWord(selectedWords[nextIndex]);
      } else {
        //setCurrentWord(null);
        setCurrentWord(selectedWords[0]);
      }
    } else {
      setFalseValue(true);
    }
  };

  const startLearning = () => {
    setCurrentWord(selectedWords[0]);
    setIsSelecting(false);
  };

  const stopLearning = () => {
    setCurrentWord(null);
  };

  if (isSelecting) {
    return (
      <div className='flex justify-center items-center h-screen dark:bg-gray-900'>
        <WordSelector words={words} onSelectionChange={setSelectedWords} />
        <button
          onClick={startLearning}
          className='bg-blue-500 text-white p-2 rounded mt-4'
          disabled={selectedWords.length === 0}
        >
          start
        </button>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Finish!</h1>
          <p className='mt-4'>
            Your score: {score} из {selectedWords.length}
          </p>
        </div>
      </div>
    );
  }
  console.log(tense);
  return (
    <div className='flex justify-center items-center '>
      <div className='text-center '>
        <Card className='m-2'>
          <CardHeader>
            <div className='mb-4'>
              <label className='mr-4'>
                <input
                  type='radio'
                  value='present'
                  checked={tense === 'present'}
                  onChange={() => setTense('present')}
                  className='mr-2'
                />
                present
              </label>
              <label>
                <input
                  type='radio'
                  value='perfect'
                  checked={tense === 'perfect'}
                  onChange={() => setTense('perfect')}
                  className='mr-2'
                />
                perfect
              </label>
            </div>
            <CardTitle
              className='cursor-pointer mb-4 p-4 border rounded dark:bg-gray-800 dark:border-gray-700'
              onClick={() => {
                setIsFlipped(!isFlipped);
              }}
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
              className={cn('border rounded p-2 ', {
                'border-red-500 text-red-500': falseValue,
                'text-gray-400': !falseValue,
              })}
            />
          </CardContent>
          <CardFooter className='flex flex-col justify-between'>
            <Button onClick={checkAnswer} className='m-4'>
              check
            </Button>
            <Button onClick={stopLearning} className='m-4'>
              stop
            </Button>
            {/* <Progress value={progress} className='w-[100%]' /> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
