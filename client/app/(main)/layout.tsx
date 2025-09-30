'use client';

import { ReactNode, useState } from 'react';
import Navbar from '@/app/components/nav-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function MainLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className='flex min-h-screen flex-col bg-zinc-950 text-zinc-100'>
        <Navbar />
        <main className='flex-1'>{children}</main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}