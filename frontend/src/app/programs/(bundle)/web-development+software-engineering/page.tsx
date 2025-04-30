import React from "react";
import BundleClassInfo from "@/components/bundle/bundle-classinfo";
import ClassHero from "@/components/entry/entry-hero";

const bundle = () => {
  return (
    <>
      <div>
        <ClassHero
          className="Web Development + Software Engineering"
          classDescription="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa harum accusamus quos incidunt vero sed iusto tempora similique, dignissimos reprehenderit dicta amet voluptate, ducimus ex rem aliquam, molestiae commodi sapiente."
        ></ClassHero>
        <BundleClassInfo
          date="1 - 15 June 2025"
          sesi="6 Sesi"
          jam="2 Jam/Sesi"
          modul="10 Modul"
          mentor="Dhimas Putra"
          mentorImage="/person-placeholder.jpeg"
          mentorDesc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
          mentorLink="https://www.linkedin.com"
          TA="Dhimas Putra"
          TAImage="/person-placeholder.jpeg"
          TADesc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
          TALink="https://www.linkedin.com"
        ></BundleClassInfo>
      </div>
    </>
  );
};

export default bundle;
