"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Lock, ArrowLeft, Eye, EyeOff } from 'react-feather';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

interface FormData {
  password: string;
  confirmPassword: string;
}

export default function Change() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefillVisible, setIsRefillVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSubmittedWithError, setHasSubmittedWithError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
      register,
      handleSubmit,
      control,
      watch,
      formState: { errors },
    } = useForm<FormData>();

  const password = watch('password');
  const formValues = useWatch({ control });

  useEffect(() => {
    if (hasSubmittedWithError) {
      setErrorMessage(null);      
      setHasSubmittedWithError(false);  
      setLoading(false);             
    }
  }, [formValues]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
  if (data.password !== data.confirmPassword) {
    setErrorMessage("Password dan konfirmasi password tidak cocok.");
    return;
  }

  if (!token) {
    setErrorMessage("Token tidak ditemukan di URL.");
    return;
  }

  try {
    setLoading(true);
    setErrorMessage(null);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token,
        password: data.password,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Gagal reset password.");
    }

    router.push("/login");
  } catch (error: unknown) {
    if (error instanceof Error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage("Terjadi kesalahan saat reset password.");
    }
    setHasSubmittedWithError(true);
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
        <Image src="/images/bulan-login.png" alt="bulan" width={200} height={100} className= "w-32 sm:w-37 md:w-45"/>
      </div>
      <div className="absolute opacity-85 bottom-0 left-0 right-0 z-10 h-full w-full flex">
        <Image src="/images/shadow-login.png" alt="shadow" width={1920} height={150} className="h-auto object-cover object-bottom"   />
      </div>
      </div>

      <Link href="/" className="absolute top-10 left-5 sm:left-7 md:left-12 text-xs font-bold text-white bg-blue-950 px-3 py-2 rounded-md z-50 hover:bg-blue-800 flex item-center">
      <ArrowLeft className="h-4 w-4 mr-1.5" size={20}/>
      Kembali</Link>

      <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="p-20 rounded-md shadow-lg max-h-[110vh] overflow-hidden">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 mt-5 text-center">Ganti Password</h1>

        {errorMessage && (
            <div className="mb-4 text-red-500 text-center font-semibold">
              {errorMessage}
            </div>
          )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-[140%] transform translate-x-[-15%] text-xs sm:text-xs md:text-sm">

        <div className="relative">
          <h2 className="font-bold mb-1 mt-3">New Password</h2>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id="new-password"
            placeholder="omahtiacademy"
            {...register("password", {
              required: "Password wajib diisi",
              pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{}|\\;',./:<>?`~"-]{8,}$/,
              message: "Password minimal 8 karakter dan mengandung angka",
              },
            })}
            className="w-full bg-white text-black border-3 rounded-md px-10 py-2"
          />
          <div>
            <Lock className={`absolute left-3
            ${errors.password
              ? 'top-[51%] -translate-y-[45%] text-gray-600'
              : 'top-[65%] -translate-y-[45%] text-gray-600'
            }
            h-4 w-4`} size={20} />
          </div>
          <div
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            {isPasswordVisible ? <EyeOff className={`absolute right-3
            ${errors.password
              ? 'top-[51%] -translate-y-[45%] text-gray-600'
              : 'top-[65%] -translate-y-[45%] text-gray-600'
            }
            h-4 w-4 cursor-pointer`} size={18} /> : <Eye className={`absolute right-3
              ${errors.password
                ? 'top-[51%] -translate-y-[45%] text-gray-600'
                : 'top-[65%] -translate-y-[45%] text-gray-600'
              }
              h-4 w-4 cursor-pointer`} size={18} />}
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="relative">
          <h2 className="font-bold mb-1 mt-3">Refill New Password</h2>
          <input
            type={isRefillVisible ? 'text' : 'password'}
            id="refill"
            placeholder="omahtiacademy"
            {...register("confirmPassword", {
              required: "Konfirmasi password wajib diisi",
              validate: (value) => value === password || "Konfirmasi password tidak cocok",
            })}
            className="w-full bg-white text-black border-3 rounded-md px-10 py-2"
          />
          <div>
            <Lock className={`absolute left-3
            ${errors.confirmPassword
              ? 'top-[51%] -translate-y-[45%] text-gray-600'
              : 'top-[65%] -translate-y-[45%] text-gray-600'
            }
            h-4 w-4`} size={20} />
          </div>
          <div
            onClick={() => setIsRefillVisible(!isRefillVisible)}>
            {isRefillVisible ? <EyeOff className={`absolute right-3
            ${errors.confirmPassword
              ? 'top-[51%] -translate-y-[45%] text-gray-600'
              : 'top-[65%] -translate-y-[45%] text-gray-600'
            }
            h-4 w-4 cursor-pointer`} size={18} /> : <Eye className={`absolute right-3
              ${errors.confirmPassword
                ? 'top-[51%] -translate-y-[45%] text-gray-600'
                : 'top-[65%] -translate-y-[45%] text-gray-600'
              }
              h-4 w-4 cursor-pointer`} size={18} />}
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

          <button
          type="submit"
          className={`w-full py-2 rounded-md font-semibold mt-2 cursor-pointer ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-800'
            }`}
            disabled={loading}>
            Submit
          </button>
        </form>
      </div>
    </div>

    </div>
  );
}
