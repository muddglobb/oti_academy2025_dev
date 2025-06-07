import ClassCapacity from "@/components/dashboard/class-capacity";
import ClassInfo from "@/components/dashboard/class-info";
import VideoTeaser from "@/components/dashboard/video-teaser";
import TeacherCard from "@/components/dashboard/teacher-card";
import Prerequisites from "@/components/dashboard/prerequisites";
import SessionInfo from "@/components/dashboard/session-info";
import MobileBottomBar from "@/components/dashboard/mobile-bottombar";
import Link from "next/link";
import { cookies } from "next/headers";

import { ArrowLeft } from "lucide-react";

type CourseStat = {
  id: string;
  title: string;
  level: string;
  quota: {
    total: number;
    entryQuota: number;
    bundleQuota: number;
  };
  enrollment: {
    total: number;
    entryIntermediateCount: number;
    bundleCount: number;
  };
  remaining: {
    entryIntermediate: number;
    bundle: number;
  };
};

type Enroll = {
  status: string;
  message: string;
  data: {
    isEnrolled: boolean;
  };
};

const classes = [
  {
    slug: "web-development",
    title: "Web Development",
    courses: ["Web Development"],
    desc: "Learn HTML, CSS, and JavaScript to build responsive websites from scratch.",
    ClassLevel: "ENTRY",
  },
  {
    slug: "software-engineering",
    title: "Software Engineering",
    courses: ["Software Engineering"],
    desc: "Learn professional software development practices including version control, testing, and CI/CD pipelines.",
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "data-science&artificial-intelligence",
    title: "Data Science & Artificial Intelligence",
    courses: ["Data Science & Artificial Intelligence"],
    desc: "Explore data analysis, machine learning, and artificial intelligence techniques.",
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "ui-ux",
    title: "UI/UX",
    courses: ["UI/UX"],
    desc: "User interface and experience design principles, tools, and methodologies.",
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    courses: ["Cyber Security"],
    desc: "Advanced security concepts including penetration testing and security architecture.",
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "basic-python",
    title: "Basic Python",
    courses: ["Basic Python"],
    desc: "Introduction to Python programming language, syntax, and basic applications.",
    ClassLevel: "ENTRY",
  },
  {
    slug: "competitive-programming",
    title: "Competitive Programming",
    courses: ["Competitive Programming"],
    desc: "Learn algorithms and data structures for competitive programming contests.",
    ClassLevel: "ENTRY",
  },

  {
    slug: "game-development",
    title: "Game Development",
    courses: ["Game Development"],
    desc: "Introduction to game development concepts, engines, and basic implementation.",
    ClassLevel: "ENTRY",
  },
  {
    slug: "fundamental-cyber-security",
    title: "Fundamental Cyber Security",
    courses: ["Fundamental Cyber Security"],
    desc: "Learn the basics of cybersecurity, including threat identification and security principles.",
    ClassLevel: "ENTRY",
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    courses: ["Graphic Design"],
    desc: "Master the basics of Graphic Design including color theory, typography, and composition.",
    ClassLevel: "ENTRY",
  },
  {
    slug: "web-development+software-engineering",
    title: "Bundle Web Development + Software Engineering",
    courses: ["Web Development", "Software Engineering"],
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    ClassLevel: "BUNDLE",
  },
  {
    slug: "python+data-science&artificial-intelligence",
    title: "Python + Data Science & Artificial Intelligence",
    courses: ["Basic Python", "Data Science & Artificial Intelligence"],
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    ClassLevel: "BUNDLE",
  },
  {
    slug: "graphic-design+ui-ux",
    title: "Graphic Design + UI/UX",
    courses: ["Graphic Design", "UI/UX"],
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    ClassLevel: "BUNDLE",
  },
  {
    slug: "fundamental-cyber-security+cyber-security",
    title: "Fundamental Cyber Security + Cyber Security",
    courses: ["Fundamental Cyber Security", "Cyber Security"],
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    ClassLevel: "BUNDLE",
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = decodeURIComponent((await params).id);
  const classData = classes.find((classItem) => classItem.slug === id);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!classData) {
    return (
      <div className="bg-neutral-900 text-white text-center py-20">
        <h1 className="text-4xl font-bold">404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    );
  }

  const res = await fetch(`${process.env.BASE_URL}/courses`, {
    cache: "no-store",
  });

  const courseData = await res.json();

  let courseID = "";
  let courseID2 = "";

  const findCourseID = Array.isArray(courseData.data)
    ? (courseData.data as CourseStat[]).find(
        (course) => course.title === classData.courses[0]
      )
    : undefined;

  courseID = findCourseID ? findCourseID.id : "";

  if (classData.ClassLevel === "BUNDLE") {
    const findCourseID = Array.isArray(courseData.data)
      ? (courseData.data as CourseStat[]).find(
          (course) => course.title === classData.courses[1]
        )
      : undefined;

    courseID2 = findCourseID ? findCourseID.id : "";
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

  const enrollRes = await getEnroll(courseID);
  const enrollData = await enrollRes.json();

  let enroll: Enroll[] = Array.isArray(enrollData.data) ? enrollData.data : [];

  const isEnrolled = enrollData.data?.isEnrolled;

  return (
    <>
      <div className="flex flex-col gap-4 py-10 px-2 lg:px-14 bg-neutral-900">
        <Link
          href="/dashboard/class-dashboard"
          className="flex gap-2 bg-primary-900 text-sm font-bold px-3.5 py-2 rounded-[8px] w-fit self-start"
        >
          <ArrowLeft size={20} color="white" />
          <p className="text-white">Kembali</p>
        </Link>

        <div className="hidden xl:block">
          {classData.ClassLevel === "BUNDLE" &&
            classData.title !== "Graphic Design + UI/UX" && (
              <div className="flex flex-col gap-6">
                <ClassCapacity
                  ClassName={classData.title}
                  ClassDesc={classData.desc}
                  ClassLevel={classData.ClassLevel}
                  CourseID={courseID}
                  ClassSlug={classData.slug}
                />
                <div className="flex flex-row gap-6 w-full">
                  <div className="w-1/2">
                    <ClassInfo courseTitle={classData.title} />
                  </div>
                  <div className="w-1/2">
                    <VideoTeaser slug={classData.slug} />
                  </div>
                </div>
                <TeacherCard courseTitle={classData.courses[1]} />
                <SessionInfo
                  courseID1={courseID}
                  courseID2={courseID2}
                  courseTitle1={classData.courses[0]}
                  courseTitle2={classData.courses[1]}
                />
              </div>
            )}
          {classData.title === "Graphic Design + UI/UX" && (
            <div className="flex flex-col gap-6">
              <ClassCapacity
                ClassName={classData.title}
                ClassDesc={classData.desc}
                ClassLevel={classData.ClassLevel}
                CourseID={courseID}
                ClassSlug={classData.slug}
              />
              <div className="flex flex-row gap-6 w-full">
                <div className="flex flex-col w-1/2 gap-3">
                  <ClassInfo courseTitle={classData.title} />
                  <TeacherCard courseTitle="Mentor" />
                </div>
                <div className="w-1/2">
                  <VideoTeaser slug={classData.slug} />
                </div>
              </div>
              <TeacherCard courseTitle={classData.courses[1]} />
              <SessionInfo
                courseID1={courseID}
                courseID2={courseID2}
                courseTitle1={classData.courses[0]}
                courseTitle2={classData.courses[1]}
              />
            </div>
          )}
          {classData.ClassLevel === "ENTRY" && (
            <div className="flex flex-col gap-6">
              <ClassCapacity
                ClassName={classData.title}
                ClassDesc={classData.desc}
                ClassLevel={classData.ClassLevel}
                CourseID={courseID}
                ClassSlug={classData.slug}
              />
              <div className="flex flex-row gap-6 items-stretch">
                <div className="w-1/2 flex flex-col gap-3">
                  <ClassInfo courseTitle={classData.title} />
                  <TeacherCard courseTitle={classData.courses[0]} />
                </div>
                <div className="w-1/2">
                  <VideoTeaser slug={classData.slug} />
                </div>
              </div>

              <SessionInfo
                courseID1={courseID}
                courseTitle1={classData.courses[0]}
                courseTitle2={classData.courses[1]}
              />
            </div>
          )}
          {classData.ClassLevel === "INTERMEDIATE" && (
            <div className="flex flex-col gap-6">
              <ClassCapacity
                ClassName={classData.title}
                ClassDesc={classData.desc}
                ClassLevel={classData.ClassLevel}
                CourseID={courseID}
                ClassSlug={classData.slug}
              />
              <div className="flex flex-row gap-6 items-stretch">
                <div className="w-1/2 flex flex-col gap-3">
                  <ClassInfo courseTitle={classData.title} />
                  <Prerequisites />
                </div>
                <div className="w-1/2">
                  <VideoTeaser slug={classData.slug} />
                </div>
              </div>
              <TeacherCard courseTitle={classData.courses[0]} />
              <SessionInfo
                courseID1={courseID}
                courseTitle1={classData.courses[0]}
                courseTitle2={classData.courses[1]}
              />
            </div>
          )}
        </div>

        <div className="xl:hidden flex flex-col gap-6">
          <ClassCapacity
            ClassName={classData.title}
            ClassDesc={classData.desc}
            ClassLevel={classData.ClassLevel}
            CourseID={courseID}
            ClassSlug={classData.slug}
          />
          <VideoTeaser slug={classData.slug} />
          <ClassInfo courseTitle={classData.title} />
          {classData.ClassLevel === "INTERMEDIATE" && <Prerequisites />}

          {classData.ClassLevel === "BUNDLE" && (
            <TeacherCard courseTitle={classData.courses[1]} />
          )}
          {classData.ClassLevel !== "BUNDLE" && (
            <TeacherCard courseTitle={classData.courses[0]} />
          )}

          {classData.ClassLevel === "BUNDLE" && (
            <SessionInfo
              courseID1={courseID}
              courseID2={courseID2}
              courseTitle1={classData.courses[0]}
              courseTitle2={classData.courses[1]}
            />
          )}
          {classData.ClassLevel !== "BUNDLE" && (
            <SessionInfo
              courseID1={courseID}
              courseTitle1={classData.courses[0]}
            />
          )}
        </div>
      </div>
      <div className="md:hidden sticky z-10 w-full bottom-0 ">
        {isEnrolled === false && (
          <MobileBottomBar
            CourseID={courseID}
            ClassLevel={classData.ClassLevel}
            ClassSlug={classData.slug}
          />
        )}
      </div>
    </>
  );
}
