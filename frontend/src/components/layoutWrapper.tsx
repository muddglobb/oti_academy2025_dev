'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Cek apakah pathname mengandung '/dashboard' atau halaman login, register, lupa-password
  const hideNavbarFooter = pathname.includes("/dashboard") || ["/login", "/register", "/lupa-password"].includes(pathname);

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <main>{children}</main>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}
