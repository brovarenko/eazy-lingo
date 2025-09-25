'use client';

import { Library, LogOut, User as UserIcon } from 'lucide-react';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

import { logout, useUser } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div className='h-14' />;
  if (error) return <div className='h-14' />;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className='flex p-3 w-full justify-between items-center h-14 z-50 bg-neutral-900/80 backdrop-blur border border-b-zinc-800 shadow-sm'>
      <Link href={'/home'} className='flex items-center gap-2'>
        <Library className='text-green-400' />
        <span className='text-lg font-semibold tracking-tight'>EazyLingo</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Navigation</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
                <a
                  className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                  href={`/home`}
                >
                  Home
                </a>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {user ? (
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 text-sm text-zinc-300'>
            <UserIcon size={16} />
            <span>{user.name}</span>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={handleLogout}
            className='gap-2'
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      ) : (
        <Link href={'/login'}>Login</Link>
      )}
    </div>
  );
};

export default Navbar;
