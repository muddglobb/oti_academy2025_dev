import React from "react";

const ProgramsHero = () => {
  return (
    <div className="flex-col items-center justify-center px-[250px]">
      <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[46px] font-bold">
        Discover the Range of Programs We Offer
      </p>
      <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[27px]">
        Dari <span className="font-bold">Beginner hingga Intermediate</span>,
        kami menawarkan program yang mencakup keduanya, lengkap{" "}
        <span className="font-bold">
          dengan bundling package untuk pengalaman belajar yang lebih
          menyeluruh!
        </span>
      </p>
    </div>
  );
};

export default ProgramsHero;
