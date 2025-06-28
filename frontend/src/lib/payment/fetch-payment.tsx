import { getAccessToken } from "../auth/fetch-users";


export async function enrollNoBundle({
  courseId,
  packageId,
  type,
  proofLink,
}: {
  courseId: string;
  packageId: string;
  type: string;
  proofLink: string;
}) {
  try {
    const accessToken = await getAccessToken();
    
    const res = await fetch(`${process.env.BASE_URL}/payments/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId,
        packageId,
        type,
        proofLink,
      }),
    });

    // console.log(payload);

    if (!res.ok) {
      const err = await res.text();
      console.error("Gagal membuat pembayaran:", err);
      throw new Error("Gagal membuat pembayaran.");
    }

    const result = await res.json();
    return result;
    // console.log("BERHASIL");
  } catch (error) {
    console.error("Terjadi kesalahan saat melakukan pembayaran:", error);
    throw error;
  }
}

export async function enrollBundle({
  packageId,
  type,
  proofLink,
}: {
  packageId: string;
  type: string;
  proofLink: string;
}) {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(`${process.env.BASE_URL}/payments/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packageId,
        type,
        proofLink,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gagal membuat pembayaran:", err);
      throw new Error("Gagal membuat pembayaran.");
    }
    
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Terjadi kesalahan saat melakukan pembayaran:", error);
    throw error;
  }
}

export async function getMyPayments() {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(`${process.env.BASE_URL}/payments/my-payments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gagal mengambil data pembayaran:", err);
      throw new Error("Gagal mengambil data pembayaran.");
    }
    
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data:", error);
    throw error;
  }
}

// ADMIN
export async function getAllEnrolledStats() {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${process.env.BASE_URL}/payments/all-stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan data enroll ANJINGG:", res.statusText);
      throw new Error("Gagal memuat data enroll.");
    }

    const stats = await res.json();
    // console.log(stats)
    return stats;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data enroll:", error);
    throw error;
  }
}

export async function getAllEnrollment() {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${process.env.BASE_URL}/payments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan data enroll ANJINGG:", res.statusText);
      throw new Error("Gagal memuat data enroll.");
    }

    const stats = await res.json();
    // console.log(stats)
    return stats.data.payments;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data enroll:", error);
    throw error;
  }
}

export async function getPendingEnrollment() {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${process.env.BASE_URL}/payments/pending`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan data pending enroll:", res.statusText);
      throw new Error("Gagal memuat data pending enroll.");
    }

    const stats = await res.json();
    // console.log(stats)
    return stats.data;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data pending enroll:", error);
    throw error;
  }
}

export async function approvePayment({paymentId}: {paymentId : string}) {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(`${process.env.BASE_URL}/payments/${paymentId}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gagal aprrove pembayaran:", err);
      throw new Error("Gagal approve pembayaran.");
    }
    
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Terjadi kesalahan aprrove pembayaran:", error);
    throw error;
  }
}

