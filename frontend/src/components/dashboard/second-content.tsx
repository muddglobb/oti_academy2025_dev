import React from "react";
import EnrolledClass from "./enrolled-class";
import GrupWa from "./grup-wa";
import Calendar from "./calendar";

const SecondContent = async () => {
  return (
    <div className="lg:grid lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2">
        <EnrolledClass check="NO" />
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1 mt-6 lg:mt-0">
        {/* Calendar */}
        <Calendar />

        <GrupWa />
      </div>
    </div>
  );
};

export default SecondContent;
