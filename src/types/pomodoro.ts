export interface PomodoroSettings {
  sessionLength: number;
  breakLength: number;
  breaksEnabled: boolean;
  longerBreaksEnabled: boolean;
  longerBreaks: {
    frequency: number;
    length: number;
  };
}

export type TimerSettings = {
  enabled: boolean;
  useTimerForStats: boolean;
  sound: {
    enabled: boolean;
    soundName: string;
    volume: number;
  };
};
