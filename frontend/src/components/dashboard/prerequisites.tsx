import React from "react";

type PrerequisitesProps = {
  courseTitle: string;
};

const PrerequisitesData: Record<string, string> = {
  "Data Science & Artificial Intelligence": "-",
  "UI/UX": "-",
  "Software Engineering": "-",
  "Cyber Security": "-",
};

const Prerequisites = ({ courseTitle }: PrerequisitesProps) => {
  const Prerequisites = PrerequisitesData[courseTitle] || [];
  return (
    <div className="w-full rounded-[20px] border-solid border-2 border-neutral-500 p-5">
      <div className="">
        <p className="text-lg text-neutral-50 font-display border-b-2 border-neutral-500 pb-3 font-bold">
          Prerequisites
        </p>
        <p className="text-xs mt-4">{Prerequisites}</p>
      </div>
    </div>
  );
};

export default Prerequisites;
