import React from "react";
import Image from "next/image";
import { UsersType } from "@/types/users-type";
import { getUsers } from "@/lib/fetch-users";

// type UserData = {
//   name: string;
//   avatar: string;
// }
// const WelcomeCard = ({ data }: { data: UserData }) => {
export async function WelcomeCard() {
  // const {name} = data;
  const users: UsersType = await getUsers();
  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-400">Home</p>
      </div>

      {/* Welcome Card */}
      {/* bg-gradient-to-r from-blue-900 to-blue-800  */}
      {/* <div className="rounded-[20px] mb-6 flex justify-between relative bg-amber-200"
      style={{ backgroundImage: 'url("/images/stars-hero-programs.png")'}}>

        <div className="p-4">
          <h2 className="text-xl mb-2">Welcome to Our Academy,</h2>
          <h1 className="text-2xl font-bold mb-4">{users.data.name}!</h1>
          <p className="text-sm text-gray-300 max-w">
            Siap-siap untuk transformasi seru dan setiap programmu akan kita
            rayakan bersama!
          </p>
        </div>
        <div className="self-end">
          <Image
            src="/images/planet/bumi-dashboard.webp"
            alt="Earth"
            width={336}
            height={289}
            className="self-end rounded-[20px]"
          />
        </div>
      </div> */}

      <div
        className="rounded-[20px] mb-6 flex justify-between relative overflow-hidden border-2 border-neutral-500"
        style={{
          backgroundImage: 'url("/images/stars-hero-programs.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[--var(-color-neutral-900)] to-transparent z-0" /> */}
        {/* Overlay gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[var(--color-primary-300)] opacity-50" />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-l from-neutral-900 to-transparent" />

          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(74,123,237,0.5)_0%,_transparent_70%)]" /> */}
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
