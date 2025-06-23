export const dynamic = 'force-dynamic';
import React from "react";
import WelcomeCard from "@/components/dashboard/welcome-card";
import SecondContent from "@/components/dashboard/second-content";
import SelectClass from "@/components/dashboard/select-class";
import Image from "next/image";
import { getUsers } from "@/lib/auth/fetch-users";

const Dashboard = async () => {
  const users = await getUsers();
  return (
    <main className="px-2 py-2 sm:px-6 sm:py-4 md:px-10 lg:px-14 md:py-6 lg:py-8 bg-neutral-900">
      <WelcomeCard userName={users.data.name} Phone={users.data.phone}/>
      <SecondContent/>
      <SelectClass />
    </main>
  );
};

export default Dashboard;
