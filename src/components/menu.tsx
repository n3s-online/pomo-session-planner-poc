import React from "react";
import { ClearSessionsButton } from "@/components/ClearSessionsButton";
import { PomodoroSettingsDialog } from "@/components/pomodoro-settings-dialog";
import { TimerSettingsDialog } from "@/components/timer-settings-dialog";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import {
  pomodoroSettingsAtom,
  timerSettingsAtom,
} from "@/stores/settings-store";

export const Menu: React.FC = () => {
  const pomodoroSettings = useAtomValue(pomodoroSettingsAtom);
  const timerSettings = useAtomValue(timerSettingsAtom);

  return (
    <div className="mt-0 md:mt-8 w-full flex flex-row-reverse gap-x-1 sm:gap-x-2 md:gap-x-4 text-xs">
      <div className="grid grid-rows-[auto_1fr] gap-y-2">
        <div className="text-xs font-medium text-gray-700 whitespace-nowrap">
          Clear Sessions
        </div>
        <ClearSessionsButton />
      </div>
      <div className="grid grid-rows-[auto_1fr] gap-y-2">
        <div className="text-xs font-medium text-gray-700">Timer</div>
        <TimerSettingsDialog>
          <Button variant="outline">
            {timerSettings.enabled ? "On" : "Off"}
          </Button>
        </TimerSettingsDialog>
      </div>
      <div className="grid grid-rows-[auto_1fr] gap-y-2">
        <div className="text-xs font-medium text-gray-700">Pomodoro</div>
        <PomodoroSettingsDialog>
          <Button variant="outline">
            {pomodoroSettings.sessionLength}/{pomodoroSettings.breakLength}min
          </Button>
        </PomodoroSettingsDialog>
      </div>
    </div>
  );
};
