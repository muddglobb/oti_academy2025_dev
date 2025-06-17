"use client";

import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Container from "@/components/container";
import CommentCard from "@/components/comment-card";
import Image from "next/image";

import * as motion from "motion/react-client"
import { fadeIn, slideInComp } from "@/lib/animation";

const CommentContents = [
    {
        comment: `"OEM-OEM is a fun way to get into the basics. Karena pengajarnya fleksibel dan bisa ngikutin pace belajar tiap peserta. Selain itu, OEM-OEM terbuka untuk umum dan membuka kesempatan untuk banyak orang. So it was a great experience! OLC is also a good place untuk belajar bareng sama team. Aku suka karena pembelajarannya well delivered dan pengajarnya juga keren-keren."`,
        pic: "images/testimonial-profile/nazwa.webp",
        name: "Finanazwa Ayesha",
        job: "Peserta OEM-OEM & OLC",
    },
    {
        comment: `"Kalo OEM-OEM sendiri, acaranya gacor, bagus, gratis, tapi saya dapet informasi acaranya telat jadi gak kebagian beberapa kelas yang aku  mau. Tapi tetep keren dan hebat si yang ngajar karena antusias dan competitive sekali (competitive programming). Kalo OLC, eventnya gede, keren, hebat yang garis karena commitment fee aja aku bisa dapet cyber security dapat experience langsung bidang IT yang advanced."`,
        pic: "images/testimonial-profile/faris.webp",
        name: "Maulana Faris",
        job: "Peserta OEM-OEM & OLC",
    },
    {
        comment: `"Menurutku OEM-OEM menjadi tempat yang bagus untuk mengenalkan konsep yang terdapat dalam lingkup ilmu komputer. Kelas DSAI cukup fundamental dimana konsep dan aplikasinya dalam industri dijelaskan secara general. Sedangkan OLC continued where oem oem left off. OLC tetap menjelaskan kembali konsep yang aku pelajari di OEM-OEM namun melanjutkannya dengan praktik secara langsung.  I'm a firm believer of "practice makes perfect" jadi menurutku sangat-sangat mendorong progressku dalam menelurusi dunia IT."`,
        pic: "images/testimonial-profile/satya.webp",
        name: "Satya Wira",
        job: "Peserta OEM-OEM & OLC",
    },
    {
        comment: `"OEM-OEM sangat mudah diakses, sangat mudah untuk daftar, website menarik, saya bisa mendaftar banyak kelas. kelas frontend sangat asik dan mudah dipahami, secara keseluruhan OEM-OEM sangat membantu untuk memulai perjalanan IT. WE MAKE IT FOR ME"`,
        pic: "images/testimonial-profile/dhimas.webp",
        name: "Dhimas Putra Sulistio",
        job: "Peserta OEM-OEM",
    },
    {
        comment: `"Menurut aku, OLC adalah wadah yang bagus untuk belajar apalagi dari nol karena pelatihannya yang komprehensif dari pakarnya dengan hands on experience, yaitu praktik dunia nyata. Tidak sampai disitu saja, OLC juga menghandirkan wadah untuk berinovasi dan berkompetisi dengan teman-teman lain jadi pembelajaran yang didapatkan sangat seru dan lengkap"`,
        pic: "images/testimonial-profile/naya.webp",
        name: "Indratanaya Budiman",
        job: "Peserta OLC",
    },
];

const Comments = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const sliderSettings = {
        arrows: false,
        dots: true,
        infinite: true,
        autoplay: isMobile || isTablet,
        autoplaySpeed: 3000,
        speed: 500,
        slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: isMobile ? "20px" : "0",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: true,
                    centerPadding: "20px"
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1.5,
                    slidesToScroll: 1,
                    centerMode: true,
                    centerPadding: "10px",
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    SlidesToScroll: 1,
                    centerMode: true,
                }
            }
        ]
    };

    return (
        <div
              className="
                bg-[linear-gradient(0deg,rgba(5,12,26,0.6)_0%,rgba(5,12,26,0.8)_100%)]
                relative
                py-20
                lg:py-40
              "
            >
              <div className=" items-center justify-center 
              ">
                {/* bintang dan planet */}
                <>
                  <Image
                    src="/images/stars-hero-programs.png"
                    // src="/images/tes_bg.jpg"
                    alt="stars"
                    fill
                    className="absolute top-0 left-0 w-full object-cover -z-1"
                  ></Image>

                  <div className="absolute w-full pointer-events-none left-[70%] top-[-115px] -z-1">
                          {/* saturnus */}
                          <Image
                            src="/images/planet/saturnus.png"
                            alt="mars"
                            width={1462}
                            height={1462}
                            className="object-contain"
                          />
                        </div>
        
                </>
        
                {/* isi */}
                
        <Container className="px-0">

            <div className="flex flex-col items-center justify-center w-full ">
                <motion.h1 
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                    }}
                    className=" px-4 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold"
                >
                    Kata Mereka Tentang Program Kami
                </motion.h1>

                {/* desktop */}
                <div className="hidden lg:flex 2xl:gap-8 gap-5 mt-10 h-full">
                    {/* kiri dua */}
                    <motion.div 
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 3, delay: 0.7, type: "spring" }}
                        className="flex flex-col 2xl:gap-10 gap-5 max-w-104"
                    >
                        <CommentCard
                            nama={CommentContents[0].name}
                            pic={CommentContents[0].pic}
                            job={CommentContents[0].job}
                            comment={CommentContents[0].comment}
                        />
                        <CommentCard
                            nama={CommentContents[1].name}
                            pic={CommentContents[1].pic}
                            job={CommentContents[1].job}
                            comment={CommentContents[1].comment}
                        />
                    </motion.div>

                    {/* tengah gede sendiri */}
                    <motion.div 
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 3, delay: 1, type: "spring" }}
                        className="flex flex-col 2xl:gap-10 gap-5 max-w-104 justify-center">
                        <CommentCard
                            nama={CommentContents[2].name}
                            pic={CommentContents[2].pic}
                            job={CommentContents[2].job}
                            comment={CommentContents[2].comment}
                        />
                    </motion.div>

                    {/* kanan dua */}
                    <motion.div 
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 3, delay: 1.3, type: "spring" }}
                        className="flex flex-col 2xl:gap-10 gap-5 max-w-104">
                        <CommentCard
                            nama={CommentContents[3].name}
                            pic={CommentContents[3].pic}
                            job={CommentContents[3].job}
                            comment={CommentContents[3].comment}
                        />
                        <CommentCard
                            nama={CommentContents[4].name}
                            pic={CommentContents[4].pic}
                            job={CommentContents[4].job}
                            comment={CommentContents[4].comment}
                        />
                    </motion.div>
                </div>

                {/* mobile */}
                <motion.div 
                
                    className="lg:hidden w-full mt-10 mx-0">
                    <Slider key={isMobile ? "mobile" : "tablet"} {...sliderSettings}>
                        {CommentContents.map((item, index) => (
                            <motion.div 
                                variants={slideInComp}
                                initial="hidden"
                                whileInView="visible"
                                custom={index}
                                viewport={{
                                once: true,
                                }} key={index} className="px-2 h-90"
                            >
                                <CommentCard
                                    nama={item.name}
                                    pic={item.pic}
                                    job={item.job}
                                    comment={item.comment}
                                />
                            </motion.div>
                        ))}
                    </Slider>
                </motion.div>
            </div>
            
        </Container>
              </div>
            </div>
    );
};

export default Comments;