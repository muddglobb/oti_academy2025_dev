"use client";

import React, { useState } from "react";
import { Search, Check, Trash2 } from "lucide-react";
import ApproveButton from "./approve-button";
import DeletePopup from "./delete-popup";

export type EnrichedEnrollmentPayment = {
  id: string;
  userId: string;
  packageId: string;
  courseId: string;
  type: string;
  proofLink: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  packageName: string;
  packageType: string;
  price: number;
  courseName: string;
  userName: string;
  userEmail: string;
  userType: string;
  userPhone: string;
  courseTitle: string; // properti tambahan yang tidak ada di response awal
};


const GetAllEnrollmentsClient = ({ data }: { data: EnrichedEnrollmentPayment[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleDelete = (id: string, name:string, course:string) => {
    setSelectedId(id);
    setSelectedName(name);
    setSelectedCourse(course);
    setShowPopup(true);
  };
  // console.log(data);

  const filteredData = data.filter((item) =>
    item.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-neutral-50 p-5 rounded-[20px] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            Data Semua Pendaftar
          </h2>
          <span className="bg-neutral-300 text-sm px-2 py-1 rounded-sm">
            {filteredData.length} Peserta
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-sm"
            />
            <Search className="absolute left-2 top-2.5 text-gray-500" size={18} />
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada pendaftar</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">Email</th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">Nama</th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">Kelas</th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">Bukti Transfer</th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item: EnrichedEnrollmentPayment, index: number) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-neutral-50" : "bg-neutral-100"
                  }`}
                >
                  <td className="py-4 px-4 text-gray-900 font-medium">
                    {item.userEmail}
                  </td>
                  <td className="py-4 px-4 text-gray-900">{item.userName}</td>
                  <td className="py-4 px-4 text-gray-900">
                    {item.courseTitle}
                  </td>
                  <td className="py-4 px-4">
                    <a
                      href={item.proofLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="py-1 bg-neutral-200 rounded-sm cursor-pointer w-full">
                        Link
                      </button>
                    </a>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {item.status === "APPROVED" ? (
                        <div className="flex items-center gap-2 px-2 py-1 bg-green-600 rounded-sm">
                          <Check className="text-neutral-50" />
                          <p className="text-neutral-50">Approved</p>
                        </div>
                      ) : (
                        <ApproveButton paymentId={item.id} />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {item.status !== "APPROVED" &&
                      <button
                        className="p-2 hover:bg-red-100 rounded-md transition"
                        onClick={() => handleDelete(item.id, item.userName, item.courseTitle)}
                      >
                        <Trash2 className="text-red-500" size={18} />
                      </button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showPopup && selectedId && (
            <DeletePopup
              paymentId={selectedId}
              username={selectedName}
              course={selectedCourse}
              onClose={() => {
                setShowPopup(false);
                setSelectedId(null);
                setSelectedName("");
                setSelectedCourse("");
              }}
            />
          )}
        </div>

      )}
    </div>
  );
};

export default GetAllEnrollmentsClient;
