export interface Session {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  actualLength?: number;
  breakAfterLength?: number;
}

export interface CompletedBreak {
  minutesDuration: number;
}

export interface BreakProps {
  breakStartDate: Date;
  minutesDuration: number;
}

export type SessionState = {
  sessions: Session[];
  completedBreaks: CompletedBreak[];
  onBreakProps?: BreakProps;
};
