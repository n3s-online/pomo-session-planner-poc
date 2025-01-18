import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PomodoroSettings } from "@/types/pomodoro";

interface PomodoroSettingsDialogProps {
  children: React.ReactNode;
  settings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
}

export function PomodoroSettingsDialog({
  children,
  settings,
  onSettingsChange,
}: PomodoroSettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-rows-[auto_1fr] gap-y-2">
            <label className="text-sm font-medium">Session Length</label>
            <Select
              value={settings.sessionLength.toString()}
              onValueChange={(value) =>
                onSettingsChange({
                  ...settings,
                  sessionLength: parseInt(value),
                })
              }
            >
              <SelectTrigger>
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
            <label className="text-sm font-medium">Break Length</label>
            <Select
              value={settings.breakLength.toString()}
              onValueChange={(value) =>
                onSettingsChange({
                  ...settings,
                  breakLength: parseInt(value),
                })
              }
            >
              <SelectTrigger>
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
      </DialogContent>
    </Dialog>
  );
}
