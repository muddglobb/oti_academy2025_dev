import React from "react";
import Image from "next/image";
import { getUsers } from "@/lib/auth/fetch-users";

export async function Headerz() {
  const users = await getUsers();

  return (
    <header className="sticky top-0 z-50 bg-neutral-100 flex justify-between items-center py-4 px-6 border-b border-neutral-300">
      <h2 className="text-lg">Dashboard Admin</h2>
      <div className="flex items-center">
        <span className="mr-3">{users.data.name}</span>
        <div className="bg-neutral-400 rounded-full">
          <Image
            src="/images/profile-picture-admin.webp"
            width={32}
            height={32}
            alt="PP"
            className="rounded-full p-1"
          />
        </div>
      </div>
    </header>
  );
}

// export default DashboardHeader;
