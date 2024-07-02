'use client';

import { useToast } from '@/components/ui/use-toast';

import { useEffect, useState } from 'react';

import { Progress } from '@/components/ui/progress';
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

interface Word {
  id: number;
  english: string;
  german: string;
}

export default function Words() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const [progress, setProgress] = useState(13);
  const [falseValue, setFalseValue] = useState(false);

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
      userInput.trim().toLowerCase() === currentWord.german.toLowerCase()
    ) {
      setScore(score + 1);
      toast({
        description: 'Correct',
      });

      setProgress((prev) => prev + 100 / words.length);
      setUserInput('');
      setFalseValue(false);
      const nextIndex = words.indexOf(currentWord!) + 1;
      if (nextIndex < words.length) {
        setCurrentWord(words[nextIndex]);
      } else {
        setCurrentWord(null);
      }
    } else {
      setFalseValue(true);
    }
  };

  if (!currentWord) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Вы закончили!</h1>
          <p className='mt-4'>
            Ваш результат: {score} из {words.length}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center '>
      <div className='text-center '>
        <Card className='m-2'>
          <CardHeader>
            <CardTitle>{currentWord.english}</CardTitle>
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
            <Progress value={progress} className='w-[100%]' />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
