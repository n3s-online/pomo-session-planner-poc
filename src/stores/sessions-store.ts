import {
  CompletedSession,
  PendingSession,
  Session,
  SessionState,
} from "@/types/session";
import { atomWithStorage } from "jotai/utils";
import { STORAGE_KEYS } from "./constants";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";
import { atom } from "jotai";
import { pomodoroSettingsAtom, timerSettingsAtom } from "./settings-store";
import { getBreakLength } from "@/lib/utils";

// Base sessions atom
export const sessionsAtom = atomWithStorage<SessionState>(
  STORAGE_KEYS.SESSIONS,
  {
    completedBreaks: [],
    pendingSessions: [
      {
        id: uuidv4(),
        title: "Code Review and Bug Fixing",
        description: "Review pull requests and address assigned bugs.",
        completed: false,
        sessionStartDate: new Date(),
      },
      {
        id: uuidv4(),
        title: "Complete ReactJS Tutorial",
        completed: false,
      },
      {
        id: uuidv4(),
        title: "Plan and Write Documentation",
        description: "Draft or improve project documentation or user guides.",
        completed: false,
      },
      {
        id: uuidv4(),
        title: "Debug and Optimize Code",
        description: "Debug specific issues or optimize code for performance.",
        completed: false,
      },
      {
        id: uuidv4(),
        title: "Organize and Prioritize Tasks",
        description:
          "Organize your task list or backlog and prioritize upcoming work.",
        completed: false,
      },
    ],
    completedSessions: [],
  }
);

// Operation atoms
export const moveSessionAtom = atom(
  null,
  (
    get,
    set,
    { oldIndex, newIndex }: { oldIndex: number; newIndex: number }
  ) => {
    const sessionsState = get(sessionsAtom);
    const newPendingSessions = arrayMove(
      sessionsState.pendingSessions,
      oldIndex,
      newIndex
    );

    if (oldIndex === 0 || (newIndex === 0 && oldIndex !== newIndex)) {
      newPendingSessions[0].sessionStartDate = new Date();
    }

    set(sessionsAtom, {
      ...sessionsState,
      pendingSessions: newPendingSessions,
    });
  }
);

export const deleteSessionAtom = atom(null, (get, set, id: string) => {
  const sessionsState = get(sessionsAtom);
  set(sessionsAtom, {
    ...sessionsState,
    pendingSessions: sessionsState.pendingSessions.filter(
      (session) => session.id !== id
    ),
  });
});

export const addSessionAtom = atom(
  null,
  (get, set, sessionData: Omit<Session, "id" | "completed">) => {
    const sessionsState = get(sessionsAtom);

    set(sessionsAtom, {
      ...sessionsState,
      pendingSessions: [
        ...sessionsState.pendingSessions,
        {
          id: uuidv4(),
          ...sessionData,
          completed: false,
          sessionStartDate:
            sessionsState.pendingSessions.length === 0 ? new Date() : undefined,
        },
      ],
    });
  }
);

export const completeSessionAtom = atom(null, (get, set, id: string) => {
  const sessionsState = get(sessionsAtom);
  const settingsState = get(pomodoroSettingsAtom);
  const timerSettings = get(timerSettingsAtom);
  const index = sessionsState.pendingSessions.findIndex((s) => s.id === id);
  if (index === -1) return;

  const previousPendingSession = sessionsState.pendingSessions[index];

  const sessionEndDate = new Date();
  const actualLengthInMinutes: number =
    timerSettings.enabled &&
    timerSettings.useTimerForStats &&
    !!previousPendingSession.sessionStartDate
      ? Math.round(
          (sessionEndDate.getTime() -
            new Date(previousPendingSession.sessionStartDate).getTime()) /
            (1000 * 60)
        )
      : settingsState.sessionLength;
  const completedSession: CompletedSession = {
    ...previousPendingSession,
    completed: true,
    sessionEndDate,
    actualLength: actualLengthInMinutes,
  };

  const newPendingSessions = [...sessionsState.pendingSessions];
  newPendingSessions.splice(index, 1);
  if (newPendingSessions.length > 0) {
    newPendingSessions[0].sessionStartDate = new Date();
  }

  const newCompletedSessions = [
    ...sessionsState.completedSessions,
    completedSession,
  ];

  const breakLength = getBreakLength(
    get(pomodoroSettingsAtom),
    sessionsState.completedBreaks.length
  );

  set(sessionsAtom, {
    ...sessionsState,
    pendingSessions: newPendingSessions,
    completedSessions: newCompletedSessions,
    onBreakProps:
      newPendingSessions.length > 0
        ? {
            breakStartDate: new Date(),
            minutesDuration: breakLength,
          }
        : undefined,
  });
});

