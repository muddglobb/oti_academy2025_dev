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
};

type SessionProps = { courseID: string };

const SessionInfo = async ({ courseID }: SessionProps) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.BASE_URL}/materials/course/${courseID}/public`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const MaterialData = await res.json();
  const sessions: Material[] = Array.isArray(MaterialData.data)
    ? MaterialData.data
    : [];

  return (
    <div className="w-full rounded-[20px] border-solid border-2 border-neutral-500 px-6 py-4 mt-6">
      <p className="font-bold text-lg text-neutral-50 pb-2 border-b-2 border-neutral-500 mb-4">
        Complete Session Information
      </p>
      <div>
        {sessions.length === 0 && (
          <div className="text-neutral-50 font-bold">No Sessions Found</div>
        )}
        {sessions.map((session, index) => {
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
              {index !== sessions.length - 1 && (
                <div className="absolute left-1 top-2 bottom-0 w-0.5 -translate-x-1/2 bg-white z-0"></div>
              )}

              {/* Konten session */}
              <div className="relative flex w-full pl-8 text-left text-[12px] md:text-lg ">
                <div className="w-full ">
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
                  <h3 className="font-bold">{session.title}</h3>
                  <div className="flex flex-col items-stretch lg:flex-row lg:justify-between gap-4 mt-2">
                    <div className="flex flex-row gap-5 justify-between">
                      <div className="flex flex-row gap-[5px] items-center bg-primary-700 p-1 rounded-sm">
                        <Image
                          src={"/icons/calendar-icon.svg"}
                          alt="calendar-icon"
                          width={18}
                          height={18}
                        />

                        <p className="text-xs">{formattedDate}</p>
                      </div>
                      <div className="flex flex-row gap-[5px] items-center bg-primary-700 px-1 rounded-sm">
                        <Image
                          src={"/icons/time-icon.svg"}
                          alt="time-icon"
                          width={18}
                          height={18}
                        />
                        <p className="text-xs">08.00 - 10.00</p>
                      </div>
                      <div className="flex flex-row gap-[5px] items-center bg-primary-700 px-1 rounded-sm">
                        <Image
                          src={"/icons/time-icon.svg"}
                          alt="time-icon"
                          width={18}
                          height={18}
                        />
                        <p className="text-xs">2 Jam</p>
                      </div>
                    </div>
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
                          <span className="pointer-events-none">Link Zoom</span>
                        )}
                      </div>
                      <div
                        className={`rounded-[8px] py-2 px-8 lg:px-13 ${
                          status === "Scheduled"
                            ? "text-neutral-400 bg-neutral-800"
                            : status === "On Going"
                            ? "text-neutral-50 bg-transparent border-solid border-2 border-primary-500"
                            : "text-neutral-400 bg-neutral-800"
                        }`}
                      >
                        {status === "On Going" || "Completed" ? (
                          <Link href={``}>
                            <p>See Material</p>
                          </Link>
                        ) : (
                          <span className="pointer-events-none">
                            See Material
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-xs">{`"${session.description}"`}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionInfo;
