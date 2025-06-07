"use client";

import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from "./card";
import NextArrow from "./ui/next-arrow";
import PrevArrow from "./ui/prev-arrow";
import { getDescByTitle, getFirstTeacher, getImageByTitle, getSecTeacher, getSlugByTitle } from "@/lib/course-props/course-props";
import * as motion from "motion/react-client"
import { slideInComp } from "@/lib/animation";

const Kelas = [
    {
        type: "Beginner",
        title: "Web Development",
    },
    {
        type: "Beginner",
        title: "Competitive Programming",
    },
    {
        type: "Beginner",
        title: "Basic Python",
    },
    {
        type: "Beginner",
        title: "Fundamental Cyber Security",
    },
    {
        type: "Beginner",
        title: "Game Development",
    },
    {
        type: "Beginner",
        title: "Graphic Design",
    },
    {
        type: "Intermediate",
        title: "Software Engineering",
    },
    {
        type: "Intermediate",
        title: "Data Science & Artificial Intelligence",
    },
    {
        type: "Intermediate",
        title: "UI/UX",
    },
    {
        type: "Intermediate",
        title: "Cyber Security",
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
                    <motion.div 
                        variants={slideInComp}
                        initial="hidden"
                        whileInView="visible"
                        custom={index}
                        viewport={{
                        once: true,
                        }}
                        key={index} 
                        className="px-2"
                    >
                        <Card
                            key={index}
                            type={card.type}
                            image={getImageByTitle(card.title)}
                            teacher1={getFirstTeacher(card.title)}
                            teacher2={getSecTeacher(card.title)}
                            title={card.title}
                            href={`programs/${getSlugByTitle(card.title)}`}
                            description={getDescByTitle(card.title)}
                        />
                    </motion.div>
                ))}
            </Slider>
        </div>
    );
}

export default PilihanKelasSlider;
