import { LayoutDashboard, Library } from 'lucide-react';
import { FC } from 'react';

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

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
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
      <Link href={'/login'}>Login</Link>
    </div>
  );
};

export default Navbar;
