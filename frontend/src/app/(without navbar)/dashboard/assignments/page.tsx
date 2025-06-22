export const dynamic = 'force-dynamic';
import React from "react";
import { Lock } from "lucide-react";
const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-40 gap-2">
      <div className="flex gap-3 items-center">
        <Lock className=""/>
        <p className="font-bold text-2xl">Halaman Ini Masih Terkunci</p>
      </div>
      <p>
        Kamu belum bisa mengakses konten ini. Pastikan kamu sudah menyelesaikan
        langkah atau tugas sebelumnya, ya!
      </p>
    </div>
  );
};

export default page;
