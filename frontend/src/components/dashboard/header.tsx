import React from "react";
import Image from "next/image";

// const userData = {
//   name: "Regina Joan Medea Jati Laksono",
//   avatar: "/avatar.png" // Placeholder for avatar
// };
type UserData = {
  name: string;
  avatar: string;
}

const DashboardHeader = ({ data }: { data: UserData }) => {
  const {name, avatar} = data;

  return (
    <header className="flex justify-between items-center py-4 px-6 border-b border-gray-800">
      <h2 className="text-lg">Dashboard</h2>
      <div className="flex items-center">
        <span className="mr-3">{name}</span>
        {/* <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          {avatar ? (
            <Image width={8} height={8} src={avatar} alt={"R"} className="rounded-full" />
          ) : (
            <span>P</span>
          )}
        </div> */}
        <Image src={avatar} width={32} height={32} alt="PP" className="rounded-full" />
      </div>
    </header>
  );
};

export default DashboardHeader;
