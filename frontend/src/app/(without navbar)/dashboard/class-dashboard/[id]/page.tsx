import ClassCapacity from "@/components/dashboard/class-capacity";
import ClassInfo from "@/components/dashboard/class-info";
import VideoTeaser from "@/components/dashboard/video-teaser";
import TeacherCard from "@/components/dashboard/teacher-card";
import Prerequisites from "@/components/dashboard/prerequisites";
import SessionInfo from "@/components/dashboard/session-info";
import MobileBottomBar from "@/components/dashboard/mobile-bottombar";
import AccessAlert from "@/components/dashboard/access-alert";
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
    desc: "Belajar membuat UI dari nol, mulai dari HTML, CSS, React, hingga Tailwind & MUI. Cocok untuk pemula yang ingin membangun halaman web responsif, memahami dasar komponen React, dan eksplorasi styling modern.",
    ClassLevel: "ENTRY",
  },
  {
    slug: "software-engineering",
    title: "Software Engineering",
    courses: ["Software Engineering"],
    desc: "Kuasai pembuatan aplikasi web modern lengkap dari autentikasi hingga fitur CRUD lewat praktik langsung dan studi kasus nyata. Jadi developer full-stack handal dengan pengalaman yang keren.",
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "data-science&artificial-intelligence",
    title: "Data Science & Artificial Intelligence",
    courses: ["Data Science & Artificial Intelligence"],
    desc: "Belajar Data Science dan AI dari nol hingga siap ikut proyek dan kompetisi. DSAI Bootcamp membimbingmu step-by-step dari dasar hingga membangun model AI siap industri.",
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "ui-ux",
    title: "UI/UX",
    courses: ["UI/UX"],
    desc: "Mulai dari mengubah PRD jadi desain, membuat mock-up, wireframe, hingga memahami UX laws dan desain yang aksesibel. Belajar secara fleksibel lewat modul online, tugas, konsultasi, dan proyek akhir yang bisa jadi portofolio.",
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    courses: ["Cyber Security"],
    desc: "Masuki dunia ethical hacking dan praktik langsung tahapan penetration testing, dari reconnaissance hingga post-exploitation, lengkap dengan penyusunan laporan uji keamanan secara profesional.",
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "basic-python",
    title: "Basic Python",
    courses: ["Basic Python"],
    desc: "Pelajari dasar-dasar pemrograman Python, mulai dari sintaks dasar hingga OOP dan struktur data. Materi disusun secara bertahap dan mudah diikuti cocok untuk pemula dengan studi kasus menarik.",
    ClassLevel: "ENTRY",
  },
  {
    slug: "competitive-programming",
    title: "Competitive Programming",
    courses: ["Competitive Programming"],
    desc: "Mengenali dasar-dasar Competitive Programming secara bertahap mulai dari algoritma, struktur data, hingga graf. Dirancang ringkas dan menantang, cocok untuk pemula dan ditutup dengan konteks sebagai tugas akhir.",
    ClassLevel: "ENTRY",
  },

  {
    slug: "game-development",
    title: "Game Development",
    courses: ["Game Development"],
    desc: "Menjelajahi dunia game development dari merancang ide, Game Design Document (GDD), hingga membangun prototype game dengan GDevelop. Materi lengkap dan mudah diikuti, cocok untuk pemula.",
    ClassLevel: "ENTRY",
  },
  {
    slug: "fundamental-cyber-security",
    title: "Fundamental Cyber Security",
    courses: ["Fundamental Cyber Security"],
    desc: "Masuki dunia cybersecurity dengan materi praktis dan menyenangkan, mulai dari Linux, forensik, web exploitation, kriptografi, hingga OSINT. Ditutup dengan praktik langsung lewat picoCTF. Materi ringkas dan mudah dipahami, cocok untuk pemula.",
    ClassLevel: "ENTRY",
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    courses: ["Graphic Design"],
    desc: "Belajar dasar desain grafis mulai dari elemen visual, warna, hingga layout. Lewat studi kasus dan praktik di Figma, kamu akan buat berbagai konten secara terarah dan bermakna.",
    ClassLevel: "ENTRY",
  },
  {
    slug: "web-development+software-engineering",
    title: "Web Development + Software Engineering",
    courses: ["Web Development", "Software Engineering"],
    desc: "Kuasai pembuatan UI dan aplikasi web modern dari basic hingga intermediate dengan React, Tailwind, dan MUI. Praktik langsung buat halaman responsif, autentikasi, dan fitur CRUD.",
    ClassLevel: "BUNDLE",
  },
  {
    slug: "python+data-science&artificial-intelligence",
    title: "Python + Data Science & Artificial Intelligence",
    courses: ["Basic Python", "Data Science & Artificial Intelligence"],
    desc: "Kuasai Python, Data Science & AI dari nol hingga siap terjun ke industri. Pelajari sintaks dasar, OOP, hingga bangun model AI melalui studi kasus nyata dan bimbingan langsung untuk proyek dan kompetisi.",
    ClassLevel: "BUNDLE",
  },
  {
    slug: "graphic-design+ui-ux",
    title: "Graphic Design + UI/UX",
    courses: ["Graphic Design", "UI/UX"],
    desc: "Belajar desain dari basic hingga intermediate mulai dari elemen visual, warna, layout, hingga UX, wireframe, dan desain aksesibel. Praktik langsung di Figma, ubah PRD jadi desain, dan bangun portofolio lewat proyek akhir.",
    ClassLevel: "BUNDLE",
  },
  {
    slug: "fundamental-cyber-security+cyber-security",
    title: "Fundamental Cyber Security + Cyber Security",
    courses: ["Fundamental Cyber Security", "Cyber Security"],
    desc: "Belajar cybersecurity dan ethical hacking dari basic hingga intermediate, mulai dari OSINT, forensik, web exploit, hingga penetration testing dan pembuatan laporan profesional.",
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

  const resApi = await fetch(
    `${process.env.BASE_URL}/payments/${courseID}/stats`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const apiData = await resApi.json();

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

  const enrollRes1 = await getEnroll(courseID);
  const enrollData1 = await enrollRes1.json();

  let enrollRes2, enrollData2;

  if (courseID2 && courseID2 !== courseID) {
    enrollRes2 = await getEnroll(courseID2);
    enrollData2 = await enrollRes2.json();
  }

  const isEnrolled1 = enrollData1.data?.isEnrolled;
  const isEnrolled2 = enrollData2?.data?.isEnrolled;

  // let enroll: Enroll[] = Array.isArray(enrollData.data) ? enrollData.data : [];

  const isEnrolled = enrollData.data?.isEnrolled;

  async function getPaymentStatus() {
    const res = await fetch(`${process.env.BASE_URL}/payments/my-payments`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res;
  }

  const paymentRes = await getPaymentStatus();
  const paymentData = await paymentRes.json();

  const paymentStatus =
    Array.isArray(paymentData.data) && paymentData.data.length > 0
      ? paymentData.data[0].status
      : undefined;

  const paymentDataLength = Array.isArray(paymentData.data)
    ? paymentData.data.length
    : 0;

  const enrolledClassType =
    Array.isArray(paymentData.data) && paymentData.data.length > 0
      ? paymentData.data[0].packageType
      : "";

  async function getSelfEnroll() {
    const selfEnrollRes = await fetch(
      `${process.env.BASE_URL}/enrollments/me`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return selfEnrollRes;
  }

  const selfEnrollRes = await getSelfEnroll();
  const selfEnrollData = await selfEnrollRes.json();
  const enrollmentCount = selfEnrollData.data?.length;

  const currentCount =
    classData.ClassLevel === "ENTRY"
      ? apiData.data?.enrollments?.entryIntermediateCount ?? 0
      : classData.ClassLevel === "INTERMEDIATE"
      ? apiData.data?.enrollments?.entryIntermediateCount ?? 0
      : classData.ClassLevel === "BUNDLE"
      ? apiData.data?.enrollments?.bundleCount ?? 0
      : 0;
  const capacity =
    classData.ClassLevel === "ENTRY"
      ? apiData.data?.quota?.entryIntermediateQuota ?? 1
      : classData.ClassLevel === "INTERMEDIATE"
      ? apiData.data?.quota?.entryIntermediateQuota ?? 1
      : classData.ClassLevel === "BUNDLE"
      ? apiData.data?.quota?.bundleQuota ?? 1
      : 0;

  const now = new Date();
  const targetDate = new Date("2025-06-29T00:00:00");
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
                  Courses1={classData.courses[0]}
                  Courses2={classData.courses[1]}
                  ClassSlug={classData.slug}
                />
                <div className="flex flex-row gap-6 w-full">
                  <div className="w-1/2">
                    <ClassInfo courseTitle={classData.title} />
                  </div>
                  <div className="w-1/2">
                    <VideoTeaser
                      slug={classData.slug}
                      title={classData.title}
                    />
                  </div>
                </div>
                <Prerequisites courseTitle={classData.title} />
                <TeacherCard courseTitle={classData.courses[1]} />
                <SessionInfo
                  courseID1={courseID}
                  courseID2={courseID2}
                  courseTitle1={classData.courses[0]}
                  courseTitle2={classData.courses[1]}
                  ClassLevel={classData.ClassLevel}
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
                Courses1={classData.courses[0]}
                Courses2={classData.courses[1]}
                ClassSlug={classData.slug}
              />
              <div className="flex flex-row gap-6 w-full">
                <div className="w-1/2">
                  <ClassInfo courseTitle={classData.title} />
                </div>
                <div className="w-1/2">
                  <VideoTeaser slug={classData.slug} title={classData.title} />
                </div>
              </div>
              <div className="flex flex-row gap-6 items-stretch">
                <div className="flex-1">
                  <TeacherCard courseTitle="Mentor Card" />
                </div>
                <div className="flex-1">
                  <Prerequisites courseTitle={classData.title} />
                </div>
              </div>
              <TeacherCard courseTitle={classData.title} />
              <SessionInfo
                courseID1={courseID}
                courseID2={courseID2}
                courseTitle1={classData.courses[0]}
                courseTitle2={classData.courses[1]}
                ClassLevel={classData.ClassLevel}
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
                Courses1={classData.courses[0]}
              />
              <div className="flex flex-row gap-6 items-stretch">
                <div className="w-1/2 flex flex-col gap-3">
                  <ClassInfo courseTitle={classData.title} />
                  <TeacherCard courseTitle={classData.courses[0]} />
                </div>
                <div className="flex flex-col gap-3 w-1/2">
                  <VideoTeaser slug={classData.slug} title={classData.title} />
                  <Prerequisites courseTitle={classData.title} />
                </div>
              </div>

              <SessionInfo
                courseID1={courseID}
                courseTitle1={classData.courses[0]}
                courseTitle2={classData.courses[1]}
                ClassLevel={classData.ClassLevel}
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
                Courses1={classData.courses[0]}
              />
              <div className="flex flex-row gap-6 items-stretch">
                <div className="w-1/2">
                  <ClassInfo courseTitle={classData.title} />
                </div>
                <div className="w-1/2">
                  <VideoTeaser slug={classData.slug} title={classData.title} />
                </div>
              </div>
              <Prerequisites courseTitle={classData.title} />
              <TeacherCard courseTitle={classData.courses[0]} />
              <SessionInfo
                courseID1={courseID}
                courseTitle1={classData.courses[0]}
                courseTitle2={classData.courses[1]}
                ClassLevel={classData.ClassLevel}
              />
            </div>
          )}
        </div>

        <div className="xl:hidden flex flex-col gap-6">
          {classData.ClassLevel === "BUNDLE" && (
            <ClassCapacity
              ClassName={classData.title}
              ClassDesc={classData.desc}
              ClassLevel={classData.ClassLevel}
              CourseID={courseID}
              Courses1={classData.courses[0]}
              Courses2={classData.courses[1]}
              ClassSlug={classData.slug}
            />
          )}
          {classData.ClassLevel !== "BUNDLE" && (
            <ClassCapacity
              ClassName={classData.title}
              ClassDesc={classData.desc}
              ClassLevel={classData.ClassLevel}
              CourseID={courseID}
              Courses1={classData.courses[0]}
              ClassSlug={classData.slug}
            />
          )}

          <VideoTeaser slug={classData.slug} title={classData.title} />
          <ClassInfo courseTitle={classData.title} />
          <Prerequisites courseTitle={classData.title} />
          {classData.title === "Graphic Design + UI/UX" && (
            <TeacherCard courseTitle="Mentor Card" />
          )}
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
              ClassLevel={classData.ClassLevel}
            />
          )}
          {classData.ClassLevel !== "BUNDLE" && (
            <SessionInfo
              courseID1={courseID}
              courseTitle1={classData.courses[0]}
              ClassLevel={classData.ClassLevel}
            />
          )}
        </div>
        {((classData.ClassLevel === "BUNDLE" &&
          isEnrolled1 === true &&
          isEnrolled2 === true &&
          paymentStatus === "APPROVED") ||
          (classData.ClassLevel !== "BUNDLE" &&
            (isEnrolled1 === true || isEnrolled2 === true) &&
            paymentStatus === "APPROVED")) && (
          <div className="z-10 fixed bottom-4 md:bottom-6 max-md:left-1/2 transform max-md:-translate-x-1/2 md:right-5 w-80 md:w-106">
            <AccessAlert />
          </div>
        )}
      </div>
      <div className="md:hidden sticky z-10 w-full bottom-0 ">
        {classData.ClassLevel !== "INTERMEDIATE" && <p></p>}
        {classData.ClassLevel === "INTERMEDIATE" &&
          isEnrolled === false &&
          enrolledClassType !== "BUNDLE" &&
          currentCount <= capacity &&
          paymentDataLength < 2 &&
          enrollmentCount < 2 &&
          enrolledClassType !== classData.ClassLevel && (
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
