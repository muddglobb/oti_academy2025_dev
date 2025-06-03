"use client";

import React, { useState } from "react";
import { ListFilter, Search, Check, Trash2 } from "lucide-react";
import ApproveButton from "./approve-button";

const GetAllEnrollmentsClient = ({ data }: { data: any[] }) => {
  const [searchTerm, setSearchTerm] = useState("");

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
              {filteredData.map((item: any, index: number) => (
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
                      <button className="w-25 py-1 bg-neutral-200 rounded-sm cursor-pointer">
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
                    <button
                      className="p-2 hover:bg-red-100 rounded-md transition"
                      onClick={() => {
                        // Tambahkan fungsi delete di sini nanti
                        console.log("Delete ID:", item.id);
                      }}
                    >
                      <Trash2 className="text-red-500" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetAllEnrollmentsClient;
