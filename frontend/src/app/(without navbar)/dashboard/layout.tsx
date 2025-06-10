import type { Metadata } from "next";
import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import MiniSidebar from "@/components/dashboard/mini-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { redirect } from "next/navigation";
import { notAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard OmahTI Academy",
  description: "Online Mini Bootcamp yang menawarkan pengalaman belajar intensif, mengasah keterampilan IT, cocok untuk pemula dan yang ingin mendalami bidang spesifik.",
};

export default function TrollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //mencegah admin akses dashboard siswa
  try {
    notAdmin();
  } catch (err) {
    if ((err as Error).message === "NO_TOKEN") {
      return redirect("/login");
    }
    return redirect("/admin-page");
  }
  return (
    <div className="flex text-white">
      {/* <Sidebar /> */}
      <aside className="w-62 bg-neutral-900 hidden md:block">
        <Sidebar />
      </aside>
      <main className="flex-1">
        <div className="flex text-white">
          <div className="flex-grow">
            {/* <DashboardHeader data={userData} /> */}

            <DashboardHeader />

            <div className="block md:hidden">
              <MiniSidebar />
            </div>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
