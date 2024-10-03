import Link from 'next/link';
import Words from './components/words';

export default function Home() {
  return (
    <div className='min-h-screen flex justify-center items-center bg-gradient-to-r from-green-500 to-green-900 p-6'>
      <div className='container mx-auto flex flex-col justify-center items-center'>
        <h2 className='text-4xl text-white font-bold mb-4'>Learn Easy</h2>
        <Link
          className='bg-white text-sm text-gray-700 font-semibold py-2 px-6 rounded'
          href={'/home'}
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
