"use client";
import React, { useState } from "react";
import { Link } from "lucide-react";
import Asspopup from "./submit-pop-up";

const SubmitAss = ({
  id,
  assLink,
  subId,
  show,
}: {
  id: string;
  assLink: string;
  subId: string;
  show: boolean;
}) => {
  const [fileUrl, setSubmissionLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ new

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // clear old error
    setIsSubmitting(true);

    const payload = {
      fileUrl,
    };

    try {
      const res = await fetch(`/api/ass/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

  const handleSubmitzz = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // clear old error
    setIsSubmitting(true);

    const payload = {
      fileUrl,
    };

    try {
      const res = await fetch(`/api/edit-ass/${subId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
      {showPopup && (
        <Asspopup show={showPopup} onClose={() => setShowPopup(false)} />
      )}
      {assLink === "" && (
        <div className="mt-3">
          <p className="text-red-500">{errorMessage}</p>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <div className="bg-neutral-50 flex items-center gap-2 py-2 px-3 rounded-lg text-black">
              <Link className="w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder={
                  assLink === ""
                    ? "https://drive.google.com/omahtiacademy"
                    : `${assLink}`
                }
                value={fileUrl}
                onChange={(e) => setSubmissionLink(e.target.value)}
                className="w-full placeholder-neutral-400 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            {show && (
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg font-semibold cursor-pointer bg-primary-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim data..." : "Submit"}
              </button>
            )}
          </form>
        </div>
      )}
      {assLink !== "" && (
        <div className="mt-3">
          <p className="text-red-500">{errorMessage}</p>
          <form
            onSubmit={handleSubmitzz}
            className="w-full flex flex-col gap-3"
          >
            <div className="bg-neutral-50 flex items-center gap-2 py-2 px-3 rounded-lg text-black">
              <Link className="w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder={
                  assLink === ""
                    ? "https://drive.google.com/omahtiacademy"
                    : `${assLink}`
                }
                value={fileUrl}
                onChange={(e) => setSubmissionLink(e.target.value)}
                className="w-full placeholder-neutral-400 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            {show && (
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg font-semibold cursor-pointer bg-primary-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim data..." : "Submit New Submission"}
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default SubmitAss;
