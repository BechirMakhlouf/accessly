import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value == null; // true if null or undefined
}

/**
 * Validates email syntax using a comprehensive regex pattern
 * @param email - The email string to validate
 * @returns true if the email format is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailSchema = z.string().email();
  const emailValidation = emailSchema.safeParse(email);

  return emailValidation.success;
}
