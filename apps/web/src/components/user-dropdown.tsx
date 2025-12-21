'use client';
import {
  User,
  Settings,
  Command,
  Monitor,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { useThemeManager } from '@/modules/settings/hooks';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { routes } from '@/lib/routes';
import { Skeleton } from './ui/skeleton';
import { useAuth } from '@/lib/auth';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/modules/profiles/hooks/useUserProfile';

interface UserDropdownProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onAccountSettings?: () => void;
  onCommandMenu?: () => void;
  onSignOut?: () => void;
}

export default function UserDropdown({}: UserDropdownProps) {
  const router = useRouter();
  const { currentTheme, switchTheme } = useThemeManager();
  const { profile } = useUserProfile();
  const { user, signOut } = useAuth();

  // Ensure SSR and first client render match
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleAccountSettings = useCallback(() => {
    router.push(routes.protected.dashboard.account.settings.root);
  }, [router]);

  const handleCommandMenu = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      metaKey: true,
    });
    document.dispatchEvent(event);
  };

  if (!mounted) {
    return <Skeleton className='h-8 w-8 rounded-full opacity-80  border' />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={profile?.data?.avatar_url ?? undefined}
              alt='user avatar'
            />
            <AvatarFallback>
              <User className='h-4 w-4 text-foreground' />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {user?.email || ''}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleAccountSettings}>
          <Settings className='mr-2 h-4 w-4' />
          <span>Account settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCommandMenu}>
          <Command className='mr-2 h-4 w-4' />
          <span>Command menu</span>
          <span className='ml-auto text-xs text-muted-foreground'>⌘K</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => switchTheme('light')}>
          <Sun className='mr-2 h-4 w-4' />
          <span>Light</span>
          {currentTheme === 'light' && <span className='ml-auto'>✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => switchTheme('dark')}>
          <Moon className='mr-2 h-4 w-4' />
          <span>Dark</span>
          {currentTheme === 'dark' && <span className='ml-auto'>✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => switchTheme('system')}>
          <Monitor className='mr-2 h-4 w-4' />
          <span>System</span>
          {currentTheme === 'system' && <span className='ml-auto'>✓</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
