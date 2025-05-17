import React from "react";
import Image from "next/image";

type PrevArrowProps = {
  onClick?: () => void;
};
const PrevArrow: React.FC<PrevArrowProps> = ({ onClick }) => {
  return (
    <div className="absolute top-[100%] cursor-pointer" onClick={onClick}>
      <div className="p-3 bg-[var(--color-primary-800)] rounded-lg flex items-center gap-2 mt-2">
        <Image
          src="/icons/backarrow-icon.svg"
          alt="MUNDUR"
          width={20}
          height={20}
          // className="transform rotate-180"
        ></Image>
        <p className="text-[var(--color-neutral-50)] text-sm">Previous</p>
      </div>
    </div>
  );
};

export default PrevArrow;
