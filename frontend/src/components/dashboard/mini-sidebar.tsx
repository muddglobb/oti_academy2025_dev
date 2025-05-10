"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const HAYOO = () => {
  const pathname = usePathname();

  return (
    <div className="bg-neutral-900 h-10 pt-3 flex justify-around text-[14px]">
      <Link
        href={"/dashboard"}
        className={`${
          pathname === "/dashboard"
            ? "font-bold text-[var(--color-primary-300)] border-b-3 border-[var(--color-primary-300)]"
            : "hover:bg-gray-800 font-normal text-white border-0"
        }`}
      >
        <div>Home</div>
      </Link>

      <Link
        href={"/dashboard/class-dashboard"}
        className={`${
          pathname === "/dashboard/class-dashboard"
            ? "font-bold text-[var(--color-primary-300)] border-b-3 border-[var(--color-primary-300)]"
            : "hover:bg-gray-800 font-normal text-white border-0"
        }`}
      >
        <div>Class</div>
      </Link>

      <Link
        href={"/dashboard/assignments"}
        className={`${
          pathname === "/dashboard/assignments"
            ? "font-bold text-[var(--color-primary-300)] border-b-3 border-[var(--color-primary-300)]"
            : "hover:bg-gray-800 font-normal text-white border-0"
        }`}
      >
        <div>Assignments</div>
      </Link>

      <Link
        href={"/dashboard/help"}
        className={`${
          pathname === "/dashboard/help"
            ? "font-bold text-[var(--color-primary-300)] border-b-3 border-[var(--color-primary-300)]"
            : "hover:bg-gray-800 font-normal text-white border-0"
        }`}
      >
        <div>Help</div>
      </Link>
    </div>
  );
};

export default HAYOO;
