import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value == null; // true if null or undefined
}
