import React from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'


const addAssignmentPopUp = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-neutral-900/70 z-50 flex items-center justify-center">
      <div className="bg-neutral-50 rounded-[20px] p-6 w-140 sm:w-160 border-2 border-neutral-500 mx-3 sm:mx-6 md:mx-10 lg:mx-40 xl:mx-60 flex justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle />
          <h2 className="text-xl font-bold">Tugas Berhasil dibuat!</h2>
        </div>
        <div className="flex pt-2">
          <Link
            href="/admin-page/assignment-admin-page"
            className="px-4 py-2 bg-primary-700 text-white rounded-sm cursor-pointer text-center"
            onClick={onClose}
          >
            Mengerti
          </Link>

        </div>
      </div>
    </div>
  )
}

export default addAssignmentPopUp