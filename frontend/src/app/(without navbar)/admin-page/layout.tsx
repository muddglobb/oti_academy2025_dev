import type { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import Sidebarz from "@/components/admin-page/sidebarz";
import { Headerz } from "@/components/admin-page/headerz";

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
  return (
    <div className="">
      <aside className="w-62">
        <Sidebarz />
      </aside>
      <main className="bg-neutral-200 flex-1 ml-62">
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
