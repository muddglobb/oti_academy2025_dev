"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
//import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "react-feather";

interface FormData {
  email: string;
}

export default function Forgot() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  //const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch(`http://localhost:8000/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Email reset password telah dikirim!");
        // router.push("/auth/login");
      } else {
        setErrorMessage(data.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat mengirim permintaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white px-4 overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <Image src="/images/galaxy-login.jpg" alt="background programs" layout="fill" objectFit="cover" />
        <div className="absolute bottom-0 right-0 z-10 flex justify-center">
          <Image src="/images/bumi-login.png" alt="bumi" width={1050} height={1000} />
        </div>
        <div className="absolute bottom-10 left-0 z-10 flex justify-center transform translate-x-[-100%] sm:translate-x-[-40%] md:translate-x-[-30%] lg:translate-x-0">
          <Image src="/images/bulan-login.png" alt="bulan" width={200} height={100} className="w-32 sm:w-37 md:w-45" />
        </div>
        <div className="absolute opacity-85 bottom-0 left-0 right-0 z-10 h-full w-full flex">
          <Image src="/images/shadow-login.png" alt="shadow" width={1920} height={150} className="h-auto object-cover object-bottom" />
        </div>
      </div>

      <Link href="/" className="absolute top-10 left-5 sm:left-7 md:left-12 text-xs font-bold text-white bg-blue-950 px-3 py-2 rounded-md z-50 hover:bg-blue-800 flex items-center">
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Kembali
      </Link>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="p-20 rounded-md shadow-lg max-h-[110vh] overflow-hidden">
          <h1 className="text-lg sm:text-xl md:text-xl font-bold mb-4 mt-5 text-center">Lupa Passwordmu?</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-[150%] transform translate-x-[-16%] text-xs sm:text-xs md:text-sm">
            <div className="relative">
              <h2 className="font-bold mb-1 mt-3">Email</h2>
              <input
                type="email"
                placeholder="omahtiacademy@gmail.com"
                {...register("email", { required: "Email wajib diisi" })}
                className="w-full bg-white text-black border-3 rounded-md px-10 py-2"
              />
              <Mail className="absolute left-3 top-[67%] -translate-y-[45%] h-4 w-4 text-gray-600" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {errorMessage && (
              <div className="text-center text-xs text-red-500 mt-2">{errorMessage}</div>
            )}

            <button
              type="submit"
              className={`w-full py-2 rounded-md font-semibold mt-2 ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-800"
              }`}
              disabled={loading}
            >Submit</button>

            <p className="text-center text-sm mt-4">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-white underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
