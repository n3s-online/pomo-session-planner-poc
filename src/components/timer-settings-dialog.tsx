import React, { useEffect } from "react";
import { TimerSettings } from "@/types/pomodoro";
import { Button } from "@/components/ui/button";
import { useAtom, useSetAtom } from "jotai";
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
import { resetStartTimesAtom } from "@/stores/sessions-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { playSound, SOUNDS } from "@/lib/sounds";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface TimerSettingsDialogProps {
  children: React.ReactNode;
}

const timerSettingsSchema = z.object({
  enabled: z.boolean(),
  useTimerForStats: z.boolean(),
  sound: z
    .object({
      enabled: z.boolean(),
      soundName: z.string(),
      volume: z.number().min(0).max(1),
    })
    .refine(
      (data) => {
        if (data.enabled) {
          return !!data.soundName;
        }
        return true;
      },
      {
        message: "Sound type must be selected when sound is enabled",
        path: ["soundName"],
      }
    ),
});

type TimerSettingsFormData = z.infer<typeof timerSettingsSchema>;

export function TimerSettingsDialog({ children }: TimerSettingsDialogProps) {
  const resetStartTimes = useSetAtom(resetStartTimesAtom);
  const [timerSettings, setTimerSettings] = useAtom(timerSettingsAtom);
  const [open, setOpen] = React.useState(false);
  const form = useForm<TimerSettingsFormData>({
    resolver: zodResolver(timerSettingsSchema),
    defaultValues: timerSettings,
  });

  useEffect(() => {
    if (open) {
      form.reset(timerSettings);
    }
  }, [open, timerSettings, form]);

  const onSubmit = (data: TimerSettings) => {
    if (data.enabled === true && timerSettings.enabled === false) {
      resetStartTimes();
    }
    setTimerSettings(data);
    setOpen(false);
    form.reset(data);
  };

  const playTestSound = () => {
    const soundName = form.watch("sound.soundName") as keyof typeof SOUNDS;
    const volume = form.watch("sound.volume");
    playSound(soundName, volume);
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
            <div className="flex items-center space-x-2">
              <Switch
                id="sound-enabled"
                checked={form.watch("sound.enabled")}
                onCheckedChange={(checked) =>
                  form.setValue("sound.enabled", checked)
                }
              />
              <Label htmlFor="sound-enabled">Enable sound</Label>
            </div>

            {form.watch("sound.enabled") && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sound-type">Sound Type</Label>
                  <div className="flex gap-2">
                    <Select
                      value={form.watch("sound.soundName")}
                      onValueChange={(value) =>
                        form.setValue("sound.soundName", value as any)
                      }
                    >
                      <SelectTrigger id="sound-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(SOUNDS).map((sound) => (
                          <SelectItem key={sound} value={sound}>
                            {sound}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={!form.watch("sound.enabled")}
                      onClick={playTestSound}
                    >
                      Test Sound
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="sound-volume">Volume</Label>
                  <Slider
                    id="sound-volume"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[form.watch("sound.volume")]}
                    onValueChange={([value]: [number]) =>
                      form.setValue("sound.volume", value)
                    }
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter className="gap-2 md:gap-1">
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                resetStartTimes();
                setOpen(false);
              }}
            >
              Reset Timer
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
