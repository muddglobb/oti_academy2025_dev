"use client";
import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date | string;
  initialServerTime?: number;
}

const CountdownTimer = ({
  targetDate,
  initialServerTime,
}: CountdownTimerProps) => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const initialTime = initialServerTime
      ? new Date(initialServerTime)
      : new Date();
    return calculateTimeLeft(initialTime);
  });

  function calculateTimeLeft(now: Date) {
    const targetTime = new Date(targetDate).getTime();

    const difference = targetTime - now.getTime();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  const formatTime = (time: number) => time.toString().padStart(2, "0");

  return (
    <div className="flex items-center justify-center space-x-0.5 font-display text-[22px] font-bold">
      {timeLeft.days > 0 && (
        <>
          <span className="bg-transparent">{formatTime(timeLeft.days)}</span>
          <span>:</span>
        </>
      )}
      <span className="bg-transparent ">{formatTime(timeLeft.hours)}</span>
      <span>:</span>
      <span className="bg-transparent ">{formatTime(timeLeft.minutes)}</span>
      <span>:</span>
      <span className="bg-transparent ">{formatTime(timeLeft.seconds)}</span>
    </div>
  );
};

export default CountdownTimer;
