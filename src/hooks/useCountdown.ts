import { useState, useEffect, useCallback } from "react";

/**
 * A simple countdown hook for rate limiting timers.
 */
export function useCountdown(initialSeconds: number = 0) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(initialSeconds > 0);

  useEffect(() => {
    if (!isActive || remaining <= 0) {
      if (remaining <= 0 && isActive) {
        setIsActive(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, remaining]);

  const start = useCallback((seconds: number) => {
    setRemaining(seconds);
    setIsActive(true);
  }, []);

  const reset = useCallback(() => {
    setRemaining(0);
    setIsActive(false);
  }, []);

  // Format to mm:ss
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return { remaining, isActive, start, reset, formatted };
}
