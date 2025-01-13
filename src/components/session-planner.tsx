import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STORAGE_KEYS = {
  SESSIONS: "SessionPlanner_sessions",
  SETTINGS: "SessionPlanner_pomodoroSettings",
} as const;

interface Session {
  id: string;
  title: string;
}

interface PomodoroSettings {
  sessionLength: number;
  breakLength: number;
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

  const [newSessionTitle, setNewSessionTitle] = useState("");
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

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSessionTitle.trim()) {
      setSessions([
        ...sessions,
        {
          id: Date.now().toString(),
          title: newSessionTitle.trim(),
        },
      ]);
      setNewSessionTitle("");
    }
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Session Length
              </label>
              <Select
                value={pomodoroSettings.sessionLength.toString()}
                onValueChange={(value) =>
                  setPomodoroSettings((prev) => ({
                    ...prev,
                    sessionLength: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Session Length" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 15, 20, 25, 30, 40, 45, 60].map((mins) => (
                    <SelectItem key={mins} value={mins.toString()}>
                      {mins} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Break Length
              </label>
              <Select
                value={pomodoroSettings.breakLength.toString()}
                onValueChange={(value) =>
                  setPomodoroSettings((prev) => ({
                    ...prev,
                    breakLength: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Break Length" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 8, 10, 15, 30].map((mins) => (
                    <SelectItem key={mins} value={mins.toString()}>
                      {mins} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div
            key={session.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            className={`transition-all duration-200 ${
              index === 0 ? "scale-100" : "scale-98"
            }`}
          >
            <Card
              className={`
              ${index === 0 ? "ring-2 ring-blue-500 shadow-lg" : "shadow-sm"}
              hover:shadow-md transition-shadow
            `}
            >
              <div className="flex">
                {/* Full-height drag handle */}
                <div className="py-4 px-3 cursor-grab hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Main content */}
                <div className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-lg text-gray-900">
                        {session.title}
                      </h3>
                    </div>
                  </CardContent>
                  {index === 0 && (
                    <CardFooter className="p-4 pt-0">
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleDismiss}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Dismiss Session
                      </Button>
                    </CardFooter>
                  )}
                </div>

                {/* Centered delete button */}
                <div className="flex items-center pr-4">
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                      onClick={() => handleDelete(session.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}

        <Card className="bg-gray-50 border-dashed">
          <CardContent className="p-4">
            <form
              onSubmit={handleAddSession}
              className="flex items-center gap-2"
            >
              <Input
                type="text"
                placeholder="Enter new session title..."
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!newSessionTitle.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Session
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionPlanner;
