"use client";
import React from "react";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";

const PhoneNumberForm = () => {
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // clear old error

    try {
      const res = await fetch("/api/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setErrorMessage(error || "Terjadi kesalahan.");
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setErrorMessage("Terjadi kesalahan jaringan.");
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col gap-3 border-2 border-neutral-500 rounded-[20px] p-5">
        <div className="pb-3 border-b-2 border-neutral-500">
          <p className="text-lg font-bold">Satu Langkah Kecil Sebelum Lanjut</p>
          <p className="flex gap-2">
            <AlertCircle />
            Masukkan nomor telepon kamu dulu untuk lanjut ke pendaftaran!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-[6px]">
            <div className="bg-neutral-50 flex items-center gap-2 py-2 px-3 rounded-lg text-black">
              <Phone className="w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="08XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full placeholder-neutral-400"
              />
            </div>

            <p>*Kami akan menghubungi Kamu via nomor ini jika ada kendala</p>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-3 rounded-lg font-semibold cursor-pointer bg-primary-500 text-white"
          >
            Lanjut
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneNumberForm;
