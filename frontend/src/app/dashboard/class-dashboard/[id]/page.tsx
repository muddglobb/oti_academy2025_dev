import React from "react";
import ClassCapacity from "@/components/dashboard/class-capacity";
import ClassInfo from "@/components/dashboard/class-info";
import VideoTeaser from "@/components/dashboard/video-teaser";
import TeacherCard from "@/components/dashboard/teacher-card";

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
    "Web Development",
    "Dhimas Putra",
    "6 Sesi",
    "HTML, CSS, JavaScript",
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
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
  },
  {
    slug: "web-development+software-engineering",
    title: "Web Development + Software Engineering",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
  },
  {
    slug: "software-engineering",
    title: "Software Engineering",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
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
  return (
    <div className="bg-neutral-900 flex flex-col justify-center items-center gap-4 my-4">
      <ClassCapacity
        ClassName={classData.title}
        ClassDesc={classData.desc}
      ></ClassCapacity>
      <div className="flex flex-row gap-6 justify-center">
        <ClassInfo classInfo={classInfo}></ClassInfo>
        <VideoTeaser />
      </div>
      <TeacherCard teacherCard={teacherCard} />
    </div>
  );
}
