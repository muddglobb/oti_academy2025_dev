"use client";

import React from "react";
import { LogOut, Clipboard, House, Book, Info } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const Sidebar = () => {
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
      // alert("berhasil logout");
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
    <div className="w-62 bg-gray-950 flex flex-col border-r-2 border-neutral-500 fixed top-0 left-0 h-screen items-center">
      <Link href={"/"}>
        <div className="pt-6.5">
          {/* <h1 className="text-xl font-bold">OmahTI</h1>
          <p className="text-sm text-gray-400">ACADEMY</p> */}
          <Image
            src={"/images/logo/oti-academy.webp"}
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
              href={"/dashboard"}
              className={`flex items-center px-4 py-2 rounded ${
                pathname === "/dashboard"
                  ? "bg-[var(--color-neutral-800)]"
                  : "hover:bg-gray-800"
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
              href={"/dashboard/class-dashboard"}
              className={`flex items-center px-4 py-2 rounded ${
                pathname === "/dashboard/class-dashboard"
                  ? "bg-[var(--color-neutral-800)]"
                  : "hover:bg-gray-800"
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
              href={"/dashboard/assignments"}
              className={`flex items-center px-4 py-2 rounded ${
                pathname === "/dashboard/assignments"
                  ? "bg-[var(--color-neutral-800)]"
                  : "hover:bg-gray-800"
              }`}
            >
              <div className="w-6 mr-3">
                <Clipboard />
              </div>
              Assignments
            </Link>
          </li>
          <li className="mb-2 w-full">
            <Link
              href={"/dashboard/help"}
              className={`flex items-center px-4 py-2 rounded ${
                pathname === "/dashboard/help"
                  ? "bg-[var(--color-neutral-800)]"
                  : "hover:bg-gray-800"
              }`}
            >
              <div className="w-6 mr-3">
                <Info />
              </div>
              Help Contact
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto p-2 w-full">
        <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-400 rounded hover:bg-gray-800 cursor-pointer">
          <LogOut size={16} className="mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
