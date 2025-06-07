import React from "react";
import { CircleAlert } from "lucide-react";

const Konfirmasi = () => {
  return (
    <div className="flex flex-col sm:flex-row border-3 gap-3 sm:gap-0 justify-between border-neutral-500 rounded-xl p-4">
      <div className="flex gap-2 sm:w-2/3">
        <CircleAlert className="w-6 h-6 shrink-0" />
        <p className="text-wraper">
          Perubahan kelas tidak dapat dilakukan setelah pembayaran dilakukan!
          Sudah isi formulir? Langsung konfirmasi ke WA (Nazwa) ini ya!
        </p>
      </div>
      <div className="flex justify-end">
        <a href="https://api.whatsapp.com/send?phone=6285797472200&text=halo%20kak%2C%20saya%20[nama]%20baru%20saja%20melakukan%20pembayaran%20OmahTI%20Academy%20untuk%20kelas%20[kelas%20kamu]">
          <button className="bg-primary-500 px-3 py-2 rounded-[8px] cursor-pointer ">
            Konfirmasi ke sini
          </button>
        </a>
      </div>
    </div>
  );
};

export default Konfirmasi;
