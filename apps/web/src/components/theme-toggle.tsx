'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeManager } from '@/modules/settings/hooks';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';

export const ThemeToggle = React.memo(function ThemeToggle() {
  const { switchTheme } = useThemeManager();
  const t = useTranslations('themeToggle');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='border-none'>
          <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>{t('name')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='border-none'>
        <DropdownMenuItem onClick={() => switchTheme('light')}>
          {t('light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchTheme('dark')}>
          {t('dark')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchTheme('system')}>
          {t('system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
