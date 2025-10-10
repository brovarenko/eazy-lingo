"use client";

import { FC, useMemo, useState } from 'react';
import { useProgress, updateWordStatus, type WordStatus } from '@/lib/api';
import { Button } from '@/components/ui/button';

const tabs: { key: WordStatus; label: string }[] = [
  { key: 'LEARNED', label: 'Learned' },
  { key: 'KNOWN', label: 'Known' },
  { key: 'LEARNING', label: 'Learning' },
];

const Page: FC = () => {
  const [active, setActive] = useState<WordStatus>('LEARNED');
  const [search, setSearch] = useState('');
  const { items, isLoading, error, mutate } = useProgress({ status: active, search });

  const grouped = useMemo(() => items ?? [], [items]);

  return (
    <div className='flex w-full justify-center px-4'>
      <div className='w-full max-w-5xl'>
        <div className='flex items-center justify-between my-6'>
          <h2 className='text-3xl font-semibold tracking-tight'>Progress</h2>
        </div>

        <div className='mb-4 flex flex-wrap items-center gap-2'>
          {tabs.map((t) => (
            <Button
              key={t.key}
              size='sm'
              variant={active === t.key ? 'default' : 'outline'}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </Button>
          ))}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search words...'
            className='ml-auto rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none'
          />
        </div>

        {isLoading ? (
          <p className='text-zinc-400'>Loading progress…</p>
        ) : error ? (
          <p className='text-rose-400'>Failed to load progress</p>
        ) : grouped.length === 0 ? (
          <p className='text-zinc-400'>No words in this category yet.</p>
        ) : (
          <div className='grid gap-3 sm:grid-cols-2'>
            {grouped.map((it) => (
              <div
                key={`${it.userId}-${it.wordId}`}
                className='flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3'
              >
                <div className='min-w-0'>
                  <div className='truncate text-base font-semibold text-zinc-100'>
                    {it.word.english}
                  </div>
                  <div className='truncate text-sm text-zinc-300'>
                    {it.word.german}
                    {it.word.perfekt ? (
                      <span className='text-zinc-500'> · Perfekt: {it.word.perfekt}</span>
                    ) : null}
                  </div>
                  <div className='text-xs text-zinc-500'>
                    Correct: {it.correctCount} · Wrong: {it.wrongCount} · Streak: {it.streak}
                  </div>
                </div>
                <div className='flex shrink-0 gap-2'>
                  {active !== 'KNOWN' && (
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={async () => {
                        await updateWordStatus(it.wordId, 'KNOWN');
                        mutate();
                      }}
                    >
                      Mark Known
                    </Button>
                  )}
                  {active !== 'LEARNING' && (
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={async () => {
                        await updateWordStatus(it.wordId, 'LEARNING');
                        mutate();
                      }}
                    >
                      To Learning
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
