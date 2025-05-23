import React from "react";
import { CircleAlert } from "lucide-react";
import { Link } from "lucide-react";

export async function BuktiPembayaran({courseId, packageId}: any) {
  return (
    <div className="rounded-xl border-3 border-neutral-500">
      {/* Welcome Card */}
      <div
        className="w-full flex justify-between relative border-neutral-500 rounded-xl"
        style={{
          backgroundImage: 'url("/images/stars-hero-programs.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay */}
        {/* Overlay gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[var(--color-primary-300)] opacity-50 rounded-xl" />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent rounded-xl" />

          <div className="absolute inset-0 bg-gradient-to-l from-neutral-900 to-transparent rounded-xl" />
        </div>

        {/* Konten */}
        <div className="p-4 z-10 w-full flex flex-col gap-3">
          <div className="border-b-3 border-neutral-500 w-full">
            <p className="text-lg font-bold">Bukti Pembayaran</p>
            <div className="w-full flex gap-2">
              <CircleAlert className="w-6 h-6 shrink-0" />
              <p className="pb-3">Upload bukti melalui link Google Drive</p>
            </div>
          </div>

          <form action="" className="w-full flex flex-col gap-3">
            <div className="bg-neutral-50 flex items-center gap-2 py-2 px-3 rounded-lg text-black">
              <Link className="w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="https://drive.google.com/omahtiacademy"
                name=""
                id=""
                className="w-full placeholder-neutral-400"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-3 rounded-lg font-semibold cursor-pointer bg-primary-500 text-white`}
            >
              Submit
            </button>
          </form>

          {/* {courseId ? `${courseId}` : 'ga ada'} */}
          
          {/* {packageId} */}
        </div>
      </div>
    </div>
  );
}

// export default WelcomeCard
