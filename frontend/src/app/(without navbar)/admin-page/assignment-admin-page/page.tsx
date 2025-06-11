import React from "react";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

const Assignments = async () => {
  try {
    await requireAdmin();
  } catch (err) {
    if ((err as Error).message === "NO_TOKEN") {
      redirect("/login");
    }
    redirect("/");
  }
  return <div>Assignments</div>;
};

export default Assignments;
