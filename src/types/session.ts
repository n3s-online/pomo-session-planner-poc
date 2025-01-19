type SessionBase = {
  id: string;
  title: string;
  description?: string;
  sessionStartDate?: Date;
};

export type PendingSession = SessionBase & {
  completed: false;
};

export type CompletedSession = SessionBase & {
  completed: true;
  sessionEndDate: Date;
  actualLength: number;
  breakAfterLength?: number;
};

export type Session = PendingSession | CompletedSession;

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
  pendingSessions: PendingSession[];
  completedSessions: CompletedSession[];
  completedBreaks: CompletedBreak[];
  onBreakProps?: BreakProps;
};
