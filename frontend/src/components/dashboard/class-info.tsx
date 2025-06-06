import React from "react";
import Image from "next/image";

type ClassInfoProps = {
  courseTitle: string;
};

const classInfoData: Record<
  string,
  Array<
    [
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
    ]
  >
> = {
  "Web Development": [
    [
      "Web Development",
      "",
      "8 Sesi",
      "Tidak Butuh Pengalaman",
      "1 - X Juli 2025",
      "",
      "Rayhan",
      "2 Jam/Sesi",
      "",
      "5 Modul",
    ],
  ],
  "Basic Python": [
    [
      "Basic Python",
      "",
      "9 Sesi",
      "Tidak Butuh Pengalaman",
      "30 Juni - 21 Juli 2025",
      "",
      "Daffa",
      "2 Jam/Sesi",
      "",
      "6 Modul",
    ],
  ],
  "Fundamental Cyber Security": [
    [
      "Fundamental Cyber Security",
      "",
      "8 Sesi",
      "Tidak Butuh Pengalaman",
      "30 Juni - 15 Juli 2025",
      "",
      "Ahsan",
      "2 Jam/Sesi",
      "",
      "6 Modul",
    ],
  ],
  "Game Development": [
    [
      "Game Development",
      "",
      "7 Sesi",
      "Tidak Butuh Pengalaman",
      "30 Juni - 11 Juli 2025",
      "",
      "Thomas",
      "2 Jam/Sesi",
      "",
      "5 Modul",
    ],
  ],
  "Graphic Design": [
    [
      "Graphic Design",
      "",
      "8 Sesi",
      "Tidak Butuh Pengalaman",
      "30 Juni - XX Juli 2025",
      "",
      "Geraldine",
      "2 Jam/Sesi",
      "",
      "6 Modul",
    ],
  ],
  "Competitive Programming": [
    [
      "Competitive Programming",
      "",
      "X Sesi",
      "Tidak Butuh Pengalaman",
      "30 Juni - 13 Juli 2025",
      "",
      "Revy",
      "2 Jam/Sesi",
      "",
      "X Modul",
    ],
  ],
  "Data Science & Artificial Intelligence": [
    [
      "Data Sciece & Artificial Intelligence",
      "XX",
      "11 Sesi",
      "Memiliki Prasyarat",
      "30 Juni 2025",
      "",
      "Daffa",
      "2 Jam/Sesi",
      "14 Juli - 28 Juli 2025",
      "8 Modul",
    ],
  ],
  "UI/UX": [
    [
      "UI/UX",
      "XX",
      "10 Sesi",
      "Memiliki Prasyarat",
      "30 Juni 2025",
      "",
      "Ken",
      "2 Jam/Sesi",
      "17 Juli - 28 Juli 2025",
      "8 Modul",
    ],
  ],
  "Software Engineering": [
    [
      "Software Engineering",
      "XX",
      "8 Sesi",
      "Memiliki Prasyarat",
      "30 Juni 2025",
      "",
      "Rayhan",
      "2 Jam/Sesi",
      "16 Juli - 26 Juli 2025",
      "6 Modul",
    ],
  ],
  "Cyber Security": [
    [
      "Cyber Security",
      "XX",
      "8 Sesi",
      "Memiliki Prasyarat",
      "30 Juni 2025",
      "",
      "Ahsan",
      "2 Jam/Sesi",
      "16 Juli - 27 Juli 2025",
      "6 Modul",
    ],
  ],
  "Python + Data Science & Artificial Intelligence": [
    [
      "Basic Python",
      "",
      "9 Sesi",
      "",
      "30 Juni - 21 Juli 2025",
      "Entry",
      "Daffa",
      "2 Jam/Sesi",
      "",
      "6 Modul",
    ],
    [
      "Data Science & Artificial Intelligence",
      "XX",
      "10 Sesi",
      "Memiliki Prasyarat",
      "",
      "Intermediate",
      "Daffa",
      "2 Jam/Sesi",
      "14 Juli - 28 Juli 2025",
      "8 Modul",
    ],
  ],
  "Web Development + Software Engineering": [
    [
      "Web Development",
      "",
      "8 Sesi",
      "",
      "1 - X Juli 2025",
      "Entry",
      "Daffa",
      "2 Jam/Sesi",
      "",
      "5 Modul",
    ],
    [
      "Software Engineering",
      "XX",
      "7 Sesi",
      "Memiliki Prasyarat",
      "",
      "Intermediate",
      "Rayhan",
      "2 Jam/Sesi",
      "16 Juli - 26 Juli 2025",
      "6 Modul",
    ],
  ],
  "Fundamental Cyber Security + Cyber Security": [
    [
      "Fundamental Cyber Security",
      "",
      "8 Sesi",
      "",
      "30 Juni - 15 Juli 2025",
      "Entry",
      "Ahsan",
      "2 Jam/Sesi",
      "",
      "6 Modul",
    ],
    [
      "Cyber Security",
      "XX",
      "7 Sesi",
      "Memiliki Prasyarat",
      "",
      "Intermediate",
      "Ahsan",
      "2 Jam/Sesi",
      "16 Juli - 27 Juli 2025",
      "6 Modul",
    ],
  ],
  "Graphic Design + UI/UX": [
    [
      "Graphic Design",
      "",
      "17 Sesi",
      "",
      "30 Juni - 28 Juli 2025",
      "Entry to Intermediate",
      "",
      "2 Jam/Sesi",
      "",
      "14 Modul",
    ],
  ],
};