export const completeBreakAtom = atom(null, (get, set) => {
  const sessionsState = get(sessionsAtom);
  const timerSettings = get(timerSettingsAtom);
  if (!sessionsState.onBreakProps?.minutesDuration) return;

  const breakEndDate = new Date();
  const actualMinutesDuration =
    timerSettings.enabled &&
    timerSettings.useTimerForStats &&
    !!sessionsState.onBreakProps.breakStartDate
      ? Math.round(
          (breakEndDate.getTime() -
            new Date(sessionsState.onBreakProps.breakStartDate).getTime()) /
            (1000 * 60)
        )
      : sessionsState.onBreakProps.minutesDuration;

  const sessionToAttributeBreakTo =
    sessionsState.completedSessions.length > 0
      ? sessionsState.completedSessions[
          sessionsState.completedSessions.length - 1
        ]
      : null;

  const newCompletedSessions = [...sessionsState.completedSessions];
  if (sessionToAttributeBreakTo) {
    const updatedSession = {
      ...sessionToAttributeBreakTo,
      breakAfterLength: actualMinutesDuration,
    };
    const index = newCompletedSessions.findIndex(
      (s) => s.id === sessionToAttributeBreakTo.id
    );
    newCompletedSessions[index] = updatedSession;
  }

  const newPendingSessions = [...sessionsState.pendingSessions];
  if (newPendingSessions.length > 0) {
    newPendingSessions[0].sessionStartDate = new Date();
  }

  set(sessionsAtom, {
    ...sessionsState,
    completedSessions: newCompletedSessions,
    completedBreaks: [
      ...sessionsState.completedBreaks,
      {
        minutesDuration: actualMinutesDuration,
        breakStartDate: sessionsState.onBreakProps.breakStartDate,
        breakEndDate,
      },
    ],
    onBreakProps: undefined,
  });
});

export const editSessionAtom = atom(
  null,
  (
    get,
    set,
    { id, updates }: { id: string; updates: Partial<PendingSession> }
  ) => {
    const sessionsState = get(sessionsAtom);
    const index = sessionsState.pendingSessions.findIndex((s) => s.id === id);
    if (index === -1) return;
    const newSessions = [...sessionsState.pendingSessions];
    newSessions[index] = { ...newSessions[index], ...updates };
    set(sessionsAtom, {
      ...sessionsState,
      sessions: newSessions,
    });
  }
);

export const deleteAllCompletedSessionsAtom = atom(null, (get, set) => {
  const sessionsState = get(sessionsAtom);
  set(sessionsAtom, {
    ...sessionsState,
    completedBreaks: [],
    completedSessions: [],
  });
});

export const deleteAllSessionsAtom = atom(null, (_, set) => {
  set(sessionsAtom, {
    completedBreaks: [],
    pendingSessions: [],
    completedSessions: [],
  });
});

export const resetStartTimesAtom = atom(null, (get, set) => {
  const sessionsState = get(sessionsAtom);

  if (sessionsState.onBreakProps) {
    set(sessionsAtom, {
      ...sessionsState,
      onBreakProps: {
        ...sessionsState.onBreakProps,
        breakStartDate: new Date(),
      },
    });
    return;
  }

  if (sessionsState.pendingSessions.length > 0) {
    const newPendingSessions = [...sessionsState.pendingSessions];
    newPendingSessions[0].sessionStartDate = new Date();
    set(sessionsAtom, {
      ...sessionsState,
      pendingSessions: newPendingSessions,
    });
  }
});
