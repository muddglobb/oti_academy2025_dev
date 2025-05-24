import React from "react";
import { CircleAlert } from "lucide-react";

const Konfirmasi = () => {
  return (
    <div className="flex border-3 justify-between border-neutral-500 rounded-xl p-4">
      <div className="flex gap-2 w-2/3">
        <CircleAlert className="w-6 h-6 shrink-0"/>
        <p className="text-wraper">
          Perubahan kelas tidak dapat dilakukan setelah pembayaran dilakukan!
          Sudah isi formulir? Langsung konfirmasi ke WA (Nazwa) ini ya!
        </p>
      </div>
      <a href="https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/">
        <button className="bg-primary-500 px-3 py-2 rounded-[8px] cursor-pointer">
          Konfirmasi ke sini
        </button>
      </a>
    </div>
  );
};

export default Konfirmasi;
