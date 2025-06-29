import React from "react";
import Image from "next/image";
import Link from "next/link";

type PaymentHeaderProps = {
  isGroupPayment?: boolean;
};
export async function PaymentHeader({ isGroupPayment = false }: PaymentHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-neutral-900 flex justify-between items-center py-4 px-6 border-b border-gray-800">
      <div>
        <Link href={"/"}>
          <Image
            src="/images/logo/fulllogo_white.webp"
            alt="OmahTI Academy"
            width={160}
            height={50}
            className="w-32 h-auto"
          ></Image>
        </Link>
      </div>
      {isGroupPayment == true ? <p>Group Payment</p> : <p>Payment</p>}
    </header>
  );
}

// export default DashboardHeader;
