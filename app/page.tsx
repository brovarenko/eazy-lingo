import Link from 'next/link';
import Words from './components/words';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Link
        className='p-3 rounded hover:bg-emerald-600 hover:text-white hover:shadow transition '
        href={`/home`}
      >
        go
      </Link>
    </main>
  );
}
