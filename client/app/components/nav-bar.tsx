'use client';

import { LayoutDashboard, Library } from 'lucide-react';
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load sets: {error.message}</p>;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className='flex p-3 w-full justify-between items-center h-14 z-50 bg-neutral-900 border border-b-zinc-700 shadow-sm'>
      <div className='flex'>
        <Library color='#04f000' />
        <span className='px-1 text-lg'>EazyLingo</span>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
                <a
                  className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                  href={`/home`}
                >
                  home
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                  href={`/learn`}
                >
                  lern words
                </a>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {user ? (
        <div className='flex'>
          <div className='mr-2'>{user.name}</div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <Link href={'/login'}>Login</Link>
      )}
    </div>
  );
};

export default Navbar;
