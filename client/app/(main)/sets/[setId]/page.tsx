'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useSetById } from '@/lib/api';

const pageWrapperClasses =
  'min-h-screen w-full bg-zinc-950 px-4 py-10 text-zinc-100';
const panelClasses =
  'rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur';
const wordRowClasses =
  'flex flex-col gap-1 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-left text-sm text-zinc-300';

export default function CommonSetPage({
  params,
}: {
  params: { setId: string };
}) {
  const router = useRouter();
  const { set, error, isLoading } = useSetById(params.setId);

  if (isLoading) {
    return (
      <main className={pageWrapperClasses}>
        <div className='mx-auto flex w-full max-w-xl flex-1 items-center justify-center text-center'>
          <p className='text-base text-zinc-400'>Loading set...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={pageWrapperClasses}>
        <div className='mx-auto flex w-full max-w-xl flex-1 items-center justify-center text-center'>
          <p className='text-base text-rose-300'>
            Failed to load set: {error.message}
          </p>
        </div>
      </main>
    );
  }

  const words = set?.words ?? [];

  return (
    <main className={pageWrapperClasses}>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
        <section className={panelClasses}>
          <div className='flex flex-col gap-2 border-b border-zinc-800 pb-4'>
            <h1 className='text-3xl font-semibold text-zinc-100'>{set?.name}</h1>
            <p className='text-sm text-zinc-400'>
              Ready-made vocabulary list - {words.length} words
            </p>
          </div>

          <div className='mt-6 grid gap-3 sm:grid-cols-2'>
            {words.length === 0 ? (
              <p className='text-sm text-zinc-400'>This set has no words yet.</p>
            ) : (
              words.map((word) => (
                <div key={word.id} className={wordRowClasses}>
                  <span className='text-base font-semibold text-zinc-100'>
                    {word.english}
                  </span>
                  <span className='text-sm text-zinc-300'>{word.german}</span>
                  {word.perfekt ? (
                    <span className='text-xs text-zinc-500'>Perfekt: {word.perfekt}</span>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </section>

        <div className='flex justify-center'>
          <Button
            size='lg'
            className='rounded-xl bg-zinc-800 px-8 py-3 text-base font-semibold text-zinc-100 shadow-lg transition hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500/60'
            disabled={!words.length}
            onClick={() => router.push(`/sets/${params.setId}/user`)}
          >
            Start Learning
          </Button>
        </div>
      </div>
    </main>
  );
}