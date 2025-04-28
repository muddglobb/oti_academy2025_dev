"use client";
import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date | string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<null | {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>(null);

  function calculateTimeLeft() {
    const targetTime =
      typeof targetDate === "string"
        ? new Date(targetDate).getTime()
        : targetDate.getTime();

    const difference = targetTime - new Date().getTime();

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
    setTimeLeft(calculateTimeLeft()); // Initial set after mount

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  if (!timeLeft) return null; // Avoid rendering until mounted

  return (
    <div className="flex items-center justify-center space-x-0.5 font-display text-3 sm:text-[22px] font-bold">
      {timeLeft.days > 0 && (
        <>
          <span className="bg-transparent">{formatTime(timeLeft.days)}</span>
          <span>:</span>
        </>
      )}
      <span className="bg-transparent">{formatTime(timeLeft.hours)}</span>
      <span>:</span>
      <span className="bg-transparent">{formatTime(timeLeft.minutes)}</span>
      <span>:</span>
      <span className="bg-transparent">{formatTime(timeLeft.seconds)}</span>
    </div>
  );
};

export default CountdownTimer;
