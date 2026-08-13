import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Safely coerce API JSON to an array (handles error objects when DB is offline). */
export function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? data : []
}
