import type { Metadata } from "next";
import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import MiniSidebar from "@/components/dashboard/mini-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { redirect } from "next/navigation";
import { notAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard - OmahTI Academy",
  description: "Dashboard mahasiswa OmahTI Academy - Akses materi pembelajaran, tugas, progress, dan sertifikat bootcamp IT terbaik Indonesia.",
  keywords: ["dashboard OmahTI", "pembelajaran online", "progress bootcamp", "materi IT", "sertifikat programming"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Dashboard - OmahTI Academy",
    description: "Dashboard mahasiswa OmahTI Academy - Akses materi pembelajaran, tugas, progress, dan sertifikat bootcamp IT terbaik Indonesia.",
    url: "https://academy.omahti.web.id/dashboard", 
    siteName: "OmahTI Academy",
    images: [
      {
        url: "https://res.cloudinary.com/dyjvctxme/image/upload/v1749565631/omahti_academy_pqqfea.png", 
        width: 1200,
        height: 630,
        alt: "Dashboard OmahTI Academy - Bootcamp IT Online",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
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
