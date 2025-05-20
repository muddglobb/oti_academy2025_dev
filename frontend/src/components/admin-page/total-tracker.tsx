import React from "react";

const TotalTracker = () => {
  return (
    <div className="h-full flex flex-col gap-7">
      <div className="h-1/2 bg-neutral-50 p-5 rounded-[20px]">
        <p className="text-4xl font-bold">0</p>
        <p className="text-lg">Pendaftar</p>
      </div>
      <div className="h-1/2 bg-neutral-50 p-5 rounded-[20px]">
        <p className="text-4xl font-bold">0</p>
        <p className="text-lg">Approved</p>
      </div>
    </div>
  );
};

export default TotalTracker;
