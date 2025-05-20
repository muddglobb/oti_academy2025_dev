import type { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

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
  return <div className="flex text-white">{children}</div>;
}
