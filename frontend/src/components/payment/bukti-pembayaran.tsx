"use client";
import React, { useState, useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { Link } from "lucide-react";
import PerhatianPayment from "@/components/payment/perhatian-payment";
import { useRouter } from "next/navigation";
import TolakPopUp from "./tolak-popup";

export function BuktiPembayaran({
  courseId,
  packageId,
  availability,
}: {
  courseId: string | null | undefined;
  packageId: string | null | undefined;
  availability: number;
}) {
  const router = useRouter();
  const [proofLink, setProofLink] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ new
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (availability <= 0) {
      router.push("/dashboard");
    }
  }, [availability, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // clear old error
    setIsSubmitting(true);

    const payload = {
      courseId,
      packageId,
      type: "UMUM",
      proofLink,
    };

    const payloadBundle = {
      packageId,
      type: "UMUM",
      proofLink,
    };

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseId ? payload : payloadBundle),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setErrorMessage(error || "Terjadi kesalahan."); // ✅ tampilkan error
        return;
      }

      setShowPopup(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("Gagal terhubung ke server."); // ✅ fallback error
    } finally {
      setIsSubmitting(false); // ✅ aktifkan kembali tombol
    }
  };

  return (
    <>
      {availability <= 0 && <TolakPopUp type="Bundle" />}
      {showPopup && (
        <PerhatianPayment
          show={showPopup}
          onClose={() => setShowPopup(false)}
        />
      )}

      <div className="rounded-[20px] border-3 border-neutral-500">
        <div
          className="w-full flex justify-between relative border-neutral-500 rounded-[17px]"
          style={{
            backgroundImage: 'url("/images/stars-hero-programs.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[var(--color-primary-300)] opacity-50 rounded-[17px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent rounded-[17px]" />
            <div className="absolute inset-0 bg-gradient-to-l from-neutral-900 to-transparent rounded-[17px]" />
          </div>

          <div className="p-4 z-10 w-full flex flex-col gap-3">
            <div className="border-b-3 border-neutral-500 w-full">
              <p className="text-lg font-bold">Bukti Pembayaran</p>
              <div className="w-full flex gap-2">
                <CircleAlert className="w-6 h-6 shrink-0" />
                <p className="pb-3">Upload bukti melalui link Google Drive</p>
              </div>
            </div>

            {/* ✅ Error Message */}
            {errorMessage ==
              `{"status":"error","message":"Validation failed"}` && (
              <p className="text-error-300 text-sm font-medium">
                Terjadi kesalahan pada link
              </p>
            )}
            {errorMessage ==
              `{"status":"error","message":"Anda tidak dapat mendaftar kelas baru karena sudah terdaftar di paket bundle"}` && (
              <p className="text-error-300 text-sm font-medium">
                Anda tidak dapat mendaftar kelas baru karena sudah terdaftar di
                paket bundle
              </p>
            )}
            {errorMessage ==
              `{"status":"error","message":"Anda sudah terdaftar di kelas entry. Tidak dapat mendaftar di kelas entry lainnya"}` && (
              <p className="text-error-300 text-sm font-medium">
                Anda sudah terdaftar di kelas entry. Tidak dapat mendaftar di
                kelas entry lainnya
              </p>
            )}
            {errorMessage ==
              `{"status":"error","message":"Anda sudah terdaftar di kelas intermediate. Tidak dapat mendaftar di kelas intermediate lainnya"}` && (
              <p className="text-error-300 text-sm font-medium">
                Anda sudah terdaftar di kelas intermediate. Tidak dapat
                mendaftar di kelas intermediate lainnya
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-3"
            >
              <div className="bg-neutral-50 flex items-center gap-2 py-2 px-3 rounded-lg text-black">
                <Link className="w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  disabled={availability <= 0}
                  placeholder={
                    availability <= 0
                      ? "Pendaftaran sudah ditutup"
                      : "https://drive.google.com/omahtiacademy"
                  }
                  value={proofLink}
                  onChange={(e) => setProofLink(e.target.value)}
                  className="w-full placeholder-neutral-400 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg font-semibold cursor-pointer bg-primary-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting || availability <= 0}
              >
                {isSubmitting ? "Mengirim data..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
