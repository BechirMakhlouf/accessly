'use client';

import { useQueryState, parseAsString } from 'nuqs';

import { Button } from '@/components/ui/button';

type ClearSearchButtonProps = {
  label: string;
};

export function ClearSearchButton({ label }: ClearSearchButtonProps) {
  const [, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );

  return (
    <Button variant='outline' onClick={() => setSearchQuery(null)}>
      {label}
    </Button>
  );
}
