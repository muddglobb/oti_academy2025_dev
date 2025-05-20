import React from "react";
// import { useEffect, useState } from "react";

interface ClassCapacityProps {
  currentCount: number;
  capacity: number;
  percentage: number;
  className?: string;
}

const CapacityProgressBar: React.FC<ClassCapacityProps> = ({
  currentCount,
  capacity,
  percentage,
  className = "",
}) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-sm sm:text-lg font-medium text-neutral-50">
        <p>
          {currentCount} / {capacity}
        </p>
      </div>
      <div
        className={`w-[90%] bg-gray-200 rounded-lg overflow-hidden my-auto ${className}`}
      >
        <div
          className="h-2 bg-blue-600 transition-width duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default CapacityProgressBar;
