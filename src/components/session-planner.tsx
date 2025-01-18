import { useMemo } from "react";
import { Session } from "@/types/session";
import { SessionCard } from "@/components/session-card";
import { CreateSessionCard } from "@/components/create-session-card";
import { PomodoroSettings } from "@/types/pomodoro";
import { PomodoroSettingsComponent } from "@/components/pomodoro-settings";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { pomodoroSettingsAtom } from "@/stores/settings-store";
import {
  nonCompletedSessionsAtom,
  completedSessionsAtom,
  moveSessionAtom,
  sessionsAtom,
} from "@/stores/sessions-store";
import { useAtomValue, useSetAtom } from "jotai";

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

const SessionPlanner = () => {
  const pomodoroSettings = useAtomValue(pomodoroSettingsAtom);
  const nonCompletedSessions = useAtomValue(nonCompletedSessionsAtom);
  const completedSessions = useAtomValue(completedSessionsAtom);
  const sessions = useAtomValue(sessionsAtom);

  const moveSession = useSetAtom(moveSessionAtom);

  const { pendingSessionStats, completedSessionStats } = useMemo(() => {
    return {
      pendingSessionStats: calcSessionStats(
        nonCompletedSessions,
        pomodoroSettings
      ),
      completedSessionStats: calcSessionStats(
        completedSessions,
        pomodoroSettings
      ),
    };
  }, [pomodoroSettings, nonCompletedSessions, completedSessions]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sessions.findIndex((s) => s.id === active.id);
    const newIndex = sessions.findIndex((s) => s.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      moveSession({ oldIndex, newIndex });
    }
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex gap-4 flex-col md:flex-row justify-between items-start">
          <div className="w-full">
            <h1 className="text-3xl font-bold text-gray-900">
              Session Planner
            </h1>
            <div className="text-gray-500 mt-2 text-xs flex flex-row justify-between">
              <div>{pendingSessionStats.count} remaining sessions</div>
              <div>
                {pendingSessionStats.hoursRemaining}hr{" "}
                {pendingSessionStats.minutesRemaining}min
              </div>
            </div>
            <p className="text-gray-500 mt-2 text-xs flex flex-row justify-between">
              <div>{completedSessionStats.count} completed sessions</div>
              <div>
                {completedSessionStats.hoursRemaining}hr{" "}
                {completedSessionStats.minutesRemaining}min
              </div>
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center min-w-[300px]">
            <PomodoroSettingsComponent />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={nonCompletedSessions.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {nonCompletedSessions.map((session, index) => (
              <SessionCard
                key={session.id}
                session={session}
                activeSession={index === 0}
              />
            ))}
          </SortableContext>
        </DndContext>

        <CreateSessionCard />

        {completedSessions.map((session, index) => (
          <SessionCard
            key={session.id}
            session={session}
            activeSession={false}
          />
        ))}
      </div>
    </div>
  );
};

export default SessionPlanner;
