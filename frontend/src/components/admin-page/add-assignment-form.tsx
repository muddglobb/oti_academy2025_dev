"use client";

import React, { useState } from "react";
import AddAssignmentPopUp from "./add-assignment-pop-up";

const AddAssignmentForm = ({ courseId }: { courseId: string }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const payload = {
      title,
      description,
      courseId,
      dueDate: new Date(dueDate).toISOString(),
      points: 100,
      resourceUrl,
    };

    try {
      const res = await fetch("/api/add-assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal mengirim tugas");
      }

      setShowPopup(true);
      setTitle("");
      setDescription("");
      setDueDate("");
      setResourceUrl("");
    } catch (err: any) {
      console.error("Error submit:", err);
      setMessage(`Gagal: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showPopup && (
        <AddAssignmentPopUp
          show={showPopup}
          // show={true}
          onClose={() => setShowPopup(false)}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-neutral-50 p-5 text-[14px] rounded-[20px]"
      >
        {/* Judul */}
        <p className="font-bold">Judul Tugas</p>
        <input
          type="text"
          placeholder="Web Aplikasi Sederhana"
          className="border border-neutral-300 w-full rounded-[8px] px-[14px] py-[10px] mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Deskripsi */}
        <p className="font-bold mt-4">Deskripsi Tugas</p>
        <textarea
          placeholder="Buatlah website sederhana menggunakan HTML, CSS, dan Java Script..."
          className="border border-neutral-300 w-full rounded-[8px] px-[14px] py-[10px] mt-1 h-40 placeholder:text-neutral-400 resize-y text-neutral-900"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Deadline */}
        <p className="font-bold mt-4">Deadline</p>
        <input
          type="datetime-local"
          className="border border-neutral-300 w-full rounded-[8px] px-[14px] py-[10px] mt-1"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        {/* Resource Link */}
        <p className="font-bold mt-4">Resource URL</p>
        <input
          type="url"
          placeholder="https://drive.google.com/..."
          className="border border-neutral-300 w-full rounded-[8px] px-[14px] py-[10px] mt-1"
          value={resourceUrl}
          onChange={(e) => setResourceUrl(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-2 px-3 mt-5 rounded-lg font-semibold cursor-pointer bg-primary-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mengirim..." : "Buat Tugas"}
        </button>

        {message !== "Tugas berhasil ditambahkan! 🎉" && (
          <p className="mt-3 text-sm text-center text-neutral-800">{message}</p>
        )}
        {/* {message === "Tugas berhasil ditambahkan! 🎉" &&(

      )} */}
      </form>
    </>
  );
};

export default AddAssignmentForm;
