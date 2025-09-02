/**
 * Formats a date string to a human-readable relative time
 * @param dateString - ISO date string
 * @returns Formatted relative time string
 */
import { useFormatter } from 'next-intl';

export const useFormatRelativeDate = () => {
  const format = useFormatter();
  
  return (dateString: string): string => {
    const date = new Date(dateString);
    return format.relativeTime(date);
  };
};
