import ClassCapacity from "@/components/dashboard/class-capacity";
import ClassInfo from "@/components/dashboard/class-info";
import VideoTeaser from "@/components/dashboard/video-teaser";
import TeacherCard from "@/components/dashboard/teacher-card";
import Prerequisites from "@/components/dashboard/prerequisites";
import SessionInfo from "@/components/dashboard/session-info";
import MobileBottomBar from "@/components/dashboard/mobile-bottombar";
import Link from "next/link";

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

const classInfo: [
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
][] = [
  [
    "Web Development",
    "Dhimas Putra",
    "6 Sesi",
    "",
    "",
    "Beginner",
    "",
    "2 Jam/Sesi",
    "1 - 15 Juni 2025",
    "10 Modul",
  ],
  [
    "Software Engineering",
    "Kevin Antonio | Mentor",
    "6 Sesi",
    "Prerequisites",
    "1 - 15 Juni 2025",
    "",
    "Dhimas Putra | Teaching Assistant",
    "2 Jam/Sesi",
    "1 - 15 Juni 2025",
    "10 Modul",
  ],
  [
    "Software Engineering",
    "Dhimas Putra",
    "6 Sesi",
    "Prerequisites included di Entry",
    "",
    "Beginner",
    "Kevin Antonio",
    "2 Jam/Sesi",
    "1 - 15 Juni 2025",
    "10 Modul",
  ],
];

const teacherCard: [string, string, string, string, string][] = [
  [
    "Kevin Antonio",
    "Mentor",
    "/person-placeholder.jpeg",
    "https://www.linkedin.com/in/kevinantonio/",
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et, provident? Repudiandae repellat itaque aliquam accusantium. Qui vitae tenetur beatae hic quisquam eligendi molestiae minus nostrum, culpa, quam iusto dolor reprehenderit.",
  ],
  [
    "Dhimas Putra",
    "Teaching Assistant",
    "/person-placeholder.jpeg",
    "https://www.linkedin.com/in/dhimasputra/",
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et, provident? Repudiandae repellat itaque aliquam accusantium. Qui vitae tenetur beatae hic quisquam eligendi molestiae minus nostrum, culpa, quam iusto dolor reprehenderit.",
  ],
];

const classes = [
  {
    slug: "web-development",
    title: "Web Development",
    courses: ["Web Development"],
    desc: "Learn HTML, CSS, and JavaScript to build responsive websites from scratch.",
    classInfo: [classInfo[0]],
    teacherCard: [teacherCard[0]],
    ClassLevel: "ENTRY",
  },
  {
    slug: "software-engineering",
    title: "Software Engineering",
    courses: ["Software Engineering"],
    desc: "Learn professional software development practices including version control, testing, and CI/CD pipelines.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[0], teacherCard[1]],
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "data-science&artificial-intelligence",
    title: "Data Science & Artificial Intelligence",
    courses: ["Data Science & Artificial Intelligence"],
    desc: "Explore data analysis, machine learning, and artificial intelligence techniques.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "ui-ux",
    title: "UI/UX",
    courses: ["UI/UX"],
    desc: "User interface and experience design principles, tools, and methodologies.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[0], teacherCard[1]],
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    courses: ["Cyber Security"],
    desc: "Advanced security concepts including penetration testing and security architecture.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[0], teacherCard[1]],
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "basic-python",
    title: "Basic Python",
    courses: ["Basic Python"],
    desc: "Introduction to Python programming language, syntax, and basic applications.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "ENTRY",
  },
  {
    slug: "competitive-programming",
    title: "Competitive Programming",
    courses: ["Competitive Programming"],
    desc: "Learn algorithms and data structures for competitive programming contests.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "ENTRY",
  },

  {
    slug: "game-development",
    title: "Game Development",
    courses: ["Game Development"],
    desc: "Introduction to game development concepts, engines, and basic implementation.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "ENTRY",
  },
  {
    slug: "fundamental-cyber-security",
    title: "Fundamental Cyber Security",
    courses: ["Fundamental Cyber Security"],
    desc: "Learn the basics of cybersecurity, including threat identification and security principles.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "ENTRY",
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    courses: ["Graphic Design"],
    desc: "Master the basics of Graphic Design including color theory, typography, and composition.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "ENTRY",
  },
  {
    slug: "web-development+software-engineering",
    title: "Web Development + Software Engineering",
    courses: ["Web Development", "Software Engineering"],
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[0], classInfo[2]],
    teacherCard: [teacherCard[0], teacherCard[1]],
    ClassLevel: "BUNDLE",
  },
  {
    slug: "python+data-science&artificial-intelligence",
    title: "Bundle Python + Data Science & Artificial Intelligence",
    courses: ["Basic Python", "Data Science & Artificial Intelligence"],
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[0], classInfo[2]],
    teacherCard: [teacherCard[0], teacherCard[1]],
    ClassLevel: "BUNDLE",
  },
  {
    slug: "graphic-design+ui-ux",
    title: "Bundle Graphic Design + UI/UX",
    courses: ["Graphic Design", "UI/UX"],
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[0], classInfo[2]],
    teacherCard: [teacherCard[0], teacherCard[1]],
    ClassLevel: "BUNDLE",
  },
  {
    slug: "fundamental-cyber-security+cyber-security",
    title: "Bundle Fundamental Cyber Security + Cyber Security",
    courses: ["Fundamental Cyber Security", "Cyber Security"],
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[0], classInfo[2]],
    teacherCard: [teacherCard[0], teacherCard[1]],
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

  return (
    <>
      <div className="flex flex-col gap-4 py-10 px-4 lg:px-14 bg-neutral-900">
        <Link
          href="/dashboard/class-dashboard"
          className="flex gap-2 bg-primary-900 text-sm font-bold px-3.5 py-2 rounded-[8px] w-fit self-start"
        >
          <ArrowLeft size={20} color="white" />
          <p className="text-white">Kembali</p>
        </Link>

        <div className="hidden xl:block">
          {classData.ClassLevel === "BUNDLE" && (
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
                  <ClassInfo classInfo={classData.classInfo} />
                </div>
                <div className="w-1/2">
                  <VideoTeaser slug={classData.slug} />
                </div>
              </div>
              <TeacherCard teacherCard={classData.teacherCard} />
              <SessionInfo courseID1={courseID} courseID2={courseID2} />
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
                  <ClassInfo classInfo={classData.classInfo} />
                  <TeacherCard teacherCard={classData.teacherCard} />
                </div>
                <div className="w-1/2">
                  <VideoTeaser slug={classData.slug} />
                </div>
              </div>

              <SessionInfo courseID1={courseID} />
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
                  <ClassInfo classInfo={classData.classInfo} />
                  <Prerequisites />
                </div>
                <div className="w-1/2">
                  <VideoTeaser slug={classData.slug} />
                </div>
              </div>
              <TeacherCard teacherCard={classData.teacherCard} />
              <SessionInfo courseID1={courseID} />
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
          <ClassInfo classInfo={classData.classInfo} />
          {classData.ClassLevel === "INTERMEDIATE" && <Prerequisites />}

          <TeacherCard teacherCard={classData.teacherCard} />
          <SessionInfo courseID1={courseID} courseID2={courseID2} />
        </div>
      </div>
      <div className="md:hidden sticky z-10 w-full bottom-0 ">
        <MobileBottomBar
          CourseID={courseID}
          ClassLevel={classData.ClassLevel}
          ClassSlug={classData.slug}
        />
      </div>
    </>
  );
}
