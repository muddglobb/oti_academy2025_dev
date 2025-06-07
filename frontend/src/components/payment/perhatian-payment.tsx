// "use client";

// import React, { useEffect, useState } from "react";
// import { AlertCircle } from "lucide-react";
// import Link from "next/link";

// export default function PerhatianPayment() {
//   const [showPopup, setShowPopup] = useState(false);

//   // Tampilkan popup saat halaman pertama kali dimuat
//   useEffect(() => {
//     setShowPopup(true);
//   }, []);

//   const handleClose = () => {
//     setShowPopup(false);
//   };

//   return (
//     <>
//       {showPopup && (
//         <div className="fixed inset-0 bg-neutral-900/70 z-50 flex items-center justify-center">
//           <div className="bg-neutral-700 rounded-[20px] p-6 max-w-1/2 w-full border-2 border-neutral-500">
//             <div className="flex items-center gap-2 pb-3 border-b-2 border-neutral-500">
//               <AlertCircle />
//               <h2 className="text-xl font-bold">Perhatian</h2>
//             </div>
//             <div className="text-[12px] pt-3">
//               <div className="flex gap-2 items-start">
//                 <div className="w-4 h-4 bg-primary-500 rounded-[4px]">1</div>
//                 <p>
//                   Bukti transfer kamu lagi kami cek, ya. Mohon tunggu maksimal
//                   2x24 jam.
//                 </p>
//               </div>

//               <div className="flex gap-2 items-start">
//                 <div className="w-4 h-4 bg-primary-500 rounded-[4px]">2</div>
//                 <p>
//                   Silakan <strong>konfirmasi ke WhatsApp</strong> kami, setelah
//                   melakukan pendaftaran, ya.
//                 </p>
//               </div>

//               <div className="flex gap-2 items-start">
//                 <div className="w-4 h-4 bg-primary-500 rounded-[4px]">3</div>
//                 <p>
//                   Kalau lewat 2x24 jam belum ada kabar, silakan hubungi tim kami
//                   via Get <strong>Help Contact</strong>.
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-2 pt-3 justify-end">
//               <Link
//                 href="/dashboard"
//                 className="px-4 py-2 bg-primary-500 text-white rounded-sm cursor-pointer text-center"
//                 onClick={handleClose}
//               >
//                 Mengerti
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );


// }
"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PerhatianPayment({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/70 z-50 flex items-center justify-center">
      <div className="bg-neutral-700 rounded-[20px] p-6 w-140 sm:w-160 border-2 border-neutral-500 mx-3 sm:mx-6 md:mx-10 lg:mx-40 xl:mx-60">
        <div className="flex items-center gap-2 pb-3 border-b-2 border-neutral-500">
          <AlertCircle />
          <h2 className="text-xl font-bold">Pembayaran Berhasil!</h2>
        </div>
        <div className="text-[12px] pt-3">
          <div className="flex gap-2 items-start text-[12px]">
            <div className="w-4 h-4 bg-primary-500 rounded-[4px] text-center text-white">
              1
            </div>
            <p>
              Bukti transfer kamu lagi kami cek, ya. Mohon tunggu maksimal
              2x24 jam.
            </p>
          </div>

          <div className="flex gap-2 items-start mt-2">
            <div className="w-4 h-4 bg-primary-500 rounded-[4px] text-center text-white">
              2
            </div>
            <p>
              Silakan <strong>konfirmasi ke WhatsApp</strong> kami, setelah
              melakukan pendaftaran, ya.
            </p>
          </div>

          <div className="flex gap-2 items-start mt-2">
            <div className="w-4 h-4 bg-primary-500 rounded-[4px] text-center text-white">
              3
            </div>
            <p>
              Kalau lewat 2x24 jam belum ada kabar, silakan hubungi tim kami via{" "}
              <strong>Get Help Contact</strong>.
            </p>
          </div>
        </div>
        <div className="flex gap-2 pt-8 justify-end">
          <Link
            href="/dashboard"
            className="px-4 py-2 w-36 sm:w-44 bg-primary-700 text-white rounded-sm cursor-pointer text-center"
            onClick={onClose}
          >
            Mengerti
          </Link>

          <Link
            href="https://api.whatsapp.com/send?phone=6285797472200&text=halo%20kak%2C%20saya%20[nama]%20baru%20saja%20melakukan%20pembayaran%20OmahTI%20Academy%20untuk%20kelas%20[kelas%20kamu]"
            className="px-4 py-2 w-36 sm:w-44 bg-primary-500 text-white rounded-sm cursor-pointer text-center"
            onClick={onClose}
          >
            Konfirmasi
          </Link>
        </div>
      </div>
    </div>
  );
}
