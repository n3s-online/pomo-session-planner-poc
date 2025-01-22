import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreakProps } from "@/types/session";
import { useAtomValue, useSetAtom } from "jotai";
import { completeBreakAtom } from "@/stores/sessions-store";
import { useElapsedTime } from "@/hooks/useElapsedTime";
import { timerSettingsAtom } from "@/stores/settings-store";

interface BreakCardProps {
  breakProps: BreakProps;
}

export const BreakCard: React.FC<BreakCardProps> = ({ breakProps }) => {
  const timerSettings = useAtomValue(timerSettingsAtom);
  const completeBreak = useSetAtom(completeBreakAtom);
  const elapsedTime = useElapsedTime(
    breakProps.breakStartDate && new Date(breakProps.breakStartDate)
  );

  return (
    <Card className="ring-2 ring-blue-500 shadow-lg hover:shadow-xl bg-gradient-to-br from-blue-100 to-blue-300 transform scale-100 transition-all duration-300 ease-in-out">
      <CardContent className="p-4">
        <div className="space-y-2 text-center">
          <h3 className="font-medium text-xl text-gray-900">
            {breakProps.minutesDuration} Minute Break
          </h3>
          {timerSettings.enabled && elapsedTime && (
            <p className="text-gray-600">
              {elapsedTime.minutes}:
              {elapsedTime.seconds.toString().padStart(2, "0")}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="default"
          className="w-full"
          onClick={() => completeBreak()}
        >
          Complete Break
        </Button>
      </CardFooter>
    </Card>
  );
};
