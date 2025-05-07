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
  const isAuthPage = ["/login", "/register", "/lupa-password"].includes(pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
