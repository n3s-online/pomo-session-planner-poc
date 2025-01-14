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

  const { hoursRemaining, minutesRemaining } = useMemo(() => {
    const totalMinutes = sessions.reduce((totalMinutes, session, idx) => {
      if (idx === sessions.length - 1) {
        return totalMinutes + pomodoroSettings.sessionLength;
      }
      return (
        totalMinutes +
        pomodoroSettings.sessionLength +
        pomodoroSettings.breakLength
      );
    }, 0);
    return {
      hoursRemaining: Math.floor(totalMinutes / 60),
      minutesRemaining: totalMinutes % 60,
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
      },
    ]);
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

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Session Planner
            </h1>
            <p className="text-gray-500 mt-2">
              {sessions.length} remaining sessions, {hoursRemaining}hr{" "}
              {minutesRemaining}min
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
        {sessions.map((session, index) => (
          <SessionCard
            key={session.id}
            session={session}
            index={index}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDismiss={index === 0 ? handleDismiss : undefined}
            onDelete={index > 0 ? () => handleDelete(session.id) : undefined}
          />
        ))}

        <CreateSessionCard onNewSession={handleNewSession} />
      </div>
    </div>
  );
};

export default SessionPlanner;
