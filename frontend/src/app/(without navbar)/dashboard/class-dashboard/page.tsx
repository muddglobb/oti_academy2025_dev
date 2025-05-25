import { fetchPackage, fetchCourse } from "@/lib/package/fetch-package";
import React from "react";
import PackageCard from "@/components/dashboard/package-card";
import BundleCard from "@/components/dashboard/bundle-card";
import Container from "@/components/container";
import Pengantar from "@/components/dashboard/pengantar";

// Define the PackageType interface
type PackageType = {
  id: string;
  name: string;
  type: "ENTRY" | "INTERMEDIATE" | "BUNDLE";
  price: number;
  createdAt: string;
  updatedAt: string;
  courses: {
    packageId: string;
    courseId: string;
    title: string;
    description: string;
    level: "ENTRY" | "INTERMEDIATE";
  }[];
};

type CourseType = {
  packageId: string;
  courseId: string;
  title: string;
  description: string;
  level: "ENTRY" | "INTERMEDIATE";
};

export default async function ClassDashboard() {
  try {
    const packages = (await fetchPackage()) as PackageType[];

    if (!packages || packages.length === 0) {
      return (
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Your Classes</h1>
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p>Tidak ada paket tersedia saat ini.</p>
          </div>
        </div>
      );
    }

    // Function to determine package display priority
    const getPackagePriority = (pkg: PackageType): number => {
      // Option 1: Priority based on type
      const typePriority = {
        BUNDLE: 1,
        ENTRY: 2,
        INTERMEDIATE: 3,
      };
      return typePriority[pkg.type];
    };

    const modifiedPackages = packages
      .map((pkg) => ({
        ...pkg,
      }))
      .sort((a, b) => {
        // Sort by custom priority function
        const priorityDiff = getPackagePriority(a) - getPackagePriority(b);

        if (priorityDiff !== 0) {
          return priorityDiff;
        }

        // If same priority, sort by name
        return a.name.localeCompare(b.name);
      });

    return (
      <div className="px-2 py-2 sm:px-6 sm:py-4 md:px-10 lg:px-14 md:py-6 lg:py-8 flex flex-col gap-9">
        <Pengantar />
        <div className="">
          <div>
            <div className="flex flex-col border-2 rounded-[20px] border-neutral-500 p-5">
              <h1 className="font-bold text-[18px] border-b-2 border-neutral-500 pb-3">
                Bundle Class
              </h1>
              <div className="grid gap-5 grid-cols-1 xl:grid-cols-2 pt-4">
                {/* Filter and render bundle packages using BundleCard */}
                {modifiedPackages
                  .filter((pkg) => pkg.type === "BUNDLE")
                  .map((bundlePkg) => (
                    <BundleCard
                      key={bundlePkg.id}
                      pkg={bundlePkg}
                      course={{
                        packageId: bundlePkg.id,
                        courseId: bundlePkg.courses?.[0]?.courseId || "",
                        title: bundlePkg.courses?.[0]?.title || bundlePkg.name,
                        description: bundlePkg.courses?.[0]?.description || "",
                        level: "ENTRY",
                      }}
                    />
                  ))}
              </div>
            </div>

            {/* Filter and render non-bundle packages using PackageCard */}
            {modifiedPackages
              .filter((pkg) => pkg.type !== "BUNDLE")
              .map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  course={{
                    packageId: "",
                    courseId: "",
                    title: "",
                    description: "",
                    level: "ENTRY",
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching packages:", error);
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Your Classes</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Gagal memuat data paket. Silakan coba lagi nanti.</p>
        </div>
      </div>
    );
  }
}
