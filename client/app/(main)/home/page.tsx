import { FC } from 'react';
import Words from '../../components/words';
import Profile from '@/app/components/profile';

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  return (
    <div className='flex w-full'>
      <div>Home</div>
      <Profile />
    </div>
  );
};

export default page;
