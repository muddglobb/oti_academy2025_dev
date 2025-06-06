"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "react-feather";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // cookie HTTP-only
      });

      const data = await res.json(); // ambil pesan error
      // console.log(data.data.user.role);
      const ROLE = data.data.user.role;
      // console.log("RES", res)
      if (res.ok) {
        // console.log("CEKKKK" + res.headers);
        // console.log("Login berhasil!");\
        if(ROLE === "ADMIN") router.push("/admin-page");
        else router.push("/dashboard");
        return;
      }

      // const data = await res.json(); // ambil pesan error
      // console.log(data);
      if (data.message === "User not found") {
        setErrorMessage("Kamu belum punya akun. Silakan daftar terlebih dulu.");
      } else if (data.message === "Incorrect password") {
        setErrorMessage("Password salah. Coba lagi.");
      } else {
        setErrorMessage(data.message || "Login gagal.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white px-4 overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <Image
          src="/images/galaxy-login.jpg"
          alt="background programs"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute bottom-0 right-0 z-10 flex justify-center">
          <Image
            src="/images/bumi-login.png"
            alt="bumi"
            width={1050}
            height={1000}
          />
        </div>
        <div className="absolute bottom-10 left-0 z-10 flex justify-center transform translate-x-[-100%] sm:translate-x-[-40%] md:translate-x-[-30%] lg:translate-x-0">
          <Image
            src="/images/bulan-login.png"
            alt="bulan"
            width={200}
            height={100}
            className="w-32 sm:w-37 md:w-45"
          />
        </div>
        <div className="absolute opacity-85 bottom-0 left-0 right-0 z-10 h-full w-full flex">
          <Image
            src="/images/shadow-login.png"
            alt="shadow"
            width={1920}
            height={150}
            className="h-auto object-cover object-bottom"
          />
        </div>
      </div>

      <Link
        href="/"
        className="absolute top-10 left-5 sm:left-7 md:left-12 text-xs font-bold text-white bg-blue-950 px-3 py-2 rounded-md z-50 hover:bg-blue-800 flex item-center"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" size={20} />
        Kembali
      </Link>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="p-20 rounded-md shadow-lg max-h-[110vh] overflow-hidden">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 mt-5 text-center">
            Masuk OmahTI Academy
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 w-[140%] transform translate-x-[-15%] text-xs sm:text-xs md:text-sm"
          >
            <div className="relative">
              <h2 className="font-bold mb-1 mt-3">Email</h2>
              <input
                type="text"
                placeholder="omahtiacademy@gmail.com"
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: /^\S+@\S+$/i,
                })}
                className="w-full bg-white text-black border-3 rounded-md px-10 py-2"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message || "Format email tidak valid"}
                </p>
              )}
              <Mail
                className={`absolute left-3
            ${
              errors.email
                ? "top-[50%] -translate-y-[45%] text-gray-600"
                : "top-[66%] -translate-y-[45%] text-gray-600"
            }
            h-4 w-4`}
                size={20}
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mt-3">
                <h2 className="font-bold mb-1">Password</h2>
                <Link
                  href="/forgot-password"
                  className="text-xs text-white hover:underline mb-1.5 text-[11px]"
                >
                  Lupa Password?
                </Link>
              </div>
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="omahtiacademy"
                {...register("password", { required: "Password wajib diisi" })}
                className="w-full bg-white text-black border-3 rounded-md px-10 py-2"
              />
              <div>
                <Lock
                  className={`absolute left-3
            ${
              errors.email
                ? "top-[50%] -translate-y-[45%] text-gray-600"
                : "top-[65%] -translate-y-[45%] text-gray-600"
            }
            h-4 w-4`}
                  size={20}
                />
              </div>
              <div onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? (
                  <EyeOff
                    className={`absolute right-3
            ${
              errors.password
                ? "top-[50%] -translate-y-[45%] text-gray-600"
                : "top-[65%] -translate-y-[45%] text-gray-600"
            }
            h-4 w-4 cursor-pointer`}
                    size={18}
                  />
                ) : (
                  <Eye
                    className={`absolute right-3
              ${
                errors.password
                  ? "top-[50%] -translate-y-[45%] text-gray-600"
                  : "top-[65%] -translate-y-[45%] text-gray-600"
              }
              h-4 w-4 cursor-pointer`}
                    size={18}
                  />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-2 rounded-md font-semibold mt-2 cursor-pointer ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-800"
              }`}
              disabled={loading}
            >
              Submit
            </button>

            {errorMessage && (
              <p className="text-red-500 text-xs mt-3 text-center">
                {errorMessage}
              </p>
            )}

            <p className="text-center text-sm mt-4">
              Belum punya akun?{" "}
              <Link href="/register" className="text-white underline">
                Daftar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
