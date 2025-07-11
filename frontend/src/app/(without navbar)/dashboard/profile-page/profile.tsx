"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import Image from "next/image";

export default function ProfileComponent() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/update-profile-name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
        credentials: "include",
      });

      const error = await res.json();

      if (!res.ok) {
        setMessage(error.message || "Failed to update profile");
      } else {
        setMessage("Profile updated successfully!");
      }
    } catch (error) {
      setMessage("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-7.5">
      <p className="self-start text-neutral-50 text-sm mb-[8px]">Profile</p>
      <div className="lg:w-147 md:w-95 w-90 rounded-[20px] bg-transparent p-[20px] border-solid border-2 border-neutral-500">
        <div className="pb-[13px] border-b-2 border-neutral-500">
          <p className="font-bold font-display text-lg text-neutral-50">
            Nama Lengkap
          </p>
        </div>
        <p className="mt-[15px]">
          Biar <span className="font-bold">sertifikat OmahTi Academy</span> kamu
          nanti bisa langsung dicetak dan jadi bukti keren partisipasimu, yuk
          bantu kami dengan mengisi{" "}
          <span className="font-bold">nama lengkapmu!</span>
        </p>
        <div>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-[8px] bg-white w-full h-11 placeholder-neutral-400 text-black py-[10px] px-10"
                placeholder="OmahTi Academy"
              />
              <User
                className={`absolute left-3
                        ${"top-[50%] -translate-y-[45%] text-neutral-500"}
                        h-4 w-4`}
                size={20}
              />
              <Image
                src={`/icons/question-mark-icon.svg`}
                alt="Question Mark Icon"
                className={`absolute right-3
                        ${"top-[50%] -translate-y-[45%] text-neutral-500"}
                        h-4 w-4`}
                width={20}
                height={20}
              ></Image>
            </div>
            {loading ? "Updating..." : ""}

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-9 bg-primary-500 text-neutral-50 rounded-[8px] mt-[13px] ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-800"
              }`}
            >
              Submit
            </button>
            {message && <p className="mt-4 text-center text-xs">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
