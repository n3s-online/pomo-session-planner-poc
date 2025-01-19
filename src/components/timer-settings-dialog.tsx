import React, { useEffect } from "react";
import { TimerSettings } from "@/types/pomodoro";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { timerSettingsAtom } from "@/stores/settings-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface TimerSettingsDialogProps {
  children: React.ReactNode;
}

export function TimerSettingsDialog({ children }: TimerSettingsDialogProps) {
  const [timerSettings, setTimerSettings] = useAtom(timerSettingsAtom);
  const [open, setOpen] = React.useState(false);
  const form = useForm<TimerSettings>({
    defaultValues: timerSettings,
  });

  useEffect(() => {
    if (open) {
      form.reset(timerSettings);
    }
  }, [open, timerSettings, form]);

  const onSubmit = (data: TimerSettings) => {
    setTimerSettings(data);
    setOpen(false);
    form.reset(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-4"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="timer-enabled"
                checked={form.watch("enabled")}
                onCheckedChange={(checked) => form.setValue("enabled", checked)}
              />
              <Label htmlFor="timer-enabled">Enable timer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="use-timer-for-stats"
                checked={form.watch("useTimerForStats")}
                onCheckedChange={(checked) =>
                  form.setValue("useTimerForStats", checked)
                }
              />
              <Label htmlFor="use-timer-for-stats">Use timer for stats</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
