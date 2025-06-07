import Container from "@/components/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/faq-button";
import Image from "next/image";

const AnswerQuestion = [
    {
        question: "Saya benar-benar pemula, apakah tetap bisa ikut?",
        answer: "Tentu saja! Kelas Entry kami sangat cocok untuk pemula. Materinya disusun secara bertahap dan mentor akan membimbingmu dengan pendekatan yang ramah dan mudah dipahami.",
    },
    {
        question: "Boleh ambil lebih dari satu kelas di level yang sama?",
        answer: "Untuk saat ini, hanya diperbolehkan satu kelas per level. Kami ingin memastikan kamu bisa fokus dan mendapatkan pengalaman belajar yang optimal di setiap tahap.",
    },
    {
        question: "Apakah saya bisa mengikuti lebih dari satu kelas?",
        answer: "Bisa, namun dengan ketentuan: kamu hanya dapat mengambil maksimal 1 kelas Entry dan 1 kelas Intermediate, atau langsung memilih Bundling Package yang sudah mencakup keduanya.",
    },
    {
        question: "Apakah kelas yang sudah dibayar bisa diganti?",
        answer: "Sayangnya, kelas yang sudah dibayar tidak dapat diganti. Karena itu, penting untuk memilih kelas yang paling sesuai dengan kebutuhan dan minatmu sejak awal.",
    },
    {
        question: "Apakah pembayaran bisa direfund?",
        answer: "Mohon maaf, seluruh pembayaran bersifat final dan tidak dapat direfund. Pastikan kamu sudah mempertimbangkan pilihan kelasmu dengan matang sebelum melakukan pembayaran, ya!",
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
            <h1 className="pt-44 px-4 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold">
              Frequently Asked Questions
            </h1>
            <div className="pt-5 lg:px-20 flex flex-col">
              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-5"
              >
                {AnswerQuestion.map((item, index) => (
                  <AccordionItem
                    key={index}
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
