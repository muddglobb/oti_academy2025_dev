import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { getAccessToken } from "@/lib/auth/fetch-users";

const BeginJourney = async () => {
  const access_token = await getAccessToken();

  const linkHref = access_token ? "/dashboard" : "/login";
  const buttonText = access_token ? "Dashboard" : "Begin Your Journey Here!";

  return (
    <Link href={linkHref}>
      <div className="bg-primary-500 text-neutral-50 py-3 px-4 rounded-md font-bold cursor-pointer">
        <button className="cursor-pointer">{buttonText}</button>
      </div>
    </Link>
  );
};

export default BeginJourney;
