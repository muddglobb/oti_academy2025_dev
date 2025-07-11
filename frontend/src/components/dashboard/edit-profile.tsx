import React from "react";
import Image from "next/image";
import Link from "next/link";

const EditProfile = () => {
  return (
    <div className="bg-primary-700 rounded-sm p-[10px] flex flex-row gap-[10px] z-10 fixed bottom-4 md:bottom-6 max-md:left-1/2 transform max-md:-translate-x-1/2 md:right-5 w-78 md:w-100">
      <Image
        src={`/icons/white-alert-icon.svg`}
        alt="Alert"
        width={18}
        height={18}
      ></Image>
      <p className="text-xs">
        Masukkan nama untuk sertifikat kamu{" "}
        <Link href={`/dashboard/profile-page`}>
          <span className="underline">di sini!</span>
        </Link>
      </p>
    </div>
  );
};

export default EditProfile;
