import type { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import Sidebarz from "@/components/admin-page/sidebarz";
import { Headerz } from "@/components/admin-page/headerz";

export const metadata: Metadata = {
  title: "Admin Dashboard OmahTI Academy",
  description: "keren",
};

export default function TrollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // mencegah siswa akses admin-page
  try {
    requireAdmin();
  } catch (err) {
    if ((err as Error).message === "NO_TOKEN") {
      return redirect("/login");
    }
    return redirect("/");
  }
  return (
    <div className="flex">
      <aside className="w-62">
        <Sidebarz />
      </aside>
      <main className="bg-neutral-200 flex-1">
        <div className="flex text-neutral-900">
          <div className="flex-grow">
            <Headerz />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
