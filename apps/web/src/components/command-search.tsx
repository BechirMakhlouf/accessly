'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  SlidersHorizontal,
  Search,
  File,
  Settings,
} from 'lucide-react';
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

interface CommandSearchProps {
  onClose: () => void;
}

export function CommandSearch({ onClose }: CommandSearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
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
            <span>Search</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('/docs')}>
            <File className='mr-2 h-4 w-4' />
            <span>Documentation</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading='Settings'>
          <CommandItem onSelect={() => handleSelect('/profile')}>
            <Settings className='mr-2 h-4 w-4' />
            <span>Profile</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
