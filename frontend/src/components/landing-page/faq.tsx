"use client";

import Container from "@/components/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/faq-button";
import Image from "next/image";
import * as motion from "motion/react-client"
import { fadeIn, fadeInComp } from "@/lib/animation";

const AnswerQuestion = [
    {
        question: "Ini khusus mahasiswa UGM aja atau terbuka untuk umum?",
        answer: <>Kegiatan ini terbuka untuk <strong>siapa saja</strong>, tidak terbatas hanya untuk mahasiswa UGM. Jadi, <strong>dari mana pun kamu berasal</strong>, kamu tetap bisa ikut dan berpartisipasi.</>,
    },
    {
        question: "Saya benar-benar pemula, apakah tetap bisa ikut?",
        answer: <>Tentu saja! Kelas Entry kami <strong>sangat cocok untuk pemula</strong>. Materinya disusun secara bertahap dan mentor akan membimbingmu dengan <strong>pendekatan yang ramah dan mudah dipahami</strong>.</>,
    },
    {
        question: "Boleh ambil lebih dari satu kelas di level yang sama?",
        answer: <>Untuk saat ini, hanya diperbolehkan <strong>satu kelas per level</strong>. Kami ingin memastikan kamu bisa fokus dan mendapatkan <strong>pengalaman belajar yang optimal</strong> di setiap tahap.</>,
    },
    {
        question: "Apakah saya bisa mengikuti lebih dari satu kelas?",
        answer: <>Bisa, namun dengan ketentuan: kamu hanya dapat mengambil <strong>maksimal 1 kelas Entry dan 1 kelas Intermediate</strong>, atau langsung memilih <strong>Bundling Package yang sudah mencakup keduanya</strong>.</>,
    },
    {
        question: "Apakah kelas yang sudah dibayar bisa diganti?",
        answer: <>Sayangnya, <strong>kelas yang sudah dibayar tidak dapat diganti</strong>. Karena itu, penting untuk memilih kelas yang <strong>paling sesuai dengan kebutuhan dan minatmu</strong> sejak awal.</>,
    },
    {
        question: "Apakah pembayaran bisa direfund?",
        answer: <>Mohon maaf, <strong>seluruh pembayaran bersifat final dan tidak dapat direfund</strong>. Pastikan kamu sudah mempertimbangkan pilihan kelasmu dengan matang sebelum melakukan pembayaran, ya!</>,
    },
]

const FAQ = () => {
  return (
    <div
      className="w-full bg-cover bg-center flex flex-col items-center justify-center
                bg-[linear-gradient(0deg,rgba(5,12,26,0.0)_0%,rgba(5,12,26,0.8)_100%)]
                relative
              "
    >
      <div
        className="flex-col items-center justify-center w-full px-10"
      >
        {/* bintang dan planet */}
        <>
          <Image
            src="/images/stars-hero-programs.png"
            // src="/images/tes_bg.jpg"
            alt="stars"
            fill
            className="absolute top-0 left-0 w-full object-cover -z-1"
          ></Image>
        </>

        {/* isi */}

        <Container className="">
          <div className="pb-44 z-0">
            <motion.h1 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }} 
              className="pt-44 px-4 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold"
            >
              Frequently Asked Questions
            </motion.h1>
            <div className="pt-5 lg:px-20 flex flex-col">
              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-5"
              >
                {AnswerQuestion.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInComp}
                    initial="hidden"
                    whileInView="visible"
                    custom={index}
                    viewport={{
                      once: true,
                    }}
                  >
                    <AccordionItem
                      value={`item-${index + 1}`}
                      className="flex flex-col"
                    >
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <div>
                          <p className="text-[12px] lg:text-[14px] px-2 py-1 rounded-[5px]">
                            {item.answer}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default FAQ;
