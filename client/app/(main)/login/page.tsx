import Login from '@/app/components/login';
import { FC } from 'react';

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  return (
    <div className='flex '>
      <Login />
    </div>
  );
};

export default page;
