import Navbar from '../components/nav-bar';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col'>
      <Navbar />

      <main className='flex justify-center '>{children}</main>
    </div>
  );
};

export default MainLayout;
