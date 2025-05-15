import React from "react";

type ClassCapacityProps = {
  ClassName: string;
  ClassDesc: string;
};

const ClassCapacity = ({ ClassName, ClassDesc }: ClassCapacityProps) => {
  return (
    <div className="w-270 h-58 border-sol border-2 border-neutral-500 rounded-[20px] p-5">
      <p className="font-display font-bold text-[26px]">{ClassName}</p>
      <p>{ClassDesc}</p>
    </div>
  );
};

export default ClassCapacity;
