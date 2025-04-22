import React from "react";
import EntryBundle from "@/app/modules/programs/bundle-hero-section";

const bundle = () => {
  return (
    <>
      <div className="bg-[url(/images/background-entrylevel.png)] bg-no-repeat bg-cover h-full">
        <EntryBundle></EntryBundle>
      </div>
    </>
  );
};

export default bundle;
