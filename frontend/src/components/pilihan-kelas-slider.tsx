"use client";

import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from "./card";
import NextArrow from "./ui/next-arrow";
import PrevArrow from "./ui/prev-arrow";

const Kelas = [
    {
        type: "Beginner",
        image: "/logo-perkelas/webdev.webp",
        teacher1: "/images/mentor-coming-soon.webp",
        title: "Web Development",
        href: "/programs/web-development",
        description: "Belajar membuat UI dari nol, mulai dari HTML, CSS, React, hingga Tailwind & MUI. Cocok untuk pemula yang ingin membangun halaman web responsif, memahami dasar komponen React, dan eksplorasi styling modern."
    },
    {
        type: "Beginner",
        image: "/logo-perkelas/cp.webp",
        teacher1: "/images/mentor-coming-soon.webp",
        title: "Competitive Programming",
        href: "/programs/competitive-programming",
        description: "Mengenali dasar-dasar Competitive Programming secara bertahap mulai dari algoritma, struktur data, hingga graf. Dirancang ringkas dan menantang, cocok untuk pemula dan ditutup dengan konteks sebagai tugas akhir."
    },
    {
        type: "Beginner",
        image: "/logo-perkelas/python.webp",
        teacher1: "/images/mentor-coming-soon.webp",
        title: "Basic Python",
        href: "/programs/basic-python",
        description: "Pelajari dasar-dasar pemrograman Python, mulai dari sintaks dasar hingga OOP dan struktur data. Materi disusun secara bertahap dan mudah diikuti cocok untuk pemula dengan studi kasus menarik."
    },
    {
        type: "Beginner",
        image: "/logo-perkelas/cysec-entry.webp",
        teacher1: "/images/mentor-coming-soon.webp",
        title: "Fundamental Cyber Security",
        href: "/programs/fundamental-cyber-security",
        description: "Masuki dunia cybersecurity dengan materi praktis dan menyenangkan, mulai dari Linux, forensik, web exploitation, kriptografi, hingga OSINT. Ditutup dengan praktik langsung lewat picoCTF. Materi ringkas dan mudah dipahami, cocok untuk pemula. "
    },
    {
        type: "Beginner",
        image: "/logo-perkelas/gamedev.webp",
        teacher1: "/images/mentor-coming-soon.webp",
        title: "Game Development",
        href: "/programs/game-development",
        description: "Menjelajahi dunia game development dari merancang ide, Game Design Document (GDD), hingga membangun prototype game dengan GDevelop. Materi lengkap dan mudah diikuti, cocok untuk pemula."
    },
    {
        type: "Beginner",
        image: "/logo-perkelas/graphic.webp",
        teacher1: "/images/mentor-coming-soon.webp",
        title: "Graphic Design",
        href: "/programs/graphic-design",
        description: "Belajar dasar desain grafis mulai dari elemen visual, warna, hingga layout. Lewat studi kasus dan praktik di Figma, kamu akan buat berbagai konten secara terarah dan bermakna."
    },
    {
        type: "Intermediate",
        image: "/logo-perkelas/softeng.webp",
        teacher1: "/images/mentor-coming-soon.webp",
        teacher2: "/images/mentor-coming-soon.webp",
        title: "Software Engineering",
        href: "/programs/software-engineering",
        description: "Kuasai pembuatan aplikasi web modern lengkap dari autentikasi hingga fitur CRUD lewat praktik langsung dan studi kasus nyata. Jadi developer full-stack handal dengan pengalaman yang keren."
    },
    {
        type: "Intermediate",
        image: "/logo-perkelas/data.webp",
        teacher1: "/images/mentor-coming-soon.webp",
        teacher2: "/images/mentor-coming-soon.webp",
        title: "Data Science & AI",
        href: "/programs/data-science&artificial-intelligence",
        description: "Belajar Data Science dan AI dari nol hingga siap ikut proyek dan kompetisi. DSAI Bootcamp membimbingmu step-by-step dari dasar hingga membangun model AI siap industri."
    },
    {
        type: "Intermediate",
        image: "/logo-perkelas/uiux.webp",
        teacher1: "/images/mentor-coming-soon.webp",
        teacher2: "/images/mentor-coming-soon.webp",
        title: "UI/UX",
        href: "/programs/ui-ux",
        description: "Mulai dari mengubah PRD jadi desain, membuat mock-up, wireframe, hingga memahami UX laws dan desain yang aksesibel. Belajar secara fleksibel lewat modul online, tugas, konsultasi, dan proyek akhir yang bisa jadi portofolio."
    },
    {
        type: "Intermediate",
        image: "/logo-perkelas/cysec-inter.webp",
        teacher1: "/images/mentor-coming-soon.webp",
        teacher2: "/images/mentor-coming-soon.webp",
        title: "Cyber Security",
        href: "/programs/cyber-security",
        description: "Masuki dunia ethical hacking dan praktik langsung tahapan penetration testing, dari reconnaissance hingga post-exploitation, lengkap dengan penyusunan laporan uji keamanan secara profesional."
    },

]

const PilihanKelasSlider =() => {
    const settings = {
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 10000,
        nextArrow: <NextArrow/>,
        prevArrow: <PrevArrow/>,
        slidesToShow: 4,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                    centerMode: true,
                    centerPadding: "30px",
                }
            },
            {
                breakpoint: 915,
                settings: {
                    slidesToShow: 2,
                    centerMode: true,
                    centerPadding: "50px",
                }
            },
            {
                breakpoint: 685,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: "30px",
                }
            }
        ]
    };

    return (
        <div className="w-full lg:max-w-7xl mx-auto ">
            <Slider {...settings}>
                {Kelas.map((card, index) => (
                    <div key={index} className="px-2">
                        <Card
                            key={index}
                            type={card.type}
                            image={card.image}
                            teacher1={card.teacher1}
                            teacher2={card.teacher2}
                            title={card.title}
                            href={card.href}
                            description={card.description}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default PilihanKelasSlider;
