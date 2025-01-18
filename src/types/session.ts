export interface Session {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface BreakProps {
  breakStartDate: Date;
  title: string;
}

export type SessionState = {
  sessions: Session[];
  completedBreakCount: number;
  onBreakProps?: BreakProps;
};
