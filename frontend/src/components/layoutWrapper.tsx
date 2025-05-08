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
  const hideNavbar = ["/login", "/register", "/lupa-password", "/dashboard", "/dashboard/class-dashboard", "/dashboard/assignments", "/dashboard/help",].includes(pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
      {!hideNavbar && <Footer />}
    </>
  );
}
