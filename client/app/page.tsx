import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-900 p-6'>
      <div className='container mx-auto flex flex-col justify-center items-center text-center'>
        <h1 className='text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4'>
          EazyLingo
        </h1>
        <p className='text-zinc-300 max-w-xl mb-8'>
          Learn words faster: create your own sets or choose ready-made ones.
        </p>
        <Link
          className='bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 px-6 rounded-md shadow transition'
          href={'/home'}
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
