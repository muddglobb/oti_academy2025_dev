import type { Metadata } from "next";
import React from "react";
import { PaymentHeader } from "@/components/payment/payment-header";
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
    <div className="text-white">
      <PaymentHeader />
      {children}
    </div>
  );
}
