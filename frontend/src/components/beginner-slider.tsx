"use client";

import Card from "@/components/card";
import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import NextArrow from "@/components/ui/next-arrow";
import PrevArrow from "@/components/ui/prev-arrow";

const beginnerData = [
  {
    type: "Beginner",
    image: "/images/class-profile/hako.jpg",
    teacher1: "/images/teacher/faris.jpg",
    teacher2: "/images/teacher/faris.jpg",
    title: "Dasar Pemrograman",
    href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti",
  },
  {
    type: "Beginner",
    image: "/images/class-profile/hako.jpg",
    teacher1: "/images/teacher/faris.jpg",
    teacher2: "/images/teacher/faris.jpg",
    title: "Dasar Pemrograman",
    href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti",
  },
  {
    type: "Beginner",
    image: "/images/class-profile/hako.jpg",
    teacher1: "/images/teacher/faris.jpg",
    teacher2: "/images/teacher/faris.jpg",
    title: "Dasar Pemrograman",
    href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti",
  },
  {
    type: "Beginner",
    image: "/images/class-profile/hako.jpg",
    teacher1: "/images/teacher/faris.jpg",
    teacher2: "/images/teacher/faris.jpg",
    title: "Dasar Pemrograman",
    href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti",
  },
  {
    type: "Beginner",
    image: "/images/class-profile/hako.jpg",
    teacher1: "/images/teacher/faris.jpg",
    teacher2: "/images/teacher/faris.jpg",
    title: "Dasar Pemrograman",
    href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti",
  },
  {
    type: "Beginner",
    image: "/images/class-profile/hako.jpg",
    teacher1: "/images/teacher/faris.jpg",
    teacher2: "/images/teacher/faris.jpg",
    title: "Dasar Pemrograman",
    href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti",
  },
];
const BeginnerSlider = () => {
  const settings = {
    // dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    // slidesToShow: 4,
    // slidesToScroll: 1,
    variableWidth: true,
    nextArrow: <NextArrow></NextArrow>,
    prevArrow: <PrevArrow></PrevArrow>,
  };

  return (
    // <div className="flex items-center flex-wrap gap-10 justify-center">
    // <div className="relative w-full px-5">
      <div className="relative xl:max-w-332 lg:max-w-250 md:max-w-200 sm: max-w-180">
      <Slider {...settings}>
        {beginnerData.map((card, index) => (
          <div
            key={index}
            className="!w-[297px] mr-11"
            // className="min-w-[297px]"
          >
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
};

export default BeginnerSlider;
