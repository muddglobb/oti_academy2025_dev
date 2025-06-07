import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { getAccessToken } from "@/lib/auth/fetch-users";

const BeginJourney = async () => {
  const access_token = await getAccessToken();

  const linkHref = access_token ? "/dashboard" : "/login";
  const buttonText = access_token ? "Dashboard" : "Begin Your Journey Here!";

  return (
    <div>
      <Link href={linkHref}>
        <Button>{buttonText}</Button>
      </Link>
    </div>
  );
};

export default BeginJourney;
