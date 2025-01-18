import { Session, SessionState } from "@/types/session";
import { atomWithStorage } from "jotai/utils";
import { STORAGE_KEYS } from "./constants";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";
import { atom } from "jotai";
import { pomodoroSettingsAtom } from "./settings-store";
import { getBreakLength } from "@/lib/utils";

// Base sessions atom
export const sessionsAtom = atomWithStorage<SessionState>(
  STORAGE_KEYS.SESSIONS,
  {
    completedBreakCount: 0,
    sessions: [
      {
        id: uuidv4(),
        title: "Code Review and Bug Fixing",
        description: "Review pull requests and address assigned bugs.",
        completed: false,
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
  }
);

// Derived state atoms
export const completedSessionsAtom = atom((get) =>
  get(sessionsAtom).sessions.filter((s) => s.completed)
);

export const nonCompletedSessionsAtom = atom((get) =>
  get(sessionsAtom).sessions.filter((s) => !s.completed)
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
    set(sessionsAtom, {
      ...sessionsState,
      sessions: arrayMove(sessionsState.sessions, oldIndex, newIndex),
    });
  }
);

export const deleteSessionAtom = atom(null, (get, set, id: string) => {
  const sessionsState = get(sessionsAtom);
  set(sessionsAtom, {
    ...sessionsState,
    sessions: sessionsState.sessions.filter((session) => session.id !== id),
  });
});

export const addSessionAtom = atom(
  null,
  (get, set, sessionData: Omit<Session, "id" | "completed">) => {
    const sessionsState = get(sessionsAtom);

    set(sessionsAtom, {
      ...sessionsState,
      sessions: [
        ...sessionsState.sessions,
        {
          id: uuidv4(),
          ...sessionData,
          completed: false,
        },
      ],
    });
  }
);

export const completeSessionAtom = atom(null, (get, set, id: string) => {
  const sessionsState = get(sessionsAtom);
  const index = sessionsState.sessions.findIndex((s) => s.id === id);
  if (index === -1) return;

  const updatedSession = { ...sessionsState.sessions[index], completed: true };
  const newSessions = [...sessionsState.sessions];
  newSessions.splice(index, 1);
  newSessions.push(updatedSession);

  const breakLength = getBreakLength(
    get(pomodoroSettingsAtom),
    sessionsState.completedBreakCount
  );

  set(sessionsAtom, {
    ...sessionsState,
    sessions: newSessions,
    onBreakProps: {
      breakStartDate: new Date(),
      title: `${breakLength} minute break`,
    },
  });
});

export const completeBreakAtom = atom(null, (get, set) => {
  const sessionsState = get(sessionsAtom);
  set(sessionsAtom, {
    ...sessionsState,
    completedBreakCount: sessionsState.completedBreakCount + 1,
    onBreakProps: undefined,
  });
});

export const editSessionAtom = atom(
  null,
  (get, set, { id, updates }: { id: string; updates: Partial<Session> }) => {
    const sessionsState = get(sessionsAtom);
    const index = sessionsState.sessions.findIndex((s) => s.id === id);
    if (index === -1) return;
    const newSessions = [...sessionsState.sessions];
    newSessions[index] = { ...newSessions[index], ...updates };
    set(sessionsAtom, {
      ...sessionsState,
      sessions: newSessions,
    });
  }
);

export const deleteAllCompletedSessionsAtom = atom(null, (get, set) => {
  const sessionsState = get(sessionsAtom);
  const remainingSessions = sessionsState.sessions.filter((s) => !s.completed);
  set(sessionsAtom, {
    ...sessionsState,
    completedBreakCount: 0,
    sessions: remainingSessions,
  });
});

export const deleteAllSessionsAtom = atom(null, (_, set) => {
  set(sessionsAtom, {
    completedBreakCount: 0,
    sessions: [],
  });
});