const ClassInfo = ({ courseTitle }: ClassInfoProps) => {
  const classInfo = classInfoData[courseTitle] || [];
  return (
    <div className="h-full border-solid border-2 border-neutral-500 rounded-[20px] px-5 py-5">
      <p className="font-bold text-lg text-neutral-50 border-b-2 border-neutral-500 pb-2">
        Detailed Information About Our Class
      </p>
      {courseTitle !== "Graphic Design + UI/UX" &&
        classInfo.map(
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
                <div className="flex flex-col gap-2 w-1/2">
                  {Mentor !== "" && (
                    <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                      <Image
                        src={"/icons/ellipse-icon.svg"}
                        alt="ellipse"
                        width={18}
                        height={18}
                      ></Image>
                      <p>{Mentor}</p>
                    </div>
                  )}
                  {Session !== "" && (
                    <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                      <Image
                        src={"/icons/black-target-icon.svg"}
                        alt="target-icon"
                        width={18}
                        height={18}
                        className="text-black"
                      ></Image>
                      <p>{Session}</p>
                    </div>
                  )}

                  {Prerequisites !== "" && (
                    <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
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
                    <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
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
                    <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
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
                <div className="flex flex-col gap-2 w-1/2">
                  {TA !== "" && (
                    <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                      <Image
                        src={"/icons/ellipse-icon.svg"}
                        alt="ellipse"
                        width={18}
                        height={18}
                      ></Image>

                      <p>{TA}</p>
                    </div>
                  )}
                  {Duration !== "" && (
                    <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                      <Image
                        src={"/icons/black-time-icon.svg"}
                        alt="time-icon"
                        width={18}
                        height={18}
                      ></Image>
                      <p>{Duration}</p>
                    </div>
                  )}

                  {Date2 !== "" && (
                    <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                      <Image
                        src={"/icons/black-calendar-icon.svg"}
                        alt="calendar-icon"
                        width={18}
                        height={18}
                      ></Image>
                      <p>{Date2}</p>
                    </div>
                  )}
                  {Modul !== "" && (
                    <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                      <Image
                        src={"/icons/black-stack-icon.svg"}
                        alt="stack-icon"
                        width={18}
                        height={18}
                      ></Image>
                      <p>{Modul}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      {courseTitle === "Graphic Design + UI/UX" &&
        classInfo.map(
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
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col gap-2 w-1/2">
                    {Mentor !== "" && (
                      <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                        <Image
                          src={"/icons/ellipse-icon.svg"}
                          alt="ellipse"
                          width={18}
                          height={18}
                        ></Image>
                        <p>{Mentor}</p>
                      </div>
                    )}
                    {Session !== "" && (
                      <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                        <Image
                          src={"/icons/black-target-icon.svg"}
                          alt="target-icon"
                          width={18}
                          height={18}
                          className="text-black"
                        ></Image>
                        <p>{Session}</p>
                      </div>
                    )}

                    {Date1 !== "" && (
                      <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                        <Image
                          src={"/icons/black-calendar-icon.svg"}
                          alt="calendar-icon"
                          width={18}
                          height={18}
                        ></Image>
                        <p>{Date1}</p>
                      </div>
                    )}
                    {Prerequisites !== "" && (
                      <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                        <Image
                          src={"/icons/alert-icon.svg"}
                          alt="alert-icon"
                          width={18}
                          height={18}
                        ></Image>
                        <p>{Prerequisites}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    {TA !== "" && (
                      <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                        <Image
                          src={"/icons/ellipse-icon.svg"}
                          alt="ellipse"
                          width={18}
                          height={18}
                        ></Image>

                        <p>{TA}</p>
                      </div>
                    )}
                    {Duration !== "" && (
                      <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                        <Image
                          src={"/icons/black-time-icon.svg"}
                          alt="time-icon"
                          width={18}
                          height={18}
                        ></Image>
                        <p>{Duration}</p>
                      </div>
                    )}

                    {Date2 !== "" && (
                      <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                        <Image
                          src={"/icons/black-calendar-icon.svg"}
                          alt="calendar-icon"
                          width={18}
                          height={18}
                        ></Image>
                        <p>{Date2}</p>
                      </div>
                    )}
                    {Modul !== "" && (
                      <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2">
                        <Image
                          src={"/icons/black-stack-icon.svg"}
                          alt="stack-icon"
                          width={18}
                          height={18}
                        ></Image>
                        <p>{Modul}</p>
                      </div>
                    )}
                  </div>
                </div>
                {ClassLevel !== "" && (
                  <div className="w-full h-6.5 bg-neutral-50 text-neutral-900 text-xs font-display py-1 rounded-[4px] border-solid border-2 border-neutral-500 flex flex-row gap-2 justify-center">
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
            </div>
          )
        )}
    </div>
  );
};

export default ClassInfo;
