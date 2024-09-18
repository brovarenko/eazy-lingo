import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';

interface Word {
  id: number;
  english: string;
  german: string;
  perfekt: string;
}

interface WordSelectorProps {
  words: Word[];
  onSelectionChange: (selectedWords: Word[]) => void;
}

const WordSelector: React.FC<WordSelectorProps> = ({
  words,
  onSelectionChange,
}) => {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);

  const toggleWordSelection = (word: Word) => {
    setSelectedWords((prevSelectedWords) => {
      if (prevSelectedWords.includes(word)) {
        return prevSelectedWords.filter((w) => w.id !== word.id);
      } else {
        return [...prevSelectedWords, word];
      }
    });
  };

  useEffect(() => {
    onSelectionChange(selectedWords);
  }, [selectedWords, onSelectionChange]);

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Choose words</h2>
      <ScrollArea className='h-72 w-48 rounded-md border'>
        <ul className='space-y-2'>
          {words.map((word) => (
            <li key={word.id} className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={selectedWords.includes(word)}
                onChange={() => toggleWordSelection(word)}
              />
              <span>{word.english}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default WordSelector;
