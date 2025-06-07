"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TolakPopUp({ type }: { type: string }) {
  const [showPopup, setShowPopup] = useState(false);

  // Tampilkan popup saat halaman pertama kali dimuat
  useEffect(() => {
    setShowPopup(true);
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-neutral-900/70 z-50 flex items-center justify-center">
          <div className="bg-neutral-700 rounded-[20px] p-6 w-full border-2 border-neutral-500 mx-3 sm:mx-10 md:mx-50 lg:mx-60 xl:mx-80">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-neutral-500">
              <AlertCircle />
              <h2 className="text-xl font-bold">
                Kamu sudah terdaftar pada kelas {type}
              </h2>
            </div>
            {type == "Bundle" && (
              <p className="text-[12px] pt-3">
                Setelah mendaftar kelas {type},
                <span className="font-bold">
                  kamu tidak bisa mendaftar kelas apapun lagi
                </span>
              </p>
            )}
            {type == "Entry" && (
              <p className="text-[12px] pt-3">
                Setelah mendaftar kelas {type},
                <span className="font-bold">
                  kamu tidak bisa mendaftar kelas {type} apapun lagi
                </span>
              </p>
            )}
            {type == "Intermediate" && (
              <p className="text-[12px] pt-3">
                Setelah mendaftar kelas {type},
                <span className="font-bold">
                  kamu tidak bisa mendaftar kelas {type} apapun lagi
                </span>
              </p>
            )}
            <div className="flex gap-2 pt-3 justify-end">
              <Link href="/dashboard/class-dashboard">
                <button className="px-4 py-2 bg-primary-700 text-white rounded-sm cursor-pointer">
                  Kembali
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
