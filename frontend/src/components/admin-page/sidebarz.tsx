"use client";

import React from "react";
import { LogOut, Clipboard, House, Book } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const Sidebarz = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        console.log("Logout sukses");
        router.push("/");
      } else {
        const errorData = await res.json();
        console.error("Logout gagal:", res.status, errorData.message);
      }
    } catch (err) {
      console.error("Error saat logout:", err);
    }
  };

  return (
    <div className="w-62 bg-neutral-50 flex flex-col border-r h-screen items-center">
      <Link href={"/"}>
        <div className="pt-6.5">
          {/* <h1 className="text-xl font-bold">OmahTI</h1>
          <p className="text-sm text-gray-400">ACADEMY</p> */}
          <Image
            src={"/images/logo/oti-academy-ireng.webp"}
            width={150}
            height={40}
            alt="OmahTI Academy"
          />
        </div>
      </Link>

      <nav className="flex-grow py-6 w-full px-3">
        <ul>
          <li className="mb-2 w-full">
            <Link
              href={"/admin-page"}
              className={`flex items-center px-4 py-2 rounded ${
                pathname === "/admin-page"
                  ? "bg-[var(--color-neutral-400)]"
                  : "hover:bg-neutral-400"
              }`}
            >
              <div className="w-6 mr-3">
                <House />
              </div>
              Home
            </Link>
          </li>
          <li className="mb-2 w-full">
            <Link
              href={"/admin-page/class-admin-page"}
              className={`flex items-center px-4 py-2 rounded ${
                pathname === "/admin-page/class-admin-page"
                  ? "bg-[var(--color-neutral-400)]"
                  : "hover:bg-neutral-400"
              }`}
            >
              <div className="w-6 mr-3">
                <Book />
              </div>
              Class
            </Link>
          </li>
          <li className="mb-2 w-full">
            <Link
              href={"/admin-page/assignment-admin-page"}
              className={`flex items-center px-4 py-2 rounded ${
                pathname === "/admin-page/assignment-admin-page"
                  ? "bg-[var(--color-neutral-400)]"
                  : "hover:bg-neutral-400"
              }`}
            >
              <div className="w-6 mr-3">
                <Clipboard />
              </div>
              Assignments
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto p-2 w-full">
        <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center px-4 py-2 border border-neutral-300 text-gray-400 rounded hover:bg-gray-500 hover:text-neutral-300">
          <LogOut size={16} className="mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebarz;
