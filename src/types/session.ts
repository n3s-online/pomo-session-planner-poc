export interface Session {
  id: string;
  title: string;
  description?: string;
  sessionStartDate?: Date;
  sessionEndDate?: Date;
  completed: boolean;
  actualLength?: number;
  breakAfterLength?: number;
}

export interface CompletedBreak {
  minutesDuration: number;
  breakStartDate: Date;
  breakEndDate: Date;
}

export interface BreakProps {
  breakStartDate: Date;
  breakEndDate?: Date;
  minutesDuration: number;
}

export type SessionState = {
  sessions: Session[];
  completedBreaks: CompletedBreak[];
  onBreakProps?: BreakProps;
};
