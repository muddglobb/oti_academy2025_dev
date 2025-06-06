// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(_req: NextRequest) {
//   // void _req;
//   try {
//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("access_token")?.value;
//     const refreshToken = cookieStore.get("refresh_token")?.value;

//     cookieStore.delete("access_token");
//     cookieStore.delete("refresh_token");

//     if (refreshToken) {
//       try {
//         await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
//           method: "POST",
//           credentials: "include",
//           // headers: {
//           //   // "Content-Type": "application/json",
//           //   Authorization: `Bearer ${accessToken}`,
//           //   // ...(refreshToken && {
//           //   //   Cookie: `refresh_token=${refreshToken}`,
//           //   // }),
//           // },
//           headers: {
//             Cookie: `refresh_token=${refreshToken}`, 
//           }
//           // body: `refresh_token=${refreshToken}`,
//         });
//       } catch (err) {
//         console.error("Gagal logout ke backend:", err);
//       }
//     }
//     // alert("berhasil logout");
//     return NextResponse.json({ message: "Logout success" });
//   } catch (err) {
//     console.error("Logout error:", err);
//     return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
//   }
// }


import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    // Panggil backend logout terlebih dahulu
    if (refreshToken) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Cookie: `refresh_token=${refreshToken}; access_token=${accessToken || ''}`,
          }
        });
        console.log("Backend logout berhasil");
      } catch (err) {
        console.error("Gagal logout ke backend:", err);
      }
    }

    // Buat response untuk menghapus cookie di browser
    const response = NextResponse.json({ message: "Logout success" });
    
    // Deteksi environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Cookie options untuk deletion
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0, // Set ke 0 untuk delete
      expires: new Date(0), // Set tanggal masa lalu
    };

    // Set cookie deletion headers - ini yang penting untuk browser
    response.cookies.set("access_token", "", cookieOptions);
    response.cookies.set("refresh_token", "", cookieOptions);

    // Hapus dari Next.js server-side cookie store
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    
    // Bahkan jika error, tetap coba hapus cookie
    const response = NextResponse.json({ error: "Failed to logout" }, { status: 500 });
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Set cookie deletion headers
    response.cookies.set("access_token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });
    
    response.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });
    
    return response;
  }
}
