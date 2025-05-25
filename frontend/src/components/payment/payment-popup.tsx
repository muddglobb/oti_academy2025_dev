"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentPopUp() {
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
          <div className="bg-neutral-700 rounded-[20px] p-6 w-full border-2 border-neutral-500 mx-3 sm:mx-6 md:mx-10 lg:mx-25 xl:mx-60">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-neutral-500">
              <AlertCircle />
              <h2 className="text-xl font-bold">
                Yakin dengan pilihan kelasmu?
              </h2>
            </div>
            <p className="text-[12px] pt-3">
              Setelah pembayaran dilakukan,
              <span className="font-bold">
                perubahan kelas tidak dapat dilakukan.
              </span>
              Pastikan kamu memilih dengan benar sebelum menyelesaikan
              pendaftaran, ya!
            </p>
            <div className="flex gap-2 pt-3 justify-end">
              <Link href="/dashboard/class-dashboard">
              <button className="px-4 py-2 bg-primary-700 text-white rounded-sm cursor-pointer">
                Cancel
              </button>
              </Link>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-primary-500 text-white rounded-sm cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
