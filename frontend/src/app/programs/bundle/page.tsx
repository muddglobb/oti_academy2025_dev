import React from "react";
import BundleClassInfo from "@/app/modules/programs/bundle-classinfo-section";
import ClassHero from "@/app/modules/programs/hero-section";

const bundle = () => {
  return (
    <>
      <div>
        <ClassHero
          classLevel="Bundle"
          className="Web Development + Software Engineering"
          classDescription="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa harum accusamus quos incidunt vero sed iusto tempora similique, dignissimos reprehenderit dicta amet voluptate, ducimus ex rem aliquam, molestiae commodi sapiente."
        ></ClassHero>
        <BundleClassInfo
          date="1 - 15 June 2025"
          sesi="6 Sesi"
          jam="2 Jam/Sesi"
          modul="10 Modul"
        ></BundleClassInfo>
      </div>
    </>
  );
};

export default bundle;
