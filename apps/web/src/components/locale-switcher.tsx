'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, Globe } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { localesInfo, usePathname, useRouter } from '@/lib/i18n';

export default function LocaleSwitcher() {
  const t = useTranslations('localeSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    setOpen(false);
    router.replace(pathname, { locale: newLocale });
    router.refresh();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          aria-label={t('ariaLabel')}
          className='justify-between bg-transparent'
        >
          <Globe className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder={t('searchPlaceholder')} />
          <CommandList>
            <CommandEmpty className='text-muted-foreground'>
              {t('empty')}
            </CommandEmpty>
            <CommandGroup>
              {localesInfo.map(opt => (
                <CommandItem
                  key={opt.code}
                  value={opt.name}
                  onSelect={() => handleLocaleChange(opt.code)}
                  className='flex items-center gap-2 text-foreground'
                >
                  {opt.name}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      locale === opt.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
