import React from "react";
import { WelcomeCard } from "@/components/dashboard/welcome-card";
import SecondContent from "@/components/dashboard/second-content";
import SelectClass from "@/components/dashboard/select-class";

const Dashboard = async () => {
  // console.log(users.data.role);
  return (
    <main className="p-6 bg-neutral-900">
      {/* <WelcomeCard data={userData} /> */}
      <WelcomeCard />
      <SecondContent/>
      <SelectClass />
    </main>
  );
};

export default Dashboard;
