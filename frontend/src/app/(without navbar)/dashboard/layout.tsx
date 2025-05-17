import type { Metadata } from "next";
import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import MiniSidebar from "@/components/dashboard/mini-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata: Metadata = {
  title: "Dashboard OmahTI Academy",
  description: "keren",
};

export default function TrollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
