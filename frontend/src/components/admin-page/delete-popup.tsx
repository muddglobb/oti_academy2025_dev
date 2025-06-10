// components/delete-popup.tsx
"use client";

import React, { useState } from "react";

type Props = {
  paymentId: string;
  username: string;
  course: string;
  onClose: () => void;
};

const DeletePopup: React.FC<Props> = ({ paymentId, username, course, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/delete/${paymentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus.");
      }

      onClose(); // Tutup popup
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-red-600">Hapus Pembayaran?</h2>
        <p className="text-sm text-gray-700 mb-4">
          Apakah kamu yakin ingin menghapus data pembayaran milik <span className="font-bold">{username}</span> pada kelas <span className="font-bold">{course}</span>?
        </p>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-neutral-200 hover:bg-neutral-300"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
