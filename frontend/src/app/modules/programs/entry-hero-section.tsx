import React from "react";

const EntryHero = () => {
  return (
    <section className="grid place-items-center h-152 font-display  bg-no-repeat bg-cover w-full">
      <div className="flex-col items-center justify-center text-center font-display w-xl lg:w-4xl">
        <div className="flex justify-center gap-5">
          <div className="text-white">Countdown Timer</div>
          <div className="bg-blue-800 text-white p-2 rounded-lg">
            Beginner Level
          </div>
        </div>

        <p className="text-[46px] font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
          Web Development
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

export default EntryHero;
