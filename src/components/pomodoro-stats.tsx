import { SessionState } from "@/types/session";
import { PomodoroSettings } from "@/types/pomodoro";
import { useAtomValue } from "jotai";
import { sessionsAtom } from "@/stores/sessions-store";
import { pomodoroSettingsAtom } from "@/stores/settings-store";
import { getBreakLength } from "@/lib/utils";

type SessionStats = {
  hoursRemaining: number;
  minutesRemaining: number;
};

const convertTotalMinutes = (totalMinutes: number): SessionStats => {
  return {
    hoursRemaining: Math.floor(totalMinutes / 60),
    minutesRemaining: totalMinutes % 60,
  };
};

function calculatePendingSessionStats(
  sessionState: SessionState,
  settings: PomodoroSettings
): SessionStats {
  let totalMinutes = 0;
  let completedBreaks = sessionState.completedBreaks.length;
  if (sessionState.onBreakProps) {
    totalMinutes += sessionState.onBreakProps.minutesDuration;
    completedBreaks += 1;
  }
  totalMinutes += sessionState.pendingSessions.length * settings.sessionLength;
  for (let i = 0; i < sessionState.pendingSessions.length - 1; i++) {
    totalMinutes += getBreakLength(settings, completedBreaks + i);
  }
  return convertTotalMinutes(totalMinutes);
}

function calculateCompletedSessionStats(
  { completedSessions }: SessionState,
  settings: PomodoroSettings
): SessionStats {
  let totalMinutes = 0;
  for (const session of completedSessions) {
    const sessionLength = session.actualLength || settings.sessionLength;
    totalMinutes += sessionLength;
    if (session.breakAfterLength) {
      totalMinutes += session.breakAfterLength;
    }
  }
  return convertTotalMinutes(totalMinutes);
}

export const PomodoroStats: React.FC = () => {
  const pomodoroSettings = useAtomValue(pomodoroSettingsAtom);
  const sessionsState = useAtomValue(sessionsAtom);
  const { completedBreaks } = useAtomValue(sessionsAtom);

  const pendingStats = calculatePendingSessionStats(
    sessionsState,
    pomodoroSettings
  );
  const completedStats = calculateCompletedSessionStats(
    sessionsState,
    pomodoroSettings
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Session Planner</h1>
      <div className="text-gray-500 mt-2 text-xs flex flex-row justify-between">
        <div>{sessionsState.pendingSessions.length} remaining sessions</div>
        <div>
          {pendingStats.hoursRemaining}hr {pendingStats.minutesRemaining}min
        </div>
      </div>
      <div className="text-gray-500 mt-2 text-xs flex flex-row justify-between">
        <div>
          {sessionsState.completedSessions.length} completed sessions
          {" • "}
          {completedBreaks.length} completed breaks
        </div>
        <div>
          {completedStats.hoursRemaining}hr {completedStats.minutesRemaining}min
        </div>
      </div>
    </div>
  );
};
