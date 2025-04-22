"use client";
import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date | string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

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
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

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
