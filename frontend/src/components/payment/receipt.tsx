import React from "react";

const Receipt = ({ name, prices, level }: {name: string | undefined, prices: number, level: string | undefined}) => {
  if (level === "ENTRY") level = "Entry";
  else if (level === "INTERMEDIATE") level = "Intermediate";
  else level = "Bundle";
  return (
    <div className="w-full border-3 border-neutral-500 rounded-[20px] p-4">
      <p className="text-lg font-bold pb-3 border-b-3 border-neutral-500">
        Pembayaran
      </p>
      <div className="flex flex-col gap-2">
        <p className="text-2xl pt-3">BNI 1878490384</p>
        <p className="text-lg">a/n Gracella Wiendy Koesnadi</p>
      </div>
      <p className="text-lg font-bold pb-3 pt-10 border-b-3 border-neutral-500">
        Total
      </p>

      <p className="mt-3 text-lg">{level} Package</p>
      <div className="flex justify-between mt-2 border-b-3 border-neutral-500 pb-3">
        <p>{name}</p>
        <p>Rp{prices},-</p>
      </div>

      <p className="mt-3 text-end">Rp{prices},-</p>
    </div>
  );
};

export default Receipt;
