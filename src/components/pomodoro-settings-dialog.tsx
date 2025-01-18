import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PomodoroSettings } from "@/types/pomodoro";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type FormValues = PomodoroSettings & {
  enableLongerBreaks: boolean;
};

const SESSION_LENGTH_OPTIONS = [10, 15, 20, 25, 30, 40, 45, 60];
const BREAK_LENGTH_OPTIONS = [3, 5, 8, 10, 15, 20, 30];

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
  const [open, setOpen] = React.useState(false);
  const form = useForm<FormValues>({
    defaultValues: {
      enableLongerBreaks: true,
      longerBreaks: {
        frequency: 3,
        length: 15,
      },
      ...settings,
    },
  });

  const watchEnableLongerBreaks = form.watch("enableLongerBreaks");

  const onSubmit = (data: FormValues) => {
    onSettingsChange({
      ...data,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-4"
        >
          <div className="grid grid-rows-[auto_1fr] gap-y-2">
            <label className="text-sm font-medium">Session Length</label>
            <Select
              value={form.watch("sessionLength").toString()}
              onValueChange={(value) =>
                form.setValue("sessionLength", Number(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Session Length" />
              </SelectTrigger>
              <SelectContent>
                {SESSION_LENGTH_OPTIONS.map((mins) => (
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
              value={form.watch("breakLength").toString()}
              onValueChange={(value) =>
                form.setValue("breakLength", Number(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Break Length" />
              </SelectTrigger>
              <SelectContent>
                {BREAK_LENGTH_OPTIONS.map((mins) => (
                  <SelectItem key={mins} value={mins.toString()}>
                    {mins} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="longer-breaks"
                checked={watchEnableLongerBreaks}
                onCheckedChange={(checked) =>
                  form.setValue("enableLongerBreaks", checked)
                }
              />
              <Label htmlFor="longer-breaks">Enable longer breaks</Label>
            </div>

            <div className="grid grid-cols-2 gap-4 pl-6">
              <div className="grid grid-rows-[auto_1fr] gap-y-2">
                <label className="text-sm font-medium">Frequency</label>
                <Select
                  disabled={!watchEnableLongerBreaks}
                  value={form.watch("longerBreaks.frequency")?.toString()}
                  onValueChange={(value) =>
                    form.setValue("longerBreaks.frequency", Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Break frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        Every {n} breaks
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-rows-[auto_1fr] gap-y-2">
                <label className="text-sm font-medium">Long break length</label>
                <Select
                  disabled={!watchEnableLongerBreaks}
                  value={form.watch("longerBreaks.length")?.toString()}
                  onValueChange={(value) =>
                    form.setValue("longerBreaks.length", Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Break length" />
                  </SelectTrigger>
                  <SelectContent>
                    {BREAK_LENGTH_OPTIONS.map((mins) => (
                      <SelectItem key={mins} value={mins.toString()}>
                        {mins} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
