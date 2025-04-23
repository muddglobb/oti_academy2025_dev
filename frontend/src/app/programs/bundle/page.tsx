import React from "react";
import BundleHero from "@/app/modules/programs/bundle-hero-section";
import BundleClassInfo from "@/app/modules/programs/bundle-classinfo-section";

const bundle = () => {
  return (
    <>
      <div>
        <BundleHero></BundleHero>
        <BundleClassInfo></BundleClassInfo>
      </div>
    </>
  );
};

export default bundle;
