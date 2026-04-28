import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export async function apiFetch(url: string, opts?: RequestInit): Promise<Response> {
  const res = await fetch(url, opts)
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`${opts?.method ?? 'GET'} ${url} → ${res.status}: ${text}`)
  }
  return res
}
