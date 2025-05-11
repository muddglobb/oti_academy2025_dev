import React from "react";

type ClassCapacityProps = {
  ClassName: string;
  ClassDesc: string;
};

const ClassCapacity = ({ ClassName, ClassDesc }: ClassCapacityProps) => {
  return (
    <div>
      <p>{ClassName}</p>
      <p>{ClassDesc}</p>
    </div>
  );
};

export default ClassCapacity;
