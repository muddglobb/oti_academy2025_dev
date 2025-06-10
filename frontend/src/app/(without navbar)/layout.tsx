import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "../globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "OmahTI Academy",
    template: "%s | OmahTI Academy",
  },
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
  twitter: {
    card: "summary_large_image",
    title: "OmahTI Academy",
    description: "Online Mini Bootcamp yang menawarkan pengalaman belajar intensif",
    images: ["https://res.cloudinary.com/dyjvctxme/image/upload/v1749565631/omahti_academy_pqqfea.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${poppins.className}`}
      >
        {children}
      </body>
    </html>
  );
}
