import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";

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
    default: "OmahTI Academy - Online Mini Bootcamp IT",
    template: "%s | OmahTI Academy",
  },
  description: "OmahTI Academy adalah platform Online Mini Bootcamp terbaik untuk belajar IT, cybersecurity, programming, web development, dan data science. Program belajar intensif cocok untuk pemula hingga intermediate dengan mentor profesional industri.",
  keywords: ["OmahTI Academy", "bootcamp IT", "belajar programming", "cybersecurity", "web development", "data science", "online course", "bootcamp Indonesia", "kursus IT", "pelatihan programming"],
  authors: [{ name: "OmahTI Academy" }],
  creator: "OmahTI Academy",
  publisher: "OmahTI Academy",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "OmahTI Academy - Online Mini Bootcamp IT",
    description: "Platform Online Mini Bootcamp terbaik untuk belajar IT, cybersecurity, programming, web development, dan data science. Program intensif dengan mentor profesional industri.",
    url: "https://academy.omahti.web.id", 
    siteName: "OmahTI Academy",
    images: [
      {
        url: "https://res.cloudinary.com/dyjvctxme/image/upload/v1749565631/omahti_academy_pqqfea.png", 
        width: 1200,
        height: 630,
        alt: "OmahTI Academy - Online Mini Bootcamp IT",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmahTI Academy - Online Mini Bootcamp IT",
    description: "Platform Online Mini Bootcamp terbaik untuk belajar IT, cybersecurity, programming, web development, dan data science dengan mentor profesional industri.",
    images: ["https://res.cloudinary.com/dyjvctxme/image/upload/v1749565631/omahti_academy_pqqfea.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://academy.omahti.web.id",
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
