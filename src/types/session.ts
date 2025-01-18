export interface Session {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export type SessionState = {
  sessions: Session[];
  completedBreakCount: number;
  onBreakProps?: {
    breakStartDate: Date;
  };
};
