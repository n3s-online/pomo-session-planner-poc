import { atomWithStorage } from "jotai/utils";
import { STORAGE_KEYS } from "./constants";
import { PomodoroSettings, TimerSettings } from "@/types/pomodoro";

export const pomodoroSettingsAtom = atomWithStorage<PomodoroSettings>(
  STORAGE_KEYS.SETTINGS,
  {
    sessionLength: 25,
    breakLength: 5,
    longerBreaks: {
      frequency: 3,
      length: 15,
    },
  } satisfies PomodoroSettings
);

export const timerSettingsAtom = atomWithStorage<TimerSettings>(
  STORAGE_KEYS.TIMER_SETTINGS,
  {
    enabled: true,
    useTimerForStats: false,
  } satisfies TimerSettings
);
