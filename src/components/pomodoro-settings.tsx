import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PomodoroSettings } from "@/types/pomodoro";
import { ClearSessionsButton } from "@/components/ClearSessionsButton";

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
    <div className="mt-0 md:mt-8 w-full flex flex-row gap-x-1 sm:gap-x-2 md:gap-x-4 text-xs">
      <div className="grid grid-rows-[auto_1fr] gap-y-2">
        <label className="text-xs font-medium text-gray-700">
          Session Length
        </label>
        <Select
          value={settings.sessionLength.toString()}
          onValueChange={(value) =>
            onSettingsChange({
              ...settings,
              sessionLength: parseInt(value),
            })
          }
        >
          <SelectTrigger className="w-full">
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
      <div className="grid grid-rows-[auto_1fr] gap-y-2">
        <label className="text-xs font-medium text-gray-700">
          Break Length
        </label>
        <Select
          value={settings.breakLength.toString()}
          onValueChange={(value) =>
            onSettingsChange({
              ...settings,
              breakLength: parseInt(value),
            })
          }
        >
          <SelectTrigger className="w-full">
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
    </div>
  );
};
