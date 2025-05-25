import React from "react";
import { WelcomeCard } from "@/components/dashboard/welcome-card";
import SecondContent from "@/components/dashboard/second-content";
import SelectClass from "@/components/dashboard/select-class";

const Dashboard = async () => {
  // console.log(users.data.role);
  return (
    <main className="px-2 py-2 sm:px-6 sm:py-4 md:px-10 lg:px-14 md:py-6 lg:py-8 bg-neutral-900">
      {/* <WelcomeCard data={userData} /> */}
      <WelcomeCard />
      <SecondContent/>
      <SelectClass />
    </main>
  );
};

export default Dashboard;
