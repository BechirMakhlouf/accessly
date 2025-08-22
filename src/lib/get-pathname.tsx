// lib/server-pathname.ts
import { headers } from 'next/headers';

// bayi: this relies on the middleware setting the x-pathname header
export async function getPathname(): Promise<string> {
  return (await headers()).get('x-pathname') || '';
}
