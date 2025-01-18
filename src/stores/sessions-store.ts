import { Session } from "@/types/session";
import { atomWithStorage } from "jotai/utils";
import { STORAGE_KEYS } from "./constants";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";
import { atom } from "jotai";

// Base sessions atom
export const sessionsAtom = atomWithStorage<Session[]>(STORAGE_KEYS.SESSIONS, [
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
]);

// Derived state atoms
export const completedSessionsAtom = atom((get) =>
  get(sessionsAtom).filter((s) => s.completed)
);

export const nonCompletedSessionsAtom = atom((get) =>
  get(sessionsAtom).filter((s) => !s.completed)
);

// Operation atoms
export const moveSessionAtom = atom(
  null,
  (
    get,
    set,
    { oldIndex, newIndex }: { oldIndex: number; newIndex: number }
  ) => {
    set(sessionsAtom, arrayMove(get(sessionsAtom), oldIndex, newIndex));
  }
);

export const deleteSessionAtom = atom(null, (get, set, id: string) => {
  set(
    sessionsAtom,
    get(sessionsAtom).filter((session) => session.id !== id)
  );
});

export const addSessionAtom = atom(
  null,
  (get, set, sessionData: Omit<Session, "id" | "completed">) => {
    set(sessionsAtom, [
      ...get(sessionsAtom),
      {
        id: uuidv4(),
        ...sessionData,
        completed: false,
      },
    ]);
  }
);

export const completeSessionAtom = atom(null, (get, set, id: string) => {
  const sessions = get(sessionsAtom);
  const index = sessions.findIndex((s) => s.id === id);
  if (index === -1) return;

  const updatedSession = { ...sessions[index], completed: true };
  const newSessions = [...sessions];
  newSessions.splice(index, 1);
  newSessions.push(updatedSession);
  set(sessionsAtom, newSessions);
});

export const editSessionAtom = atom(
  null,
  (get, set, { id, updates }: { id: string; updates: Partial<Session> }) => {
    set(
      sessionsAtom,
      get(sessionsAtom).map((session) =>
        session.id === id ? { ...session, ...updates } : session
      )
    );
  }
);

export const deleteAllCompletedSessionsAtom = atom(null, (get, set) => {
  set(
    sessionsAtom,
    get(sessionsAtom).filter((s) => !s.completed)
  );
});

export const deleteAllSessionsAtom = atom(null, (_, set) => {
  set(sessionsAtom, []);
});
