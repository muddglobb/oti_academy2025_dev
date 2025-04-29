import React from "react";
import EntryClassInfo from "@/app/modules/programs/entry-classinfo-section";
import ClassHero from "@/app/modules/programs/hero-section";

const webDevelopment = () => {
  return (
    <>
      <ClassHero
        classLevel="Beginer Class"
        className="Web Development"
        classDescription="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa harum accusamus quos incidunt vero sed iusto tempora similique, dignissimos reprehenderit dicta amet voluptate, ducimus ex rem aliquam, molestiae commodi sapiente."
      ></ClassHero>
      <EntryClassInfo
        date="1 - 15 June 2025"
        sesi="6 Sesi"
        jam="2 Jam/Sesi"
        modul="10 Modul"
      />
    </>
  );
};

export default webDevelopment;
