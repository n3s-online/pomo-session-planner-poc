export interface PomodoroSettings {
  sessionLength: number;
  breakLength: number;
  longerBreaks?: {
    frequency: number;
    length: number;
  };
}
