import { PomodoroSettings } from "@/types/pomodoro";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBreakLength = (
  settings: PomodoroSettings,
  numberOfPreviouslyCompletedBreaks: number
): number => {
  if (!settings.breaksEnabled) {
    return 0;
  }
  if (!settings.longerBreaksEnabled) {
    return settings.breakLength;
  }
  return (numberOfPreviouslyCompletedBreaks + 1) %
    settings.longerBreaks.frequency ===
    0
    ? settings.longerBreaks.length
    : settings.breakLength;
};
