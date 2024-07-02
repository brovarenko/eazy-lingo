import { FC } from 'react';
import Words from '../../components/words';

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  return (
    <div className='flex '>
      <Words />
    </div>
  );
};

export default page;
