import { getCourses } from "@/lib/courses/fetch-courses";
import { getisEnrolled } from "@/lib/enrollment/fetch-enrollment";
import { getMaterials } from "@/lib/material/fetch-material";
import React from "react";

export type SessionType = {
  courseId: string;
  createdAt: string;
  description: string;
  durationHrs: number;
  id: string;
  startAt: string;
  updatedAt: string;
};
export type CoursesType = {
  bundleQuota: number;
  createdAt: string;
  description: string;
  entryQuota: number;
  id: string;
  level: string;
  quota: number;
  sessions: SessionType[];
  title: string;
  updatedAt: string;
};

const Calendar = async () => {
  const courses = await getCourses();
  const enrolledCourses: string[] = [];
  const penandaTanggal: boolean[] = Array(35).fill(false); // index 0 sampai 34

  for (const course of courses.data) {
    const isEnrolled = await getisEnrolled(course.id);
    if (isEnrolled.isEnrolled) {
      enrolledCourses.push(course.id);
    }
  }

  const tanggalTarget = {
    "2025-06-30": 0,
    "2025-07-01": 1,
    "2025-07-02": 2,
    "2025-07-03": 3,
    "2025-07-04": 4,
    "2025-07-05": 5,
    "2025-07-06": 6,
    "2025-07-07": 7,
    "2025-07-08": 8,
    "2025-07-09": 9,
    "2025-07-10": 10,
    "2025-07-11": 11,
    "2025-07-12": 12,
    "2025-07-13": 13,
    "2025-07-14": 14,
    "2025-07-15": 15,
    "2025-07-16": 16,
    "2025-07-17": 17,
    "2025-07-18": 18,
    "2025-07-19": 19,
    "2025-07-20": 20,
    "2025-07-21": 21,
    "2025-07-22": 22,
    "2025-07-23": 23,
    "2025-07-24": 24,
    "2025-07-25": 25,
    "2025-07-26": 26,
    "2025-07-27": 27,
    "2025-07-28": 28,
    "2025-07-29": 29,
    "2025-07-30": 30,
    "2025-07-31": 31,
    "2025-08-01": 32,
    "2025-08-02": 33,
    "2025-08-03": 34,
  } as const;

  type TanggalTargetKey = keyof typeof tanggalTarget;

  for (const courseId of enrolledCourses) {
    try {
      const res = await getMaterials({ courseId });

      if (res.status === "success") {
        for (const material of res.data) {
          const isoWib = material.unlockDate?.wib?.iso;

          if (!isoWib) continue;

          const tanggal = isoWib.split("T")[0]; // contoh: "2025-08-01"

          if (tanggal in tanggalTarget) {
            const index = tanggalTarget[tanggal as TanggalTargetKey];
            penandaTanggal[index] = true;
          }
        }
      }
    } catch (err) {
      console.error("Gagal fetch materials untuk course:", courseId, err);
    }
  }

  return (
    <div className="border-2 border-neutral-500 rounded-[20px] p-5 mb-6">
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-neutral-500">
        <h3 className="font-medium">July 2025</h3>
        {enrolledCourses.length ? (<button className="bg-blue-600 text-white text-xs rounded px-2 py-1">
          Jadwal kelas
        </button>):(<button className="bg-blue-600 text-white text-xs rounded px-2 py-1">
          No Class
        </button>)}
        
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
        <div className="text-[var(--color-primary-100)]">M</div>
        <div className="text-[var(--color-primary-100)]">T</div>
        <div className="text-[var(--color-primary-100)]">W</div>
        <div className="text-[var(--color-primary-100)]">T</div>
        <div className="text-[var(--color-primary-100)]">F</div>
        <div className="text-[var(--color-primary-100)]">S</div>
        <div className="text-[var(--color-primary-100)]">S</div>

        {penandaTanggal[0] ? (
          <div className="py-1 bg-primary-800 rounded-sm text-gray-500">30</div>
        ) : (
          <div className="py-1 text-gray-500">30</div>
        )}
        {penandaTanggal[1] ? (
          <div className="py-1 bg-primary-800 rounded-sm">1</div>
        ) : (
          <div className="py-1">1</div>
        )}
        {penandaTanggal[2] ? (
          <div className="py-1 bg-primary-800 rounded-sm">2</div>
        ) : (
          <div className="py-1">2</div>
        )}
        {penandaTanggal[3] ? (
          <div className="py-1 bg-primary-800 rounded-sm">3</div>
        ) : (
          <div className="py-1">3</div>
        )}
        {penandaTanggal[4] ? (
          <div className="py-1 bg-primary-800 rounded-sm">4</div>
        ) : (
          <div className="py-1">4</div>
        )}
        {penandaTanggal[5] ? (
          <div className="py-1 bg-primary-800 rounded-sm">5</div>
        ) : (
          <div className="py-1">5</div>
        )}
        {penandaTanggal[6] ? (
          <div className="py-1 bg-primary-800 rounded-sm">6</div>
        ) : (
          <div className="py-1">6</div>
        )}

        {penandaTanggal[7] ? (
          <div className="py-1 bg-primary-800 rounded-sm">7</div>
        ) : (
          <div className="py-1">7</div>
        )}
        {penandaTanggal[8] ? (
          <div className="py-1 bg-primary-800 rounded-sm">8</div>
        ) : (
          <div className="py-1">8</div>
        )}
        {penandaTanggal[9] ? (
          <div className="py-1 bg-primary-800 rounded-sm">9</div>
        ) : (
          <div className="py-1">9</div>
        )}
        {penandaTanggal[10] ? (
          <div className="py-1 bg-primary-800 rounded-sm">10</div>
        ) : (
          <div className="py-1">10</div>
        )}
        {penandaTanggal[11] ? (
          <div className="py-1 bg-primary-800 rounded-sm">11</div>
        ) : (
          <div className="py-1">11</div>
        )}
        {penandaTanggal[12] ? (
          <div className="py-1 bg-primary-800 rounded-sm">12</div>
        ) : (
          <div className="py-1">12</div>
        )}
        {penandaTanggal[13] ? (
          <div className="py-1 bg-primary-800 rounded-sm">13</div>
        ) : (
          <div className="py-1">13</div>
        )}

        {penandaTanggal[14] ? (
          <div className="py-1 bg-primary-800 rounded-sm">14</div>
        ) : (
          <div className="py-1">14</div>
        )}
        {penandaTanggal[15] ? (
          <div className="py-1 bg-primary-800 rounded-sm">15</div>
        ) : (
          <div className="py-1">15</div>
        )}
        {penandaTanggal[16] ? (
          <div className="py-1 bg-primary-800 rounded-sm">16</div>
        ) : (
          <div className="py-1">16</div>
        )}
        {penandaTanggal[17] ? (
          <div className="py-1 bg-primary-800 rounded-sm">17</div>
        ) : (
          <div className="py-1">17</div>
        )}
        {penandaTanggal[18] ? (
          <div className="py-1 bg-primary-800 rounded-sm">18</div>
        ) : (
          <div className="py-1">18</div>
        )}
        {penandaTanggal[19] ? (
          <div className="py-1 bg-primary-800 rounded-sm">19</div>
        ) : (
          <div className="py-1">19</div>
        )}
        {penandaTanggal[20] ? (
          <div className="py-1 bg-primary-800 rounded-sm">20</div>
        ) : (
          <div className="py-1">20</div>
        )}

        {penandaTanggal[21] ? (
          <div className="py-1 bg-primary-800 rounded-sm">21</div>
        ) : (
          <div className="py-1">21</div>
        )}
        {penandaTanggal[22] ? (
          <div className="py-1 bg-primary-800 rounded-sm">22</div>
        ) : (
          <div className="py-1">22</div>
        )}
        {penandaTanggal[23] ? (
          <div className="py-1 bg-primary-800 rounded-sm">23</div>
        ) : (
          <div className="py-1">23</div>
        )}
        {penandaTanggal[24] ? (
          <div className="py-1 bg-primary-800 rounded-sm">24</div>
        ) : (
          <div className="py-1">24</div>
        )}
        {penandaTanggal[25] ? (
          <div className="py-1 bg-primary-800 rounded-sm">25</div>
        ) : (
          <div className="py-1">25</div>
        )}
        {penandaTanggal[26] ? (
          <div className="py-1 bg-primary-800 rounded-sm">26</div>
        ) : (
          <div className="py-1">26</div>
        )}
        {penandaTanggal[27] ? (
          <div className="py-1 bg-primary-800 rounded-sm">27</div>
        ) : (
          <div className="py-1">27</div>
        )}

        {penandaTanggal[28] ? (
          <div className="py-1 bg-primary-800 rounded-sm">28</div>
        ) : (
          <div className="py-1">28</div>
        )}
        {penandaTanggal[29] ? (
          <div className="py-1 bg-primary-800 rounded-sm">29</div>
        ) : (
          <div className="py-1">29</div>
        )}
        {penandaTanggal[30] ? (
          <div className="py-1 bg-primary-800 rounded-sm">30</div>
        ) : (
          <div className="py-1">30</div>
        )}
        {penandaTanggal[31] ? (
          <div className="py-1 bg-primary-800 rounded-sm">31</div>
        ) : (
          <div className="py-1">31</div>
        )}
        {penandaTanggal[32] ? (
          <div className="py-1 bg-primary-800 rounded-sm text-gray-500">1</div>
        ) : (
          <div className="py-1 text-gray-500">1</div>
        )}
        {penandaTanggal[33] ? (
          <div className="py-1 bg-primary-800 rounded-sm text-gray-500">2</div>
        ) : (
          <div className="py-1 text-gray-500">2</div>
        )}
        {penandaTanggal[34] ? (
          <div className="py-1 bg-primary-800 rounded-sm text-gray-500">3</div>
        ) : (
          <div className="py-1 text-gray-500">3</div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
