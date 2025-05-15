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
  
  const hideNavbarFooter = pathname.includes("/dashboard") || ["/login", "/register", "/forgot-password"].includes(pathname);

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {!hideNavbarFooter && <main className="pt-34">{children}</main>}
      {hideNavbarFooter && <main>{children}</main>}
      {!hideNavbarFooter && <Footer />}
    </>
  );
}
