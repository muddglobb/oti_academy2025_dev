"use client";

import Card from "./card";
import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import NextArrow from "./ui/next-arrow";
import PrevArrow from "./ui/prev-arrow";

const bundleData = [
  {
    type: "Intermediate",
    image: "/images/class-profile/hako.jpg",
    teacher1: "/images/teacher/faris.jpg",
    teacher2: "/images/teacher/faris.jpg",
    title: "SOFTENG",
    href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti",
  },
  {
    type: "Intermediate",
    image: "/images/class-profile/hako.jpg",
    teacher1: "/images/teacher/faris.jpg",
    teacher2: "/images/teacher/faris.jpg",
    title: "SOFTENG",
    href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti",
  },
  {
    type: "Intermediate",
    image: "/images/class-profile/hako.jpg",
    teacher1: "/images/teacher/faris.jpg",
    teacher2: "/images/teacher/faris.jpg",
    title: "SOFTENG",
    href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti",
  },
  {
    type: "Intermediate",
    image: "/images/class-profile/hako.jpg",
    teacher1: "/images/teacher/faris.jpg",
    teacher2: "/images/teacher/faris.jpg",
    title: "SOFTENG",
    href: "https://www.youtube.com/watch?v=chWiR1H_6AY",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti",
  },
];
const IntermediateSlider = () => {
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    variableWidth: true,
    nextArrow: <NextArrow></NextArrow>,
    prevArrow: <PrevArrow></PrevArrow>,
  };

  return (
    <div className="relative max-w-90 sm:max-w-140 md:max-w-180 lg:max-w-245 xl:max-w-300 2xl:max-w-330">
      <Slider {...settings}>
        {bundleData.map((card, index) => (
          <div key={index} className="!w-[297px] mr-11">
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

export default IntermediateSlider;
