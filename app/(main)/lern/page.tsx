import { FC } from 'react';
import Words from '../../components/words';
import WordSelector from '@/app/components/word-selector';

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  return (
    <div className='flex '>
      <Words />
    </div>
  );
};

export default page;
