'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  SlidersHorizontal,
  Search,
  File,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  showShortcut?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function AppSearchBar({
  placeholder = 'Search...',
  className,
  showShortcut = true,
  variant = 'outline',
  size = 'md',
}: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setSearch('');
  };

  const sizeClasses = {
    sm: 'h-8 text-xs md:w-32 lg:w-48',
    md: 'h-9 text-sm md:w-40 lg:w-64',
    lg: 'h-10 text-base md:w-48 lg:w-80',
  };

  return (
    <>
      <Button
        variant={variant}
        className={cn(
          'relative w-full justify-start rounded-[0.5rem] text-muted-foreground bg-transparent',
          showShortcut && 'sm:pr-12',
          sizeClasses[size],
          className
        )}
        onClick={() => setOpen(true)}
      >
        <Search className='mr-2 h-4 w-4' />
        <span className='truncate'>{placeholder}</span>
        {showShortcut && (
          <kbd className='pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex '>
            <span className='text-xs'>⌘</span>K
          </kbd>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='overflow-hidden p-0 shadow-lg'>
          <DialogHeader className='sr-only'>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <Command className='rounded-lg border shadow-md'>
            <CommandInput
              placeholder='Type a command or search...'
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup heading='Navigation'>
                <CommandItem onSelect={() => handleSelect('/')}>
                  <LayoutDashboard className='mr-2 h-4 w-4' />
                  <span>Dashboard</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect('/members')}>
                  <Users className='mr-2 h-4 w-4' />
                  <span>Members</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect('/settings')}>
                  <SlidersHorizontal className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading='Quick Actions'>
                <CommandItem onSelect={() => handleSelect('/search')}>
                  <Search className='mr-2 h-4 w-4' />
                  <span>Advanced Search</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect('/docs')}>
                  <File className='mr-2 h-4 w-4' />
                  <span>Documentation</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect('/help')}>
                  <File className='mr-2 h-4 w-4' />
                  <span>Help Center</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading='Settings'>
                <CommandItem onSelect={() => handleSelect('/profile')}>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Profile Settings</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect('/preferences')}>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Preferences</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
