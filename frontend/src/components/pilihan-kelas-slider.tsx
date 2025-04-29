"use client";

import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from "./card";
import NextArrow from "./next-arrow";
import PrevArrow from "./prev-arrow";

const Kelas = [
    {
        type: "Beginner",
        image: "/images/class-profile/hako.jpg",
        teacher1: "/images/teacher/faris.jpg",
        title: "Web Development",
        href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
    },
    {
        type: "Beginner",
        image: "/images/class-profile/hako.jpg",
        teacher1: "/images/teacher/faris.jpg",
        title: "Web Development",
        href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
    },
    {
        type: "Beginner",
        image: "/images/class-profile/hako.jpg",
        teacher1: "/images/teacher/faris.jpg",
        title: "Web Development",
        href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
    },
    {
        type: "Beginner",
        image: "/images/class-profile/hako.jpg",
        teacher1: "/images/teacher/faris.jpg",
        title: "Web Development",
        href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
    },
    {
        type: "Intermediate",
        image: "/images/class-profile/hako.jpg",
        teacher1: "/images/teacher/faris.jpg",
        teacher2: "/images/teacher/faris.jpg",
        title: "Web Development",
        href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
    },
    {
        type: "Intermediate",
        image: "/images/class-profile/hako.jpg",
        teacher1: "/images/teacher/faris.jpg",
        teacher2: "/images/teacher/faris.jpg",
        title: "Web Development",
        href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
    },
    {
        type: "Intermediate",
        image: "/images/class-profile/hako.jpg",
        teacher1: "/images/teacher/faris.jpg",
        teacher2: "/images/teacher/faris.jpg",
        title: "Web Development",
        href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
    },
    {
        type: "Intermediate",
        image: "/images/class-profile/hako.jpg",
        teacher1: "/images/teacher/faris.jpg",
        teacher2: "/images/teacher/faris.jpg",
        title: "Web Development",
        href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
    },
    {
        type: "Intermediate",
        image: "/images/class-profile/hako.jpg",
        teacher1: "/images/teacher/faris.jpg",
        teacher2: "/images/teacher/faris.jpg",
        title: "Web Development",
        href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
    },
    {
        type: "Intermediate",
        image: "/images/class-profile/hako.jpg",
        teacher1: "/images/teacher/faris.jpg",
        teacher2: "/images/teacher/faris.jpg",
        title: "Web Development",
        href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
    },

]

const PilihanKelasSlider =() => {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => {
          setIsMobile(window.innerWidth <= 769);
        };
    
        checkMobile();
        window.addEventListener("resize", checkMobile);
    
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const settings = {
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <NextArrow/>,
        prevArrow: <PrevArrow/>,
        slidesToShow: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    centerMode: true,
                    centerPadding: "20px",
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
                    centerPadding: "10px",
                }
            }
        ]
    };

    return (
        <div className="w-full lg:max-w-7xl mx-auto">
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
