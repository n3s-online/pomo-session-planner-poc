import { SessionCard } from "@/components/session-card";
import { CreateSessionCard } from "@/components/create-session-card";
import { PomodoroSettingsComponent } from "@/components/pomodoro-settings";
import { BreakCard } from "@/components/break-card";
import { PomodoroStats } from "@/components/pomodoro-stats";
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
import { moveSessionAtom, sessionsAtom } from "@/stores/sessions-store";
import { useAtomValue, useSetAtom } from "jotai";

const SessionPlanner = () => {
  const { pendingSessions, completedSessions, onBreakProps } =
    useAtomValue(sessionsAtom);

  const moveSession = useSetAtom(moveSessionAtom);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pendingSessions.findIndex((s) => s.id === active.id);
    const newIndex = pendingSessions.findIndex((s) => s.id === over.id);

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
            <PomodoroStats />
          </div>
          <div className="flex flex-col gap-4 items-center min-w-[300px]">
            <PomodoroSettingsComponent />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {onBreakProps && <BreakCard breakProps={onBreakProps} />}

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={pendingSessions.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {pendingSessions.map((session, index) => (
              <SessionCard
                key={session.id}
                session={session}
                activeSession={!onBreakProps && index === 0}
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
