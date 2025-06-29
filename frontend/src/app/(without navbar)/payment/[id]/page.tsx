import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchPackage, getPackageById } from "@/lib/package/fetch-package";
import Konfirmasi from "@/components/payment/konfirmasi";
import ChosenClass from "@/components/payment/chosen-class";
import Receipt from "@/components/payment/receipt";
import { BuktiPembayaran } from "@/components/payment/bukti-pembayaran";
import PaymentPopUp from "@/components/payment/payment-popup";
import { getMyPayments } from "@/lib/payment/fetch-payment";
import TolakPopUp from "@/components/payment/tolak-popup";
import { getCourseAvailabity } from "@/lib/enrollment/fetch-enrollment";
// type CourseStat = {
//   id: string;
//   title: string;
//   level: string;
//   quota: {
//     total: number;
//     entryQuota: number;
//     bundleQuota: number;
//   };
//   enrollment: {
//     total: number;
//     entryIntermediateCount: number;
//     bundleCount: number;
//   };
//   remaining: {
//     entryIntermediate: number;
//     bundle: number;
//   };
// };

export type Course = {
  packageId: string;
  courseId: string;
  title: string;
  description: string;
  level: "ENTRY" | "INTERMEDIATE" | "BUNDLE" | string; // tambahkan jika ada level lain
};

export type Package = {
  id: string;
  name: string;
  type: "ENTRY" | "INTERMEDIATE" | "BUNDLE" | string; // tambahkan jika ada type lain
  price: number;
  createdAt: string;
  updatedAt: string;
  courses: Course[];
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
    "https://www.linkedin.com/",
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
    teacherCard: [teacherCard[0], teacherCard[1]],
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
    title: "Bundle Web Development + Software Engineering",
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

  // const packages = await fetchPackage();
  const packages: Package[] = await fetchPackage();
  // console.dir("melinda: ", packages);

  let matchingCourse = null;
  let matchedCourseId = null;
  let matchedPackageId = null;
  let prices = null;
  if (classData?.ClassLevel !== "BUNDLE") {
    matchingCourse = packages
      .filter((item: Package) => item.type !== "BUNDLE")
      .flatMap((item: Package) =>
        item.courses.map((course: Course) => ({
          courseId: course.courseId,
          packageId: course.packageId,
          title: course.title,
        }))
      )
      .find((course) => course.title === classData?.title);

    matchedCourseId = matchingCourse?.courseId;
    matchedPackageId = matchingCourse?.packageId;

    const matchPrices = packages.filter(
      (item: Package) => item.type === classData?.ClassLevel
    );

    prices = matchPrices[0]?.price;
  } else {
    matchingCourse = packages.filter(
      (item: Package) => item.name === classData?.title
    );

    matchedPackageId = matchingCourse[0]?.id;
    prices = matchingCourse[0]?.price;
  }

  const payments = await getMyPayments();
  // console.log("meli", payments);
  // console.log("fefsd", payments[0].packageType);

  let checkBundle = "NO";
  let checkEntry = "NO";
  let checkIntermediate = "NO";

  if (payments[0]?.packageType == "BUNDLE") checkBundle = "YES";
  else {
    for (let i = 0; i < 2; i++) {
      if (payments[i]?.packageType == "ENTRY") checkEntry = "YES";
      else if (payments[i]?.packageType == "INTERMEDIATE")
        checkIntermediate = "YES";
    }
  }
  // console.log("course id: ", matchedCourseId);
  // const availability = await getCourseAvailabity(matchedCourseId ? matchedCourseId : "");
  // console.log("Availability: ", availability.available);
  // console.log("Availability: ", availability.available.entryIntermediateAvailable);
  // console.log(checkBundle, checkEntry, checkIntermediate);
  const noBundle = matchedCourseId && matchedPackageId ? "NO" : "YES";

  // console.log("fkoe", noBundle);
  // console.log(matchedPackageId);
  if (!matchedCourseId) {
    const packages = await getPackageById(matchedPackageId || "");
    // console.log("packages: ", packages.courses[0].courseId);
    matchedCourseId = packages.courses[0].courseId;
  }
  // console.log("matchedCourseId: ", matchedCourseId);
  const availability = await getCourseAvailabity(
    matchedCourseId ? matchedCourseId : ""
  );
  // console.log("Availability: ", availability.available.bundleAvailable);
  // console.log("Availability: ", availability.available.entryIntermediateAvailable);
  const availabilityzz = noBundle
    ? availability.available.entryIntermediateAvailable
    : availability.available.bundleAvailable;
  // console.log("availabilityzz: ", availabilityzz);

  // console.log("fjoef", matchedCourseId,)
  // console.log("akwoaw", matchedPackageId)

  if (availabilityzz <= 0 || classData?.ClassLevel == "BUNDLE" || classData?.ClassLevel == "ENTRY") {
    //penutupan daftar entry dan bundle (30 juni)
    return (
      <div className="text-white py-3 xl:py-10 px-4 xl:px-14 flex flex-col gap-4 items-center font-bold text-3xl">
        Pendaftaran Untuk Kelas Ini Sudah ditutup
      </div>
    );
  }
  return (
    <div className="text-neutral-50 py-3 xl:py-10 px-4 xl:px-14 flex flex-col gap-4">
      <Link
        href="/dashboard/class-dashboard"
        className="flex gap-2 bg-primary-900 text-sm font-bold px-3.5 py-2 rounded-[8px] w-fit self-start"
      >
        <ArrowLeft size={20} color="white" />
        <p className="text-white">Kembali</p>
      </Link>

      {/* <PaymentPopUp /> */}
      {checkBundle == "YES" && <TolakPopUp type="Bundle" />}
      {checkBundle == "NO" &&
        classData?.ClassLevel == "BUNDLE" &&
        checkIntermediate == "YES" && <TolakPopUp type="Intermediate" />}
      {checkBundle == "NO" &&
        classData?.ClassLevel == "BUNDLE" &&
        checkEntry == "YES" && <TolakPopUp type="Entry" />}
      {checkBundle == "NO" &&
        classData?.ClassLevel == "BUNDLE" &&
        checkEntry == "NO" &&
        checkIntermediate == "NO" && <PaymentPopUp />}
      {checkBundle == "NO" &&
        classData?.ClassLevel == "INTERMEDIATE" &&
        checkIntermediate == "YES" && <TolakPopUp type="Intermediate" />}
      {checkBundle == "NO" &&
        classData?.ClassLevel == "INTERMEDIATE" &&
        checkIntermediate == "NO" && <PaymentPopUp />}
      {checkBundle == "NO" &&
        classData?.ClassLevel == "ENTRY" &&
        checkEntry == "YES" && <TolakPopUp type="Entry" />}
      {checkBundle == "NO" &&
        classData?.ClassLevel == "ENTRY" &&
        checkEntry == "NO" && <PaymentPopUp />}

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex flex-col gap-6 xl:w-240">
          <Konfirmasi />
          <ChosenClass
            courseId={matchedCourseId}
            packageId={matchedPackageId}
          />
        </div>
        <div className="w-full xl:w-2/5 flex flex-col gap-6">
          <Receipt
            name={classData?.title}
            prices={prices}
            level={classData?.ClassLevel}
          />
          <BuktiPembayaran
            courseId={matchedCourseId}
            packageId={matchedPackageId}
            availability={
              noBundle
                ? availability.available.entryIntermediateAvailable
                : availability.available.bundleAvailable
            }
          />
        </div>
      </div>
    </div>
  );
}
