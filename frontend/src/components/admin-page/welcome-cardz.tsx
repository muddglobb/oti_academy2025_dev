import { getUsers } from "@/lib/auth/fetch-users";
import React from "react";

const WelcomeCardz = async () => {
  const users = await getUsers();
  return (
    <>
      <p className="text-sm mb-1">Home</p>

      <div className="bg-neutral-50 p-5 rounded-[20px]">
        <div className="text-2xl">
          <p>We Make IT For</p>
          <p className="font-bold">{users.data.name}</p>
        </div>
        <p className="text-sm pt-5 max-w-100 pb-10">
          Sudah menyatu dengan oti anjay selamat datang di admin page yang keren
          banget ini CIHUYYY
        </p>
      </div>
    </>
  );
};

export default WelcomeCardz;
