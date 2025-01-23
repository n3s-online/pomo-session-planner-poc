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
import { playSound } from "@/lib/sounds";

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
    soundState: {
      alreadyPlayed: false,
    },
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
    let soundState = sessionsState.soundState;

    if (oldIndex === 0 || (newIndex === 0 && oldIndex !== newIndex)) {
      newPendingSessions[0].sessionStartDate = new Date();
      soundState = {
        alreadyPlayed: false,
      };
    }

    set(sessionsAtom, {
      ...sessionsState,
      soundState,
      pendingSessions: newPendingSessions,
    });
  }
);

export const deleteSessionAtom = atom(null, (get, set, id: string) => {
  const sessionsState = get(sessionsAtom);
  const indexToDelete = sessionsState.pendingSessions.findIndex(
    (session) => session.id === id
  );
  if (indexToDelete === -1) return;
  const newPendingSessions = [...sessionsState.pendingSessions];
  newPendingSessions.splice(indexToDelete, 1);
  if (indexToDelete === 0 && newPendingSessions.length > 0) {
    newPendingSessions[0].sessionStartDate = new Date();
  }
  set(sessionsAtom, {
    ...sessionsState,
    pendingSessions: newPendingSessions,
  });
});

export const addSessionAtom = atom(
  null,
  (get, set, sessionData: Omit<Session, "id" | "completed">) => {
    const sessionsState = get(sessionsAtom);

    set(sessionsAtom, {
      ...sessionsState,
      soundState:
        sessionsState.pendingSessions.length === 0
          ? undefined
          : sessionsState.soundState,
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
  const pomodoroSettings = get(pomodoroSettingsAtom);
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
      : pomodoroSettings.sessionLength;
  const completedSession: CompletedSession = {
    ...previousPendingSession,
    completed: true,
    sessionEndDate,
    actualLength: actualLengthInMinutes,
  };

  const newPendingSessions = [...sessionsState.pendingSessions];
  let soundState = undefined;
  newPendingSessions.splice(index, 1);
  if (newPendingSessions.length > 0) {
    newPendingSessions[0].sessionStartDate = new Date();
    soundState = {
      alreadyPlayed: false,
    };
  }

  const newCompletedSessions = [
    ...sessionsState.completedSessions,
    completedSession,
  ];

  if (!pomodoroSettings.breaksEnabled) {
    set(sessionsAtom, {
      ...sessionsState,
      soundState,
      pendingSessions: newPendingSessions,
      completedSessions: newCompletedSessions,
    });
    return;
  }

  const breakLength = getBreakLength(
    get(pomodoroSettingsAtom),
    sessionsState.completedBreaks.length
  );

  set(sessionsAtom, {
    ...sessionsState,
    pendingSessions: newPendingSessions,
    completedSessions: newCompletedSessions,
    soundState: {
      alreadyPlayed: false,
    },
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
  let soundState = undefined;
  if (newPendingSessions.length > 0) {
    newPendingSessions[0].sessionStartDate = new Date();
    soundState = {
      alreadyPlayed: false,
    };
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
    soundState,
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
      pendingSessions: newSessions,
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
  let soundState = sessionsState.soundState;
  if (soundState) {
    soundState.alreadyPlayed = false;
  }
  if (sessionsState.onBreakProps) {
    set(sessionsAtom, {
      ...sessionsState,
      soundState,
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
      soundState,
    });
  }
});

export const playSoundAtom = atom(null, (get, set) => {
  const sessionsState = get(sessionsAtom);
  if (sessionsState.soundState?.alreadyPlayed) return;
  if (!sessionsState.onBreakProps && sessionsState.pendingSessions.length === 0)
    return;
  const startDate = sessionsState.onBreakProps
    ? sessionsState.onBreakProps.breakStartDate
    : sessionsState.pendingSessions[0].sessionStartDate;
  if (!startDate) return;
  const pomodoroSettings = get(pomodoroSettingsAtom);
  const minutesToTriggerAt = sessionsState.onBreakProps
    ? getBreakLength(pomodoroSettings, sessionsState.completedBreaks.length)
    : pomodoroSettings.sessionLength;
  const elapsedMinutes = Math.floor(
    (new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60)
  );

  if (elapsedMinutes < minutesToTriggerAt) return;

  set(sessionsAtom, {
    ...sessionsState,
    soundState: {
      alreadyPlayed: true,
    },
  });

  const timerSettings = get(timerSettingsAtom);
  if (
    !timerSettings.enabled ||
    !timerSettings.sound.enabled ||
    timerSettings.sound.volume === 0
  )
    return;
  playSound(timerSettings.sound.soundName, timerSettings.sound.volume);
});
