import React from "react";
import EntryHero from "@/app/modules/programs/entry-hero-section";
import EntryClassInfo from "@/app/modules/programs/entry-classinfo-section";
import EntrySessionInfo from "@/app/modules/programs/entry-sessioninfo-section";

const webDevelopment = () => {
  return (
    <>
      <div className="bg-[url(/images/background-entrylevel.png)] bg-no-repeat bg-cover h-full">
        <EntryHero />
        <EntryClassInfo />
        <EntrySessionInfo />
      </div>
    </>
  );
};

export default webDevelopment;
