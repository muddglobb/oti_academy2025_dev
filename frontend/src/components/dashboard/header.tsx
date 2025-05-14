import React from "react";
import Image from "next/image";
import { getUsers } from "@/lib/auth/fetch-users";

export async function DashboardHeader() {
  const users = await getUsers();

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 flex justify-between items-center py-4 px-6 border-b border-gray-800">
      <h2 className="text-lg">Dashboard</h2>
      <div className="flex items-center">
        <span className="mr-3">{users.data.name}</span>
        <div className="bg-neutral-500 rounded-full">
          <Image
            src="/images/profile-picture.webp"
            width={32}
            height={32}
            alt="PP"
            className="rounded-full"
          />
        </div>
      </div>
    </header>
  );
}

// export default DashboardHeader;
