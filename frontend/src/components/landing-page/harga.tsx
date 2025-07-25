import Container from "@/components/container";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import * as motion from "motion/react-client"
import { fadeIn } from "@/lib/animation";

const Header = [
  {
    title: "Level Entry",
    price: "49.000,-",
  },
  {
    title: "Bundling Package",
    offer: "Most Popular",
    price: "130.000,-",
  },
  {
    title: "Level Intermediate",
    price: "90.000,-",
  },
];

const Details = [
  {
    text1: "Cocok untuk pemula",
    text2: "Materi dasar yang mudah dipahami",
    text3: "Mendapatkan sertifikat",
    text4: "Final project untuk portofolio",
  },
  {
    text1: "Akses dua kelas sekaligus",
    text2: "Alur belajar yang progresif",
    text3: "Dua project untuk portofolio",
    text4: "Hemat banyak, belajar maksimal",
  },
  {
    text1: "Pendalaman materi yang lebih praktis",
    text2: "Mentoring dari profesional",
    text3: "Sesi eksplorasi tools dan teknik industri",
    text4: "Dapat sertifikat & portofolio",
  },
];

const Harga = () => {
  return (
    <div
      className="w-full bg-cover bg-center flex flex-col items-center justify-center
                bg-neutral-900/80
                relative
                lg:h-screen
              "
    >
      <div
        className="flex-col items-center justify-center w-full
              "
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

        <Container className="flex flex-col items-center gap-4 ">
          <Image
            src="/images/stars-hero-programs.png"
            alt="stars"
            layout="fill"
            className="absolute left-0 max-h-screen sm:max-h-fit object-cover -z-10"
            style={{ top: "61%" }}
          />
          <Image
            src="/images/stars-hero-programs.png"
            alt="stars"
            layout="fill"
            className="absolute left-0 max-h-screen sm:max-h-fit object-cover -z-10"
            style={{ top: "66%" }}
          />
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            className="relative flex flex-col w-full items-center"
          >
            <h1 className="pt-10 w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold pb-10">
              Harga Program Kami
            </h1>
            <div className="flex w-full flex-col items-center">
              <div className="flex flex-col w-full lg:flex-row justify-center items-center lg:items-end gap-4 md:gap-5">
                {/* putih kiri */}
                <div className="relative border bg-neutral-50 rounded-[10px] max-w-105 p-5 flex flex-col items-center justify-between w-full order-2 lg:order-1">
                  {/* header atasnya */}
                  <div className="flex flex-col gap-5 justify-around w-full">
                    <div className="flex flex-row items-center justify-between w-full">
                      <h2 className="text-[18px] lg:text-[22px] font-bold justify-start">
                        {Header[0].title}
                      </h2>
                    </div>
                    <div>
                      <p className="text-[38px] lg:text-[46px] font-bold">
                        <span className="font-normal">Rp</span>
                        {Header[0].price}
                      </p>
                    </div>
                  </div>

                  {/* bagian yang persen persenan */}
                  <div className="flex pt-10 md:pt-25 flex-col gap-2 pt-5 justify-start w-full">
                    <div className="flex flex-row gap-1 items-start justify-start">
                      {" "}
                      <div className="w-6 h-6">
                        <CheckCircle />
                      </div>
                      <p className="text-[12px] lg:text-[18px]">
                        {Details[0].text1}
                      </p>{" "}
                    </div>
                    <div className="flex flex-row gap-1 items-start">
                      {" "}
                      <div className="w-6 h-6">
                        <CheckCircle />
                      </div>
                      <p className="text-[12px] lg:text-[18px]">
                        {Details[0].text2}
                      </p>{" "}
                    </div>
                    <div className="flex flex-row gap-1 items-start">
                      {" "}
                      <div className="w-6 h-6">
                        <CheckCircle />
                      </div>
                      <p className="text-[12px] lg:text-[18px]">
                        {Details[0].text3}
                      </p>{" "}
                    </div>
                    <div className="flex flex-row gap-1 items-start">
                      {" "}
                      <div className="w-6 h-6">
                        <CheckCircle />
                      </div>
                      <p className="text-[12px] lg:text-[18px]">
                        {Details[0].text4}
                      </p>{" "}
                    </div>
                  </div>
                  <Link href="/programs#entry-class" className="w-full">
                    <Button
                      variant="learn-more-blue"
                      className="w-full mt-5 rounded-[8px] items-center"
                    >
                      Learn More
                      <ArrowRight className="w-5 ml-2" />
                    </Button>
                  </Link>
                </div>

                {/* biru tengah with glow effect */}
                <div className="relative border rounded-[10px] max-w-105 w-full order-1 lg:order-2">
                  <div className="absolute inset-0 bg-[#4A60C8]/75 rounded-[10px] blur-[20px] opacity-100 transform scale-[1.02]"></div>

                  {/* header atasnya */}
                  <div className="relative border bg-gradient-to-b from-[#0716A2] to-[#03083C] text-neutral-50 rounded-[10px] p-5 flex flex-col items-center justify-between w-full h-full ring-1 ring-neutral-50/70">
                    <div className="flex flex-col gap-5 justify-around w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <h2 className="text-[18px] lg:text-[22px] font-bold justify-start">
                          {Header[1].title}
                        </h2>
                        <p className="text-[12px] lg:text-[14px] px-4 py-1 bg-neutral-200 rounded-[5px] whitespace-nowrap text-neutral-900">
                          {Header[1].offer}
                        </p>
                      </div>
                      <div>
                        <p className="text-[38px] lg:text-[46px] font-bold">
                          <span className="font-normal">Rp</span>
                          {Header[1].price}
                        </p>
                      </div>
                    </div>

                    {/* bagian yang persen persenan */}
                    <div className="flex pt-10 md:pt-40 flex-col gap-2 justify-start w-full">
                      <div className="flex flex-row gap-1 items-start">
                        {" "}
                        <div className="w-6 h-6">
                          <CheckCircle />
                        </div>
                        <p className="text-[12px] lg:text-[18px]">
                          {Details[1].text1}
                        </p>{" "}
                      </div>
                      <div className="flex flex-row gap-1 items-start">
                        {" "}
                        <div className="w-6 h-6">
                          <CheckCircle />
                        </div>
                        <p className="text-[12px] lg:text-[18px]">
                          {Details[1].text2}
                        </p>{" "}
                      </div>
                      <div className="flex flex-row gap-1 items-start">
                        {" "}
                        <div className="w-6 h-6">
                          <CheckCircle />
                        </div>
                        <p className="text-[12px] lg:text-[18px]">
                          {Details[1].text3}
                        </p>{" "}
                      </div>
                      <div className="flex flex-row gap-1 items-start">
                        {" "}
                        <div className="w-6 h-6">
                          <CheckCircle />
                        </div>
                        <p className="text-[12px] lg:text-[18px]">
                          {Details[1].text4}
                        </p>{" "}
                      </div>
                    </div>
                    <Link href="/programs#bundle-class" className="w-full">
                      <Button
                        variant="learn-more-white"
                        className="w-full mt-5 rounded-[8px] items-center"
                      >
                        Learn More
                        <ArrowRight className="w-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* putih kanan */}
                <div className="border bg-neutral-50 rounded-[10px] max-w-105 p-5 flex flex-col items-center justify-between w-full order-3 lg:order-3">
                  {/* header atasnya */}
                  <div className="flex flex-col gap-5 justify-around w-full">
                    <div className="flex flex-row items-center justify-between w-full">
                      <h2 className="text-[18px] lg:text-[22px] font-bold justify-start">
                        {Header[2].title}
                      </h2>
                    </div>
                    <div>
                      <p className="text-[38px] lg:text-[46px] font-bold">
                        <span className="font-normal">Rp</span>
                        {Header[2].price}
                      </p>
                    </div>
                  </div>

                  {/* bagian yang persen persenan */}
                  <div className="flex pt-10 md:pt-25 flex-col gap-2 pt-5 justify-start w-full">
                    <div className="flex flex-row gap-1 items-start">
                      {" "}
                      <div className="w-6 h-6">
                        <CheckCircle />
                      </div>
                      <p className="text-[12px] lg:text-[18px]">
                        {Details[2].text1}
                      </p>{" "}
                    </div>
                    <div className="flex flex-row gap-1 items-start">
                      {" "}
                      <div className="w-6 h-6">
                        <CheckCircle />
                      </div>
                      <p className="text-[12px] lg:text-[18px]">
                        {Details[2].text2}
                      </p>{" "}
                    </div>
                    <div className="flex flex-row gap-1 items-start justify-start">
                      {" "}
                      <div className="w-6 h-6">
                        <CheckCircle />
                      </div>
                      <p className="text-[12px] lg:text-[18px]">
                        {Details[2].text3}
                      </p>{" "}
                    </div>
                    <div className="flex flex-row gap-1 items-start">
                      {" "}
                      <div className="w-6 h-6">
                        <CheckCircle />
                      </div>
                      <p className="text-[12px] lg:text-[18px]">
                        {Details[2].text4}
                      </p>{" "}
                    </div>
                  </div>
                  <Link href="/programs#intermediate-class" className="w-full">
                    <Button
                      variant="learn-more-blue"
                      className="w-full mt-5 rounded-[8px] items-center"
                    >
                      Learn More
                      <ArrowRight className="w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* disclaimer text directly below left card, expands to the right */}
              <div className="w-fit mt-4 lg:mt-6">
                <p className="text-neutral-50 text-[12px] lg:text-[18px] text-left">
                  *Pembayaran <span className="font-bold"> tidak bisa diganti atau direfund </span>, pastikan pilihanmu tepat!
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
};

export default Harga;
