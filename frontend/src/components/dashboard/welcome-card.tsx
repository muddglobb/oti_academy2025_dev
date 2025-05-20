import React from "react";
import Image from "next/image";
import { getUsers } from "@/lib/auth/fetch-users";

export async function WelcomeCard() {
  const users = await getUsers();
  // console.log("Data pengguna:", users);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-400">Home</p>
      </div>

      {/* Welcome Card */}
      <div
        className="rounded-[20px] mb-6 flex justify-between relative border-2 border-neutral-500 h-65 "
        style={{
          backgroundImage: 'url("/images/stars-hero-programs.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay */}
        {/* Overlay gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[var(--color-primary-300)] opacity-50 rounded-[20px]" />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent rounded-[20px]" />

          <div className="absolute inset-0 bg-gradient-to-l from-neutral-900 to-transparent rounded-[20px]" />
        </div>

        {/* Konten */}
        <div className="p-4 relative z-10">
          <h2 className="text-xl mb-2">Welcome to Our Academy,</h2>
          <h1 className="text-2xl font-bold mb-4">{users.data.name}!</h1>
          <p className="text-sm text-gray-300">
            Siap-siap untuk transformasi seru dan setiap programmu akan kita
            rayakan bersama!
          </p>
        </div>

        <div className="self-end relative z-10">
          <Image
            src="/images/planet/bumi-dashboard.webp"
            alt="Earth"
            width={336}
            height={289}
            className="rounded-[20px]"
          />
        </div>
      </div>
    </div>
  );
}

// export default WelcomeCard
