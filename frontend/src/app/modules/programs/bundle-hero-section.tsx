import React from "react";
import CountdownTimer from "@/components/timer";
import BackButton from "@/components/backButton";

const EntryBundle = () => {
  return (
    <section className="flex flex-col items-center justify-center h-152 font-display  bg-no-repeat bg-cover w-full">
      <div className="self-start">
        <BackButton></BackButton>
      </div>
      <div className=" text-center font-display w-xl lg:w-4xl">
        <div className="flex justify-center items-center gap-5">
          <div className="text-white border-solid border-1 rounded-[5px] px-4.5 py-1.5 border-white">
            <CountdownTimer targetDate={"2025-05-30T23:59:59"} />
          </div>
          <div className="bg-primary-800 text-white  rounded-lg text-center">
            <p className="m-auto px-4.5 py-2">Bundle</p>
          </div>
        </div>

        <p className="text-[46px] font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
          Web Development + Software Engineering
        </p>
        <p className="font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem
          provident odit repellendus temporibus magnam. Sequi dolores enim illo
          debitis corrupti quam deserunt nisi, commodi nam voluptatem omnis quo
          reprehenderit vel.
        </p>
        <button
          className="bg-blue-500 text-white p-[8px] text-base m-[14px] rounded-lg"
          type="button"
        >
          Begin Your Journey Here
        </button>
      </div>
    </section>
  );
};

export default EntryBundle;
