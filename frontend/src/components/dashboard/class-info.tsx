import React from "react";
import Image from "next/image";

type ClassInfoData = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

const ClassInfo = ({ classInfo }: { classInfo: ClassInfoData[] }) => {
  return (
    <div className="w-full border-solid border-2 border-neutral-500 rounded-[20px] px-5 py-5">
      <p className="font-bold text-lg text-neutral-50 border-b-2 border-neutral-500 pb-2">
        Detailed Information About Our Class
      </p>
      {classInfo.map(
        (
          [
            ClassName,
            Mentor,
            Session,
            Prerequisites,
            Date1,
            ClassLevel,
            TA,
            Duration,
            Date2,
            Modul,
          ],
          index
        ) => (
          <div key={index}>
            <p className="text-xs text-neutral-50 mt-3 mb-2">{ClassName}</p>
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2">
                <div className="w-40 sm:w-59 h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                  <Image
                    src={"/icons/ellipse-icon.svg"}
                    alt="ellipse"
                    width={18}
                    height={18}
                  ></Image>
                  <p>{Mentor}</p>
                </div>
                <div className="w-40 sm:w-59 h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                  <Image
                    src={"/icons/black-target-icon.svg"}
                    alt="target-icon"
                    width={18}
                    height={18}
                    className="text-black"
                  ></Image>
                  <p>{Session}</p>
                </div>
                {Prerequisites !== "" && (
                  <div className="w-40 sm:w-59 h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                    <Image
                      src={"/icons/alert-icon.svg"}
                      alt="alert-icon"
                      width={18}
                      height={18}
                    ></Image>
                    <p>{Prerequisites}</p>
                  </div>
                )}
                {Date1 !== "" && (
                  <div className="w-40 sm:w-59 h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                    <Image
                      src={"/icons/black-calendar-icon.svg"}
                      alt="calendar-icon"
                      width={18}
                      height={18}
                    ></Image>
                    <p>{Date1}</p>
                  </div>
                )}
                {ClassLevel !== "" && (
                  <div className="w-40 sm:w-59 h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                    <Image
                      src={"/icons/chart-icon.svg"}
                      alt="chart-icon"
                      width={18}
                      height={18}
                    ></Image>
                    <p>{ClassLevel}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {TA !== "" && (
                  <div className="w-40 sm:w-59 h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                    <Image
                      src={"/icons/ellipse-icon.svg"}
                      alt="ellipse"
                      width={18}
                      height={18}
                    ></Image>

                    <p>{TA}</p>
                  </div>
                )}
                <div className="w-40 sm:w-59 h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                  <Image
                    src={"/icons/black-time-icon.svg"}
                    alt="time-icon"
                    width={18}
                    height={18}
                  ></Image>
                  <p>{Duration}</p>
                </div>
                {Date2 !== "" && (
                  <div className="w-40 sm:w-59 h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                    <Image
                      src={"/icons/black-calendar-icon.svg"}
                      alt="calendar-icon"
                      width={18}
                      height={18}
                    ></Image>
                    <p>{Date2}</p>
                  </div>
                )}

                <div className="w-40 sm:w-59 h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                  <Image
                    src={"/icons/black-stack-icon.svg"}
                    alt="stack-icon"
                    width={18}
                    height={18}
                  ></Image>
                  <p>{Modul}</p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ClassInfo;
