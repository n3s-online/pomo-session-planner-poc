import { Session } from "@/types/session";
import { PomodoroSettings } from "@/types/pomodoro";
import { useAtomValue } from "jotai";
import {
  nonCompletedSessionsAtom,
  completedSessionsAtom,
  sessionsAtom,
} from "@/stores/sessions-store";
import { pomodoroSettingsAtom } from "@/stores/settings-store";

type SessionStats = {
  hoursRemaining: number;
  minutesRemaining: number;
  count: number;
};

function calcSessionStats(
  sessionsList: Session[],
  settings: PomodoroSettings
): SessionStats {
  const totalMinutes = sessionsList.reduce((sum, _, idx) => {
    if (idx === sessionsList.length - 1) {
      return sum + settings.sessionLength;
    }
    return sum + settings.sessionLength + settings.breakLength;
  }, 0);

  return {
    hoursRemaining: Math.floor(totalMinutes / 60),
    minutesRemaining: totalMinutes % 60,
    count: sessionsList.length,
  };
}

export const PomodoroStats: React.FC = () => {
  const pomodoroSettings = useAtomValue(pomodoroSettingsAtom);
  const nonCompletedSessions = useAtomValue(nonCompletedSessionsAtom);
  const completedSessions = useAtomValue(completedSessionsAtom);
  const { completedBreakCount } = useAtomValue(sessionsAtom);

  const pendingStats = calcSessionStats(nonCompletedSessions, pomodoroSettings);
  const completedStats = calcSessionStats(completedSessions, pomodoroSettings);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Session Planner</h1>
      <div className="text-gray-500 mt-2 text-xs flex flex-row justify-between">
        <div>{pendingStats.count} remaining sessions</div>
        <div>
          {pendingStats.hoursRemaining}hr {pendingStats.minutesRemaining}min
        </div>
      </div>
      <p className="text-gray-500 mt-2 text-xs flex flex-row justify-between">
        <div>
          {completedStats.count} completed sessions
          {" • "}
          {completedBreakCount} completed breaks
        </div>
        <div>
          {completedStats.hoursRemaining}hr {completedStats.minutesRemaining}min
        </div>
      </p>
    </div>
  );
};
