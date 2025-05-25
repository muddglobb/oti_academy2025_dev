"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, User, LogOut } from "lucide-react";

export function MiniHeader({ userName }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  const router = useRouter();
  const handleLogout = async () => {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (res.ok) {
      console.log("Logout sukses");
      router.push("/");
    } else {
      const errorData = await res.json();
      console.error("Logout gagal:", res.status, errorData.message);
    }
  } catch (err) {
    console.error("Error saat logout:", err);
  }
};

  return (
    <>
      <header className="sticky top-0 z-50 bg-neutral-900 flex justify-between items-center py-4 px-6 border-b border-gray-800">
        <Image
          src="/images/logo/oti-academy-logo.webp"
          width={32}
          height={32}
          alt="OTI Academy Logo"
        />
        <Menu className="w-8 h-8" onClick={handleToggle} />
      </header>

      {/* {isOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900 text-white flex flex-col items-center justify-center px-6">
          <button
            onClick={handleToggle}
            className="absolute top-4 right-4 text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Halo, {userName}</h2>
            <button
              className="bg-primary-500 px-6 py-2 rounded-md font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      )} */}

      <div
        className={`fixed inset-0 z-50 bg-neutral-900 text-neutral-50 px-6 transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } `}
      >
        <button
          onClick={handleToggle}
          className="absolute top-4 right-4 text-neutral-50"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="mt-15 flex flex-col">
          <div className="flex items-center gap-2">
            <div className="bg-neutral-500 rounded-full">
              <User className="w-8 h-8 p-1" />
            </div>
            <h2 className="">{userName}</h2>
          </div>
          <button className="border-2 border-neural-50 px-6 py-2 rounded-md font-semibold fixed bottom-6 flex items-center gap-2 w-60 justify-center" onClick={handleLogout}>
            <LogOut />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
{
  /* <div className="flex items-center">
        <span className="mr-3">{userName}</span>
        <div className="bg-neutral-500 rounded-full">
          <Image
            src="/images/profile-picture.webp"
            width={32}
            height={32}
            alt="PP"
            className="rounded-full"
          />
        </div>
      </div> */
}
