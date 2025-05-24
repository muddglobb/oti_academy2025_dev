import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchPackage } from "@/lib/package/fetch-package";
import Konfirmasi from "@/components/payment/konfirmasi";
import ChosenClass from "@/components/payment/chosen-class";
import Receipt from "@/components/payment/receipt";
import { BuktiPembayaran } from "@/components/payment/bukti-pembayaran";
import PaymentPopUp from "@/components/payment/payment-popup";
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
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[0]],
    teacherCard: [teacherCard[0]],
    ClassLevel: "ENTRY",
  },
  {
    slug: "software-engineering",
    title: "Software Engineering",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "data-science&artificial-intelligence",
    title: "Data Science & Artificial Intelligence",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "ui-ux",
    title: "UI/UX",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "basic-python",
    title: "Basic Python",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "ENTRY",
  },
  {
    slug: "competitive-programming",
    title: "Competitive Programming",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "game-development",
    title: "Game Development",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "ENTRY",
  },
  {
    slug: "fundamental-cyber-security",
    title: "Fundamental Cyber Security",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "INTERMEDIATE",
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius, obcaecati? Facere quidem tempora sit debitis modi dolore natus, aut non labore voluptatum reprehenderit, consectetur repellendus earum incidunt numquam ipsam quia.",
    classInfo: [classInfo[1]],
    teacherCard: [teacherCard[1]],
    ClassLevel: "ENTRY",
  },
  {
    slug: "web-development+software-engineering",
    title: "Bundle Web Development + Software Engineering",
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

  const packages = await fetchPackage();
  // console.log(packages);

  let matchingCourse = null;
  let matchedCourseId = null;
  let matchedPackageId = null;
  let prices = null;
  if (classData?.ClassLevel !== "BUNDLE") {
    matchingCourse = packages
      .filter((item: any) => item.type !== "BUNDLE")
      .flatMap((item: any) =>
        item.courses.map((course: any) => ({
          courseId: course.courseId,
          packageId: course.packageId,
          title: course.title,
        }))
      )
      .find((course) => course.title === classData?.title);

    matchedCourseId = matchingCourse?.courseId;
    matchedPackageId = matchingCourse?.packageId;

    const matchPrices = packages.filter(
      (item: any) => item.type === classData?.ClassLevel
    );

    prices = matchPrices[0]?.price;
  } else {
    matchingCourse = packages.filter(
      (item: any) => item.name === classData?.title
    );

    // console.log(matchingCourse);
    matchedPackageId = matchingCourse[0]?.id;
    prices = matchingCourse[0]?.price;
  }

  return (
    <div className="text-white py-10 px-14 flex flex-col gap-4">
      <Link
        href="/dashboard/class-dashboard"
        className="flex gap-2 bg-primary-900 text-sm font-bold px-3.5 py-2 rounded-[8px] w-fit self-start"
      >
        <ArrowLeft size={20} color="white" />
        <p className="text-white">Kembali</p>
      </Link>
      
      <PaymentPopUp />

      <div className="flex gap-6">
        <div className="flex flex-col gap-6">
          <Konfirmasi />
          <ChosenClass
            courseId={matchedCourseId}
            packageId={matchedPackageId}
          />
        </div>
        <div className="w-2/5 flex flex-col gap-6">
          <Receipt name={classData?.title} prices={prices} level={classData?.ClassLevel}/>
          <BuktiPembayaran courseId={matchedCourseId} packageId={matchedPackageId}/>
        </div>
      </div>
    </div>
  );
}
