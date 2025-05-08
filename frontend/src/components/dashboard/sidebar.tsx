"use client"

import React from "react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-62 bg-gray-950 flex flex-col border-r border-gray-800 fixed top-0 left-0 h-screen items-center">
      <Link href={"/"}>
        <div className="pt-6.5">
          {/* <h1 className="text-xl font-bold">OmahTI</h1>
          <p className="text-sm text-gray-400">ACADEMY</p> */}
          <Image src={"/images/logo/oti-academy.webp"} width={150} height={40} alt="OmahTI Academy" />
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              Help Contact
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto p-2 w-full">
        <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-400 rounded hover:bg-gray-800">
          <LogOut size={16} className="mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
