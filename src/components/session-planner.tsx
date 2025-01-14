import React, { useState, useEffect, useMemo } from "react";
import { Session } from "@/types/session";
import { SessionCard } from "@/components/session-card";
import { CreateSessionCard } from "@/components/create-session-card";
import { PomodoroSettings } from "@/types/pomodoro";
import { PomodoroSettingsComponent } from "@/components/pomodoro-settings";

const STORAGE_KEYS = {
  SESSIONS: "SessionPlanner_sessions",
  SETTINGS: "SessionPlanner_pomodoroSettings",
} as const;

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

  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(
    () => {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings
        ? JSON.parse(settings)
        : {
            sessionLength: 25,
            breakLength: 5,
          };
    }
  );

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(pomodoroSettings)
    );
  }, [pomodoroSettings]);

  const nonCompletedSessions = sessions.filter((s) => !s.completed);
  const completedSessions = sessions.filter((s) => s.completed);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
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
          <div className="flex gap-4">
            <PomodoroSettingsComponent
              settings={pomodoroSettings}
              onSettingsChange={(newSettings: PomodoroSettings) =>
                setPomodoroSettings(newSettings)
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {nonCompletedSessions.map((session, index) => (
          <SessionCard
            key={session.id}
            session={session}
            activeSession={index === 0}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDismiss={index === 0 ? handleDismiss : undefined}
            onDelete={() => handleDelete(session.id)}
            onComplete={() => handleComplete(session.id)}
          />
        ))}

        <CreateSessionCard onNewSession={handleNewSession} />

        {completedSessions.map((session, index) => (
          <SessionCard
            key={session.id}
            session={session}
            activeSession={false}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDismiss={index === 0 ? handleDismiss : undefined}
            onDelete={() => handleDelete(session.id)}
            onComplete={() => handleComplete(session.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SessionPlanner;
