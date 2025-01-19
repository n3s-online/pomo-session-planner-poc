import { useState, useEffect, useRef, useMemo } from "react";

export const useElapsedTime = (
  startDate?: Date
): { minutes: number; seconds: number } | null => {
  const [elapsedTime, setElapsedTime] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);

  const intervalRef = useRef<NodeJS.Timeout>();

  // Memoize the start timestamp to keep it stable
  const startTimestamp = useMemo(
    () => (startDate ? startDate.getTime() : null),
    [startDate]
  );

  useEffect(() => {
    if (!startTimestamp) {
      setElapsedTime(null);
      return;
    }

    const calculateElapsed = () => {
      const diff = Date.now() - startTimestamp;
      return {
        minutes: Math.floor(diff / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };

    const updateTime = () => {
      setElapsedTime(calculateElapsed());
    };

    updateTime();
    intervalRef.current = setInterval(updateTime, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTimestamp]);

  return elapsedTime;
};
