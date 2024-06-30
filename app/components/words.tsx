'use client';

import { useToast } from '@/components/ui/use-toast';

import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { type CarouselApi } from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';

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
  const [api, setApi] = useState<CarouselApi>();
  const [progress, setProgress] = useState(13);

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
    }
    setProgress((prev) => prev + 100 / words.length);
    setUserInput('');
    const nextIndex = words.indexOf(currentWord!) + 1;
    if (nextIndex < words.length) {
      setCurrentWord(words[nextIndex]);
    } else {
      setCurrentWord(null);
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
    <div className='flex justify-center items-center h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>{currentWord.english}</h1>

        <input
          type='text'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className='border rounded p-2 mb-4 text-sky-400'
        />
        <button
          onClick={checkAnswer}
          className='bg-blue-500 text-white p-2 rounded'
        >
          check
        </button>
        <Progress value={progress} className='w-[100%]' />
      </div>
    </div>
  );
}
