import { getSubmission } from "@/lib/assignment/fetch-assignment";
import React from "react";

type Submission = {
  id: string;
  assignmentId: string;
  fileUrl: string;
  status: string;
  submittedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    phoneNumber?: string; // Tambahkan ini kalau nanti datanya muncul
  };
};
const ShowSubmission = async ({ courseId }: { courseId: string }) => {
  const response = await getSubmission(courseId);
  const data = response.data.submissions;
  // console.log(data)
  return (
    <div className="bg-neutral-50 mt-6 rounded-[20px] p-[20px]">
      <h2 className="text-lg font-bold mb-4">Daftar Submission</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm text-left border border-neutral-300">
          <thead>
            <tr className="bg-neutral-200 text-neutral-800">
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Nama</th>
              {/* <th className="px-4 py-2 border">No HP</th> */}
              <th className="px-4 py-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((submission: Submission) => (
              <tr key={submission.id} className="border-t">
                <td className="px-4 py-2 border">{submission.user.email}</td>
                <td className="px-4 py-2 border">{submission.user.name}</td>
                {/* <td className="px-4 py-2 border">
                  {submission.user.phoneNumber ?? "-"}
                </td> */}
                <td className="px-4 py-2 border">
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Lihat Submission
                  </a>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-neutral-500"
                >
                  Belum ada submission.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowSubmission;
