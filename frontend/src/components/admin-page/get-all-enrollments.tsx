import React from "react";
import { getAllEnrollment } from "@/lib/payment/fetch-payment";
import { getCoursesById } from "@/lib/courses/fetch-courses";
import { ListFilter, Search, Check } from "lucide-react";
import ApproveButton from "./approve-button";
import GetAllEnrollmentsClient from "./get-all-enrollments-client";

const GetAllEnrollments = async () => {
  const data = await getAllEnrollment();

  // Ambil semua detail course berdasarkan courseId dari masing-masing item
  const enrichedData = await Promise.all(
    data.map(async (item: any) => {
      if (item.packageType === "BUNDLE") {
        return {
          ...item,
          courseTitle: item.packageName || "Tanpa nama paket",
        };
      }

      const kelas = await getCoursesById(item.courseId);
      return {
        ...item,
        courseTitle: kelas?.data?.title || "Tidak diketahui",
      };
    })
  );

  return <GetAllEnrollmentsClient data={enrichedData} />;
  // return (
  //   <div className="bg-neutral-50 p-5 rounded-[20px] shadow-sm">
  //     <div className="flex items-center justify-between mb-6">
  //       <div className="flex items-center gap-3">
  //         <h2 className="text-xl font-bold text-gray-900">
  //           Data Semua Pendaftar
  //         </h2>
  //         <span className="bg-neutral-300 text-sm px-2 py-1 rounded-sm">
  //           {enrichedData.length} Peserta
  //         </span>
  //       </div>
  //       <div className="flex items-center gap-2">
  //         <button className="p-2 hover:bg-gray-100 rounded-lg">
  //           <ListFilter />
  //         </button>
  //         <button className="p-2 hover:bg-gray-100 rounded-lg">
  //           <Search />
  //         </button>
  //       </div>
  //     </div>

  //     {enrichedData.length === 0 ? (
  //       <div className="text-center py-12">
  //         <p className="text-gray-500 text-lg">Belum ada pendaftar</p>
  //       </div>
  //     ) : (
  //       <div className="overflow-x-auto">
  //         <table className="w-full">
  //           <thead>
  //             <tr className="border-b border-gray-200">
  //               <th className="text-left py-4 px-4 font-semibold text-neutral-900">
  //                 Email
  //               </th>
  //               <th className="text-left py-4 px-4 font-semibold text-neutral-900">
  //                 Nama
  //               </th>
  //               <th className="text-left py-4 px-4 font-semibold text-neutral-900">
  //                 Kelas
  //               </th>
  //               <th className="text-left py-4 px-4 font-semibold text-neural-900">
  //                 Bukti Transfer
  //               </th>
  //               <th className="text-left py-4 px-4 font-semibold text-neutral-900">
  //                 Status
  //               </th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {enrichedData.map((item: any, index: number) => (
  //               <tr
  //                 key={item.id}
  //                 className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
  //                   index % 2 === 0 ? "bg-neutral-50" : "bg-neutral-100"
  //                 }`}
  //               >
  //                 <td className="py-4 px-4 text-gray-900 font-medium">
  //                   {item.userEmail}
  //                 </td>
  //                 <td className="py-4 px-4 text-gray-900">{item.userName}</td>
  //                 <td className="py-4 px-4 text-gray-900">
  //                   {item.courseTitle}
  //                 </td>
  //                 <td className="py-4 px-4">
  //                   <a
  //                     href={item.proofLink}
  //                     target="_blank"
  //                     rel="noopener noreferrer"
  //                   >
  //                     <button className="w-25 py-1 bg-neutral-200 rounded-sm cursor-pointer">
  //                       Link
  //                     </button>
  //                   </a>
  //                 </td>
  //                 <td className="py-4 px-4">
  //                   <div className="flex items-center gap-2">
  //                     {item.status === "APPROVED" ? (
  //                       <div className="flex items-center gap-2 px-2 py-1 bg-green-600 rounded-sm">
  //                         <Check className="text-neutral-50" />
  //                         <p className="text-neutral-50">Approved</p>
  //                       </div>
  //                     ) : (
  //                       <ApproveButton paymentId={item.id} />
  //                     )}
  //                   </div>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default GetAllEnrollments;
