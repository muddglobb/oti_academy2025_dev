import type { Metadata } from "next";
import React from "react";
import { PaymentHeader } from "@/components/payment/payment-header";
import { redirect } from "next/navigation";
import { notAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pembayaran - OmahTI Academy",
  description: "Halaman pembayaran OmahTI Academy - Daftar bootcamp IT terbaik dengan harga terjangkau. Investasi terbaik untuk karir IT masa depan Anda.",
  keywords: ["pembayaran OmahTI", "harga bootcamp IT", "biaya kursus programming", "investasi karir IT"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Pembayaran - OmahTI Academy",
    description: "Halaman pembayaran OmahTI Academy - Daftar bootcamp IT terbaik dengan harga terjangkau. Investasi terbaik untuk karir IT masa depan Anda.",
    url: "https://academy.omahti.web.id/payment", 
    siteName: "OmahTI Academy",
    images: [
      {
        url: "https://res.cloudinary.com/dyjvctxme/image/upload/v1749565631/omahti_academy_pqqfea.png", 
        width: 1200,
        height: 630,
        alt: "Pembayaran OmahTI Academy - Bootcamp IT Terjangkau",
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
    <div className="text-white">
      <PaymentHeader />
      {children}
    </div>
  );
}
