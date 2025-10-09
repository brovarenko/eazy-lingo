import { FC } from 'react';

const Page: FC = () => {
  //   if (isLoading || isCommonLoading) return <p>Loading...</p>;
  //   if (error) return <p>Failed to load sets: {error.message}</p>;

  return (
    <div className='flex w-full justify-center px-4'>
      <div className='w-full max-w-5xl'>
        <div className='flex items-center justify-between my-6'>
          <h2 className='text-3xl font-semibold tracking-tight'>Progress</h2>
        </div>
        <p className='text-zinc-400'>Progress tracking coming soon!</p>
      </div>
    </div>
  );
};

export default Page;
