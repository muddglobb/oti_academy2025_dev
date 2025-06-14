import React from "react";
import Image from "next/image";

type AlertProps = {
  Desc: string;
};

const Alert = ({ Desc }: AlertProps) => {
  return (
    <div className="bg-transparent rounded-[20px] border-2 border-neutral-500 p-5 text-sm flex flex-row gap-2 mb-[19px]">
      <Image
        src={`/icons/white-alert-icon.svg`}
        width={21}
        height={21}
        alt="alert"
      ></Image>
      {Desc === "Alert Bundle" && (
        <p className="text-sm text-neutral-50">
          Setelah kamu daftar kelas bundle ini, nanti kelasnya akan
          <span className="font-bold"> otomatis terbagi jadi dua</span> agar
          kamu bisa fokus di tiap tahap.
        </p>
      )}
      {Desc === "Waiting For Approval" && (
        <p className="text-sm text-neutral-50">
          Pendaftaranmu sedang menunggu konfirmasi. Mohon ditunggu ya dan kamu
          juga bisa cek level lain yang masih tersedia!
        </p>
      )}
      {Desc === "Alert Same Class Level" && (
        <p className="text-sm text-neutral-50">
          Kamu udah ambil kelas di level ini, jadi pilih level lain, ya.
          Semangat ya belajarnya!
        </p>
      )}
    </div>
  );
};

export default Alert;
