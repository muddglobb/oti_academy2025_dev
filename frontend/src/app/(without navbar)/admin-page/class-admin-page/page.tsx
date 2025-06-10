import React from "react";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  try {
    await requireAdmin();
  } catch (err) {
    if ((err as Error).message === "NO_TOKEN") {
      redirect("/login");
    }
    redirect("/");
  }
  return <div className="text-neutral-900">page</div>;
};

export default page;
