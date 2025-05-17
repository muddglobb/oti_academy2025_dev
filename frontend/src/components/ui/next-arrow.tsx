import React from "react";
import Image from "next/image";

type NextArrowProps = {
  onClick?: () => void;
};
const NextArrow: React.FC<NextArrowProps> = ({ onClick }) => {
  return (
    <div className="absolute right-0 cursor-pointer" onClick={onClick}>
      <div className="p-3 bg-[var(--color-primary-800)] rounded-lg flex items-center gap-2 mt-2">
        <p className="text-[var(--color-neutral-50)] text-sm">Next</p>
        <Image
          src="/icons/backarrow-icon.svg"
          alt="MAJU"
          width={20}
          height={20}
          className="transform rotate-180"
        ></Image>
      </div>
    </div>
  );
};

export default NextArrow;
