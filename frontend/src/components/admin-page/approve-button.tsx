"use client";
import React, { useState } from "react";
import { Pocket, Check } from "lucide-react";

interface ApproveButtonProps {
  paymentId: string;
}

const ApproveButton = ({ paymentId }: ApproveButtonProps) => {
  const [approved, setApproved] = useState(false);

  const handleClick = async () => {
    try {
      const res = await fetch("/api/approve", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        alert("Gagal mengkonfirmasi pembayaran: " + error);
        return;
      }

      setApproved(true); 
      alert("Pembayaran berhasil dikonfirmasi!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    }
  };

  if (approved) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 bg-green-600 rounded-sm">
        <Check className="text-neutral-50" />
        <p className="text-neutral-50">Approved</p>
      </div>
    );
  }

  return (
    <button
      className="flex items-center gap-2 px-2 py-1 bg-orange-500 rounded-sm cursor-pointer"
      onClick={handleClick}
    >
      <Pocket className="text-neutral-50" />
      <p className="text-neutral-50">Paid</p>
    </button>
  );
};

export default ApproveButton;
