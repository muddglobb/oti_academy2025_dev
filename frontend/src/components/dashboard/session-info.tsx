import React from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import Link from "next/link";

type Material = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  unlockDate: {
    wib: {
      iso: string;
    };
  };
  resourceUrl: string;
  courseTime: string;
  courseDuration: string;
};

type Enroll = {
  status: string;
  message: string;
  data: {
    isEnrolled: boolean;
  };
};

type SessionProps = {
  courseID1: string;
  courseID2?: string;
  courseTitle1: string;
  courseTitle2?: string;
};

const SessionInfo = async ({
  courseID1,
  courseID2,
  courseTitle1,
  courseTitle2,
}: SessionProps) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  async function getData(courseID: string) {
    const res = await fetch(
      `${process.env.BASE_URL}/materials/course/${courseID}/public`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res;
  }

  async function getEnroll(courseID: string) {
    const enrollRes = await fetch(
      `${process.env.BASE_URL}/enrollments/${courseID}/status`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return enrollRes;
  }

  const res = await getData(courseID1);
  const MaterialData = await res.json();

  let sessions: Material[] = Array.isArray(MaterialData.data)
    ? MaterialData.data
    : [];

  if (courseID2 && courseID2 !== courseID1) {
    const res2 = await getData(courseID2);
    const MaterialData2 = await res2.json();
    if (Array.isArray(MaterialData2.data)) {
      sessions = [...sessions, ...MaterialData2.data];
    }
  }

  const enrollRes = await getEnroll(courseID1);
  const enrollData = await enrollRes.json();

  let enroll: Enroll[] = Array.isArray(enrollData.data) ? enrollData.data : [];

  const isEnrolled = enrollData.data?.isEnrolled;

  const courseSessionsTime: Record<
    string,
    Array<{
      courseTime: string;
      courseDuration: string;
    }>
  > = {
    "Web Development": [
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "TBA",
        courseDuration: "TBA",
      },
    ],
    "Software Engineering": [
      {
        courseTime: "14.00 - 15.00",
        courseDuration: "1 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 15.30",
        courseDuration: "1.5 Jam",
      },
      {
        courseTime: "14.00 - 15.00",
        courseDuration: "1 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
    ],
    "Basic Python": [
      { courseTime: "09.00 - 11.00", courseDuration: "2 Jam" },
      { courseTime: "09.00 - 11.00", courseDuration: "2 Jam" },
      { courseTime: "09.00 - 11.00", courseDuration: "2 Jam" },
      { courseTime: "09.00 - 11.00", courseDuration: "2 Jam" },
      { courseTime: "09.00 - 11.00", courseDuration: "2 Jam" },
      { courseTime: "09.00 - 11.00", courseDuration: "2 Jam" },
      { courseTime: "TBA", courseDuration: "TBA" },
    ],
    "Fundamental Cyber Security": [
      {
        courseTime: "19.00 - 21.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "19.00 - 21.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "19.00 - 21.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "19.00 - 21.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "19.00 - 21.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "19.00 - 21.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "13.00 - 15.00",
        courseDuration: "2 Jam",
      },
    ],
    "Game Development": [
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "15.00 - 17.00",
        courseDuration: "2 Jam",
      },
    ],
    "Graphic Design": [
      {
        courseTime: "16.00 - 17.30",
        courseDuration: "1.5 Jam",
      },
      {
        courseTime: "19.00 - 20.30",
        courseDuration: "1.5 Jam",
      },
      {
        courseTime: "19.00 - 20.30",
        courseDuration: "1.5 Jam",
      },
      {
        courseTime: "19.00 - 20.30",
        courseDuration: "1.5 Jam",
      },
      {
        courseTime: "19.00 - 20.30",
        courseDuration: "1.5 Jam",
      },
      {
        courseTime: "19.00 - 20.30",
        courseDuration: "1.5 Jam",
      },
      {
        courseTime: "TBA",
        courseDuration: "TBA",
      },
    ],
    "Competitive Programming": [
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "09.00 - 11.00",
        courseDuration: "2 Jam",
      },
    ],
    "Data Science & Artificial Intelligence": [
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 15.00",
        courseDuration: "1 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
    ],
    "UI/UX": [
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "18.30 - 20.30",
        courseDuration: "2 Jam",
      },
    ],
    "Cyber Security": [
      {
        courseTime: "13.00 - 15.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "13.00 - 15.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "13.00 - 15.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "13.00 - 15.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "14.00 - 16.00",
        courseDuration: "2 Jam",
      },
      {
        courseTime: "13.00 - 15.00",
        courseDuration: "2 Jam",
      },
    ],
  };

  const sessionsByTitle: Record<string, Material[]> = {};
  if (courseTitle1) {
    sessionsByTitle[courseTitle1] = sessions.filter(
      (session) => session.courseId === courseID1
    );
  }
  if (courseTitle2 && courseID2) {
    sessionsByTitle[courseTitle2] = sessions.filter(
      (session) => session.courseId === courseID2
    );
  }

  return (
    <div className="rounded-[20px] border-solid border-2 border-neutral-500 px-5 py-4">
      <p className="font-bold text-lg text-neutral-50 pb-2 border-b-2 border-neutral-500 mb-4">
        Complete Session Information
      </p>
      <div>
        {sessions.length === 0 && (
          <div className="text-neutral-50 font-bold">No Sessions Found</div>
        )}
        {Object.entries(sessionsByTitle).map(([title, sessionList]) =>
          sessionList.map((session, index) => {
            const extra = courseSessionsTime[title]?.[index] ?? {};
            const dateObj = new Date(session.unlockDate?.wib.iso ?? "");
            const formattedDate = dateObj.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

            const sessionDate = dateObj.toISOString().split("T")[0];
            const now = new Date();
            const todayDate = now.toISOString().split("T")[0];

            let status = "Scheduled";

            if (todayDate > sessionDate) {
              status = "Completed";
            } else if (todayDate === sessionDate) {
              status = "On Going";
            }

            return (
              <div
                className="relative flex flex-col gap-7.5 w-full items-center pb-9"
                key={session.id}
              >
                {/* Titik bulat */}
                {/* <div className="absolute left-1 flex h-5 w-5 -translate-x-1/2 -translate-y-0 items-center justify-center rounded-full ring-2 ring-white bg-neutral-800 z-10"></div> */}
                <div className="absolute left-1 top-[2px] flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full ring-2 ring-white bg-neutral-800 z-1"></div>

                {/* Garis hanya jika bukan elemen terakhir */}
                {index !== sessionList.length - 1 && (
                  <div className="absolute left-1 top-2 bottom-0 w-0.5 -translate-x-1/2 bg-white z-0"></div>
                )}

                {/* Konten session */}
                <div className="relative flex w-full pl-8 text-left text-[12px] md:text-lg ">
                  <div className="w-full">
                    {isEnrolled === true && (
                      <div className="flex flex-row gap-2 items-center">
                        <div
                          className={`rounded-full w-3.5 h-3.5 ${
                            status === "Scheduled"
                              ? "bg-error-300"
                              : status === "On Going"
                              ? "bg-success-300"
                              : "bg-primary-300"
                          }`}
                        ></div>
                        <p
                          className={`${
                            status === "Scheduled"
                              ? "text-error-300"
                              : status === "On Going"
                              ? "text-success-300"
                              : "text-primary-300"
                          }`}
                        >
                          {status}
                        </p>
                      </div>
                    )}

                    <h3 className="font-bold">{session.title}</h3>
                    <div className="flex flex-col items-center xl:flex-row lg:justify-between gap-4 mt-2">
                      <div className="flex flex-row gap-1.5 sm:gap-2.5 justify-between">
                        <div className=" bg-primary-700 rounded-sm">
                          <div className="flex flex-row gap-1 sm:gap-2 m-1">
                            <Image
                              src={"/icons/calendar-icon.svg"}
                              alt="calendar-icon"
                              width={18}
                              height={18}
                            />

                            <p className="text-xs ">{formattedDate}</p>
                          </div>
                        </div>
                        <div className=" bg-primary-700 rounded-sm">
                          <div className="flex flex-row gap-1 sm:gap-2 m-1">
                            <Image
                              src={"/icons/time-icon.svg"}
                              alt="time-icon"
                              width={18}
                              height={18}
                            />
                            <p className="text-xs">{extra.courseTime}</p>
                          </div>
                        </div>
                        <div className=" bg-primary-700 rounded-sm">
                          <div className="flex flex-row gap-1 sm:gap-2 m-1">
                            <Image
                              src={"/icons/time-icon.svg"}
                              alt="time-icon"
                              width={18}
                              height={18}
                            />
                            <p className="text-xs ">{extra.courseDuration}</p>
                          </div>
                        </div>
                      </div>
                      {isEnrolled === true && (
                        <div className="flex flex-row gap-5 self-center">
                          <div
                            className={`rounded-[8px] py-2 px-8 lg:px-13 ${
                              status === "Scheduled"
                                ? "text-neutral-400 bg-neutral-800"
                                : status === "On Going"
                                ? "text-neutral-50 bg-primary-400"
                                : "text-neutral-400 bg-neutral-800"
                            }`}
                          >
                            {status === "On Going" ? (
                              <Link href={`https://www.zoom.com/`}>
                                <p>Link Zoom</p>
                              </Link>
                            ) : (
                              <span className="pointer-events-none">
                                Link Zoom
                              </span>
                            )}
                          </div>
                          <div
                            className={`rounded-[8px] py-2 px-8 lg:px-13 ${
                              status === "Scheduled"
                                ? "text-neutral-400 bg-neutral-800"
                                : status === "On Going"
                                ? "text-neutral-50 bg-transparent border-solid border-2 border-primary-500"
                                : "text-neutral-50 bg-transparent border-solid border-2 border-primary-500"
                            }`}
                          >
                            {status === "On Going" && (
                              <Link href={session.resourceUrl}>
                                <p>See Material</p>
                              </Link>
                            )}
                            {status === "Completed" && (
                              <Link href={session.resourceUrl}>
                                <p>See Material</p>
                              </Link>
                            )}
                            {status === "Scheduled" && (
                              <span className="pointer-events-none">
                                See Material
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-xs">{`"${session.description}"`}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SessionInfo;
