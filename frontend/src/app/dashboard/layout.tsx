// app/troll/layout.tsx
import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
// import DashboardHeader from "@/components/dashboard/header";
import { DashboardHeader } from "@/components/dashboard/header";

// const userData = {
//   name: "Regina Joan Medea Jati Laksono",
//   avatar: "/images/teacher/faris.jpg",
// };

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
        <div className="flex bg-neutral-900 text-white">
          <div className="flex-grow">
            {/* <DashboardHeader data={userData} /> */}
            <DashboardHeader />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
