import React, { useState, useEffect, useMemo } from "react";
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
  arrayMove,
} from "@dnd-kit/sortable";
import { pomodoroSettingsAtom } from "@/stores/settings-store";
import { useAtomValue } from "jotai";
import { STORAGE_KEYS } from "@/stores/constants";

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
  const [sessions, setSessions] = useState<Session[]>(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return savedSessions
      ? JSON.parse(savedSessions)
      : [
          { id: "1", title: "Product Team Sync" },
          { id: "2", title: "Feature Development" },
          { id: "3", title: "Code Review & Documentation" },
          { id: "4", title: "Sprint Planning" },
        ];
  });

  const { pendingSessionStats, completedSessionStats } = useMemo(() => {
    const nonCompleted = sessions.filter((s) => !s.completed);
    const done = sessions.filter((s) => s.completed);

    return {
      pendingSessionStats: calcSessionStats(nonCompleted, pomodoroSettings),
      completedSessionStats: calcSessionStats(done, pomodoroSettings),
    };
  }, [pomodoroSettings, sessions]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSessions = [...sessions];
    const draggedSession = newSessions[draggedIndex];
    newSessions.splice(draggedIndex, 1);
    newSessions.splice(index, 0, draggedSession);

    setSessions(newSessions);
    setDraggedIndex(index);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSessions((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleDismiss = () => {
    if (sessions.length > 0) {
      setSessions(sessions.slice(1));
    }
  };

  const handleDelete = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };

  const handleNewSession = (sessionData: Omit<Session, "id">) => {
    setSessions([
      ...sessions,
      {
        id: Date.now().toString(),
        ...sessionData,
        completed: false,
      },
    ]);
  };

  const handleComplete = (id: string) => {
    setSessions((prevSessions) => {
      const index = prevSessions.findIndex((s) => s.id === id);
      if (index === -1) return prevSessions;
      const updatedSession = { ...prevSessions[index], completed: true };
      const newSessions = [...prevSessions];
      newSessions.splice(index, 1);
      newSessions.push(updatedSession);
      return newSessions;
    });
  };

  const handleKeepNonCompleted = () => {
    setSessions((prev) => prev.filter((s) => !s.completed));
  };

  const handleDeleteAll = () => {
    setSessions([]);
  };

  const handleEdit = (id: string, updates: Partial<Session>) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === id ? { ...session, ...updates } : session
      )
    );
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  const nonCompletedSessions = sessions.filter((s) => !s.completed);
  const completedSessions = sessions.filter((s) => s.completed);

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
            <PomodoroSettingsComponent
              hasNonCompletedSessions={nonCompletedSessions.length > 0}
              onKeepNonCompleted={handleKeepNonCompleted}
              onDeleteAll={handleDeleteAll}
            />
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
                onDismiss={index === 0 ? handleDismiss : undefined}
                onDelete={() => handleDelete(session.id)}
                onComplete={() => handleComplete(session.id)}
                onEdit={handleEdit}
              />
            ))}
          </SortableContext>
        </DndContext>

        <CreateSessionCard onNewSession={handleNewSession} />

        {completedSessions.map((session, index) => (
          <SessionCard
            key={session.id}
            session={session}
            activeSession={false}
            onDismiss={index === 0 ? handleDismiss : undefined}
            onDelete={() => handleDelete(session.id)}
            onComplete={() => handleComplete(session.id)}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default SessionPlanner;
