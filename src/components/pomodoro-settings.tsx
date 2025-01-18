import React from "react";
import { PomodoroSettings } from "@/types/pomodoro";
import { ClearSessionsButton } from "@/components/ClearSessionsButton";
import { PomodoroSettingsDialog } from "@/components/pomodoro-settings-dialog";
import { Button } from "@/components/ui/button";

interface PomodoroSettingsProps {
  settings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
  hasNonCompletedSessions: boolean;
  onKeepNonCompleted: () => void;
  onDeleteAll: () => void;
}

export const PomodoroSettingsComponent: React.FC<PomodoroSettingsProps> = ({
  settings,
  onSettingsChange,
  hasNonCompletedSessions,
  onKeepNonCompleted,
  onDeleteAll,
}) => {
  return (
    <div className="mt-0 md:mt-8 w-full flex flex-row-reverse gap-x-1 sm:gap-x-2 md:gap-x-4 text-xs">
      <div className="grid grid-rows-[auto_1fr] gap-y-2">
        <div className="text-xs font-medium text-gray-700 whitespace-nowrap">
          Clear Sessions
        </div>
        <ClearSessionsButton
          hasNonCompletedSessions={hasNonCompletedSessions}
          onKeepNonCompleted={onKeepNonCompleted}
          onDeleteAll={onDeleteAll}
        />
      </div>
      <div className="grid grid-rows-[auto_1fr] gap-y-2">
        <div className="text-xs font-medium text-gray-700">Settings</div>
        <PomodoroSettingsDialog
          settings={settings}
          onSettingsChange={onSettingsChange}
        >
          <Button variant="outline">
            {settings.sessionLength}/{settings.breakLength}min
          </Button>
        </PomodoroSettingsDialog>
      </div>
    </div>
  );
};
