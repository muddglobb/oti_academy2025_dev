"use client";
import React, { useState } from "react";
import {
  ArrowUpRight,
  CircleAlert,
  Mail,
  Minus,
  Plus,
  PlusIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  getDescByTitle,
  getImageByTitle,
} from "@/lib/course-props/course-props";
import Konfirmasi from "@/components/payment/konfirmasi";

type CourseSummary = {
  id: string;
  title: string;
};

const ChooseClassGroup = ({
  myEmail,
  CourseOptions,
}: {
  myEmail: string;
  CourseOptions: CourseSummary[];
}) => {
  const [participants, setParticipants] = useState([
    { email: myEmail, selectedClassId: "", selectedClassTitle: "" },
  ]);
  const [showClassOptionsIndex, setShowClassOptionsIndex] = useState<
    number | null
  >(null);

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      { email: "", selectedClassId: "", selectedClassTitle: "" },
    ]);
  };

  const handleRemoveClass = (index: number) => {
    const updated = [...participants];
    updated[index].selectedClassId = "";
    updated[index].selectedClassTitle = "";
    setParticipants(updated);
  };

  const handleClassSelect = (index: number, id: string, title: string) => {
    const updated = [...participants];
    updated[index].selectedClassId = id;
    updated[index].selectedClassTitle = title;
    setParticipants(updated);
    setShowClassOptionsIndex(null);
  };

  const handleChangeEmail = (index: number, email: string) => {
    const updated = [...participants];
    updated[index].email = email;
    setParticipants(updated);
  };

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ [index: number]: string }>({});
  const [messageTypes, setMessageTypes] = useState<{
    [index: number]: "success" | "error";
  }>({});

  const checkEmail = async (email: string, index: number) => {
    if (!email) {
      setMessages((prev) => ({ ...prev, [index]: "Email tidak boleh kosong" }));
      setMessageTypes((prev) => ({ ...prev, [index]: "error" }));
      return;
    }

    setLoadingIndex(index);
    setMessages((prev) => ({ ...prev, [index]: "" }));

    try {
      const res = await fetch("/api/group-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: [email] }),
      });

      const result = await res.json();

      if (!res.ok || result.status === "error") {
        // Jika gagal dari server
        setMessages((prev) => ({
          ...prev,
          [index]:
            result.message || "Gagal verifikasi email, format tidak sesuai.",
        }));
        setMessageTypes((prev) => ({ ...prev, [index]: "error" }));
      } else {
        const data = result.data;

        if (data.invalidEmails && data.invalidEmails.length > 0) {
          setMessages((prev) => ({
            ...prev,
            [index]: "User tidak ditemukan, pastikan user sudah membuat akun",
          }));
          setMessageTypes((prev) => ({ ...prev, [index]: "error" }));
        } else if (
          data.usersWithIntermediateEnrollment &&
          data.usersWithIntermediateEnrollment.length > 0
        ) {
          setMessages((prev) => ({
            ...prev,
            [index]:
              "Peserta yang Anda undang sudah mendaftar kelas intermediate",
          }));
          setMessageTypes((prev) => ({ ...prev, [index]: "error" }));
        } else {
          setMessages((prev) => ({
            ...prev,
            [index]: "Dapat mengundang user",
          }));
          setMessageTypes((prev) => ({ ...prev, [index]: "success" }));
        }
      }
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [index]: "Gagal terhubung ke server.",
      }));
      setMessageTypes((prev) => ({ ...prev, [index]: "error" }));
    } finally {
      setLoadingIndex(null);
    }
  };

  console.log("participants", participants);

  const formattedParticipants = participants.map((peserta) => ({
    email: peserta.email,
    courseId: peserta.selectedClassId,
  }));
  // console.log("formattedParticipants", formattedParticipants);

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="flex flex-col gap-6 xl:w-240">
        <Konfirmasi />
        <div className="flex flex-col border-2 border-neutral-500 rounded-[20px] p-4">
          <div className="w-full">
            <p className="text-lg font-bold">Chosen Class</p>
            <div className="flex items-center gap-2 pb-3 border-b-3 border-neutral-500">
              <CircleAlert />
              <p>
                Kamu hanya dapat daftar 1 kelas per orang, pastikan temanmu
                sudah membuat akun!
              </p>
            </div>
          </div>

          {participants.map((peserta, index) => (
            <div key={index} className="items-center justify-between pt-3 pb-3">
              <div className="flex flex-col gap-2">
                {/* email */}
                {index === 0 ? (
                  <p>{peserta.email}</p>
                ) : (
                  <div>
                    <p className="text-sm">Peserta {index + 1}</p>

                    <div className="flex items-center justify-between">
                      <div className="w-100 rounded-[8px] border border-neutral-400 bg-neutral-50 flex items-center gap-2 px-3 py-2">
                        <Mail className="w-5 h-5 text-neutral-400" />
                        <input
                          type="email"
                          value={peserta.email}
                          onChange={(e) =>
                            handleChangeEmail(index, e.target.value)
                          }
                          placeholder="omahtiacademy@gmail.com"
                          className="w-full bg-transparent outline-none placeholder-neutral-400 text-neutral-900"
                          required
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => checkEmail(peserta.email, index)}
                        disabled={loadingIndex === index}
                        className={`w-44 px-3 py-2 font-bold rounded-[8px] cursor-pointer transition ${
                          loadingIndex === index
                            ? "bg-neutral-500"
                            : "bg-primary-500"
                        }`}
                      >
                        {loadingIndex === index ? "Checking..." : "Check Email"}
                      </button>
                    </div>

                    {messages[index] && (
                      <p
                        className={`mt-2 text-sm ${
                          messageTypes[index] === "success"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {messages[index]}
                      </p>
                    )}
                  </div>
                )}

                {!peserta.selectedClassId &&
                  showClassOptionsIndex !== index && (
                    <button
                      type="button"
                      onClick={() => setShowClassOptionsIndex(index)}
                      className="h-38 sm:h-50 w-auto border-2 border-neutral-500 rounded-xl flex cursor-pointer"
                    >
                      <Image
                        src="/images/kotak-abu.webp"
                        alt="Placeholder Image"
                        width={152}
                        height={152}
                        className="rounded-l-md sm:w-[200px] sm:h-[200px] object-cover"
                      />
                      <div className="p-2 sm:p-4 w-full flex justify-between">
                        <p className="text-[14px] sm:text-[18px] font-bold">
                          Pilih kelas
                        </p>
                        <div>
                          <div className="p-1 bg-primary-500 rounded-sm cursor-pointer">
                            <ArrowUpRight />
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                {showClassOptionsIndex === index && (
                  <div className="fixed inset-0 bg-neutral-900/70 bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-neutral-700 p-5 rounded-xl w-full mx-20 border-2 border-neutral-500">
                      <div className="pb-3 border-b-2 border-neutral-500 mb-3 flex items-center justify-between">
                        <p className="text-lg font-bold ">Intermediate Class</p>
                        <button
                          type="button"
                          onClick={() => setShowClassOptionsIndex(null)}
                          className="text-sm cursor-pointer"
                        >
                          <X />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {CourseOptions.map((kelas) => (
                          <button
                            key={kelas.id}
                            type="button"
                            onClick={() =>
                              handleClassSelect(index, kelas.id, kelas.title)
                            }
                            className="h-38 sm:h-50 bg-neutral-50 w-auto border-2 border-neutral-500 rounded-xl flex"
                          >
                            <Image
                              src={getImageByTitle(kelas.title)}
                              alt={`Image ${kelas.title}`}
                              width={152}
                              height={152}
                              className="rounded-l-md sm:w-[200px] sm:h-[200px] object-cover"
                            />
                            <div className="p-2 sm:p-4 w-full text-neutral-900">
                              <div className="flex justify-between items-center">
                                <p className="font-bold text-[14px]">
                                  {kelas.title}
                                </p>
                                <div className="text-neutral-50 p-1 bg-primary-500 rounded-sm">
                                  <Plus />
                                </div>
                              </div>
                              <p className="text-sm text-justify line-clamp-6">
                                {getDescByTitle(kelas.title)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {peserta.selectedClassId && (
                  <div className="h-38 sm:h-50 w-auto bg-neutral-50 text-neutral-900 rounded-md flex">
                    <Image
                      src={getImageByTitle(peserta.selectedClassTitle)}
                      alt={`Image ${peserta.selectedClassTitle}`}
                      width={152}
                      height={152}
                      className="rounded-l-md sm:w-[200px] sm:h-[200px] object-cover"
                    />
                    <div className="p-2 sm:p-4 w-auto">
                      <div className="flex items-center justify-between">
                        <p className="text-[14px] sm:text-[18px] font-bold">
                          {peserta.selectedClassTitle}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveClass(index)}
                          className="p-1 bg-primary-500 rounded-sm cursor-pointer text-neutral-50"
                        >
                          <Minus />
                        </button>
                      </div>
                      <p className="line-clamp-2 sm:line-clamp-5 text-[12px] sm:text-base">
                        {getDescByTitle(peserta.selectedClassTitle)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {participants.length === 1 && (
            <button
              type="button"
              onClick={handleAddParticipant}
              className="w-full mt-3 py-2 px-3 text-primary-500 border-2 border-primary-500 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusIcon />
              <p>Tambah Peserta</p>
            </button>
          )}
        </div>
      </div>

      {/* bagian receipt dan bukti pembayaran */}
      <div className="w-full xl:w-2/5 flex flex-col gap-6">
        {/* receipt */}
        <div className="w-full border-3 border-neutral-500 rounded-[20px] p-4">
          <p className="text-lg font-bold pb-3 border-b-3 border-neutral-500">
            Pembayaran
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-2xl pt-3">BNI 1878490384</p>
            <p className="text-lg">a/n Gracella Wiendy Koesnadi</p>
          </div>
          <p className="text-lg font-bold pb-3 pt-10 border-b-3 border-neutral-500">
            Total
          </p>
          {/* border-b-3 border-neutral-500 pb-3 */}
          <div className="border-b-3 border-neutral-500 pb-3">
            <p className="mt-3 text-lg">Intermediate Package</p>
            <div className="flex justify-between mt-2 ">
              <p>Kelas Pertama</p>
              <p>Rp81.000,-</p>
            </div>
            {participants.length === 2 &&
              participants[1]?.selectedClassId !== "" && (
                <div className="flex justify-between mt-2">
                  <p>Kelas Kedua</p>
                  <p>Rp81.000,-</p>
                </div>
              )}
          </div>

          {participants.length === 2 &&
          participants[1]?.selectedClassId !== "" ? (
            <p className="mt-3 text-end">Rp162.000 ,-</p>
          ) : (
            <p className="mt-3 text-end">Rp81.000 ,-</p>
          )}
        </div>

        {/* bukti bayar */}
        
      </div>
    </div>
  );
};

export default ChooseClassGroup;
