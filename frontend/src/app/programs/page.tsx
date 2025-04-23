import React from "react";
import ProgramsPage from "@/components/programs-page";
import ProgramsPageBackground from "@/components/programs-page-background";
// import Image from "next/image";

const Page = () => {
  // bg-[var(--color-neutral-900)]
  return (
    <div
      className="     
      relative 
      overflow-x-hidden
      "
    >

      <ProgramsPageBackground></ProgramsPageBackground>
      <ProgramsPage></ProgramsPage>
    </div>
  );
};

export default Page;
