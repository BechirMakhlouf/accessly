import { useFormatter, useNow } from 'next-intl';

/**
 * Formats a date string to a human-readable relative time
 * @param dateString - ISO date string or date object
 * @returns Formatted relative time string
 */
export const useFormatRelativeDate = () => {
  const now = useNow();
  const format = useFormatter();
  
  return (dateString: string | Date): string => {
    const date = new Date(dateString);
    return format.relativeTime(date, now);
  };
};
