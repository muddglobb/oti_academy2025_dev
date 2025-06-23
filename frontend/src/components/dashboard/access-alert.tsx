import React from "react";
import Image from "next/image";

const AccessAlert = () => {
  return (
    <div className="bg-primary-700 p-[10px] rounded-sm flex flex-row gap-[10px] items-center">
      <Image
        src={"/icons/white-alert-icon.svg"}
        alt="alert"
        width={18}
        height={18}
      ></Image>
      <p className="text-xs">
        Akses Zoom/materi akan dibuka tepat saat sesi berlangsung!
      </p>
    </div>
  );
};

export default AccessAlert;
