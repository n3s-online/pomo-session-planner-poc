import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PomodoroSettings } from "@/types/pomodoro";

interface PomodoroSettingsProps {
  settings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
}

export const PomodoroSettingsComponent: React.FC<PomodoroSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="flex gap-4">
      {/* Session Length */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
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
      {/* Break Length */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
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
  );
};
