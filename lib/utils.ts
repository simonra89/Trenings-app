import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const estimate1RM = (weightKg: number, reps: number) =>
  Number((weightKg * (1 + reps / 30)).toFixed(2));
