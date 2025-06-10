import type { Metadata } from "next";
import React from "react";
import { PaymentHeader } from "@/components/payment/payment-header";
import { redirect } from "next/navigation";
import { notAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "OmahTI Academy",
  description: "Online Mini Bootcamp yang menawarkan pengalaman belajar intensif, mengasah keterampilan IT, cocok untuk pemula dan yang ingin mendalami bidang spesifik.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "OmahTI Academy",
    description: "Online Mini Bootcamp yang menawarkan pengalaman belajar intensif, mengasah keterampilan IT, cocok untuk pemula dan yang ingin mendalami bidang spesifik.",
    url: "https://academy.omahti.web.id", 
    siteName: "OmahTI Academy",
    images: [
      {
        url: "https://res.cloudinary.com/dyjvctxme/image/upload/v1749565631/omahti_academy_pqqfea.png", 
        width: 1200,
        height: 630,
        alt: "OmahTI Academy - Online Mini Bootcamp",
      },
    ],
    locale: "id_ID",
    type: "website",
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
    <div className="text-white">
      <PaymentHeader />
      {children}
    </div>
  );
}
