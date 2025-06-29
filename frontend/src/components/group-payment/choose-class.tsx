"use client";
import React from "react";
import { ArrowUpRight, CircleAlert, Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import {
  getDescByTitle,
  getImageByTitle,
} from "@/lib/course-props/course-props";
import ChosenCardzz from "./group-choosen-card";
type CourseSummary = {
  id: string;
  title: string;
};

const CLASS_OPTIONS = [
  "Software Engineering",
  "UI/UX",
  "Cyber Security",
  "Data Science & Artificial Intelligence",
];
const ChooseClassGroup = ({ myEmail, CourseOptions }: { myEmail: string, CourseOptions: CourseSummary[] }) => {
  const [showClassOptions, setShowClassOptions] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedClassTitle, setSelectedClassTitle] = useState("");

  const handleResetClass = () => {
    setSelectedClassId("");
    setSelectedClassTitle("");
    setShowClassOptions(false);
  };
  return (
    <div className="items-center justify-between border-3 border-neutral-500 rounded-[20px] p-4">
      <div className="w-full pb-3 mb-3 border-b-3 border-neutral-500">
        <p className="text-lg font-bold">Kelas yang dipilih</p>
        <div className="flex items-center gap-2">
          <CircleAlert />
          <p className="">
            Kamu hanya dapat daftar 1 kelas per orang, pastikan temanmu sudah
            membuat akun!
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3">{myEmail}</div>

        <div className="flex flex-col gap-2">
          {!selectedClassId && !showClassOptions && (
            <button
              type="button"
              onClick={() => setShowClassOptions(true)}
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

          {showClassOptions && !selectedClassId && (
            <div>
              <div className="h-38 sm:h-50 w-auto border-2 border-neutral-500 rounded-xl flex">
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
                    <button
                      type="button"
                      onClick={() => setShowClassOptions(true)}
                      className="p-1 bg-primary-500 rounded-sm cursor-pointer"
                    >
                      <ArrowUpRight />
                    </button>
                  </div>
                </div>
              </div>

              <div className="fixed inset-0 bg-neutral-900/70 bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-neutral-700 p-5 rounded-xl w-full mx-20 border-2 border-neutral-500">
                  <div className="pb-3 border-b-2 border-neutral-500 mb-3 flex items-center justify-between">
                    <p className="text-lg font-bold ">Intermediate Class</p>
                    <button
                      type="button"
                      onClick={() => setShowClassOptions(false)}
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
                        onClick={() => {
                          setSelectedClassId(kelas.id);
                          setSelectedClassTitle(kelas.title);
                          setShowClassOptions(false); // langsung tutup popup setelah pilih
                        }}
                        className="h-38 sm:h-50 bg-neutral-50 w-auto border-2 border-neutral-500 rounded-xl flex"
                      >
                        <Image
                          src={getImageByTitle(kelas.title)}
                          alt={`Image ${kelas}`}
                          width={152}
                          height={152}
                          className="rounded-l-md sm:w-[200px] sm:h-[200px] object-cover"
                        />
                        <div className="p-2 sm:p-4 w-full text-neutral-900">
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-[14px]">{kelas.title}</p>
                            <div>
                              <div className="text-neutral-50 p-1 bg-primary-500 rounded-sm">
                                <Plus />
                              </div>
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
            </div>
          )}

          {selectedClassId && (
            <div className="h-38 sm:h-50 w-auto bg-neutral-50 text-neutral-900 rounded-md flex">
              <Image
                src={getImageByTitle(selectedClassTitle)}
                alt={`Image ${selectedClassTitle}`}
                width={152}
                height={152}
                className="rounded-l-md sm:w-[200px] sm:h-[200px] object-cover"
              />
              <div className="p-2 sm:p-4 w-auto">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] sm:text-[18px] font-bold">
                    {selectedClassTitle}
                  </p>
                  <button
                    type="button"
                    onClick={handleResetClass}
                    className="p-1 bg-primary-500 rounded-sm cursor-pointer text-neutral-50"
                  >
                    <Minus />
                  </button>
                </div>
                <p className="line-clamp-2 sm:line-clamp-5 text-[12px] sm:text-base">
                  {getDescByTitle(selectedClassTitle)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChooseClassGroup;
