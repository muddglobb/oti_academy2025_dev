import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function BackButton() {
  return (
    <Link href={"../programs"}>
      <button
        className="text-white ml-10 mb-12 bg-primary-800 flex flex-row px-4 py-2.5 rounded-lg"
        type="button"
      >
        <Image
          src={"/icons/backarrow-icon.svg"}
          alt="backarrow-icon"
          width={20}
          height={20}
        ></Image>
        <p>Kembali</p>
      </button>
    </Link>
  );
}
