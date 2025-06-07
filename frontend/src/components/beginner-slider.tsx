"use client";

import Card from "@/components/card";
import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import NextArrow from "@/components/ui/next-arrow";
import PrevArrow from "@/components/ui/prev-arrow";
import { getDescByTitle, getFirstTeacher, getImageByTitle, getSecTeacher, getSlugByTitle } from "@/lib/course-props/course-props";

const beginnerData = [
  {
    type: "Entry",
    title: "Web Development",
  },
  {
    type: "Entry",
    title: "Basic Python",
  },
  {
    type: "Entry",
    title: "Fundamental Cyber Security",
  },
  {
    type: "Entry",
    title: "Game Development",
  },
  {
    type: "Entry",
    title: "Graphic Design",
  },
  {
    type: "Entry",
    title: "Competitive Programming",
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
    <div className="relative max-w-90 sm:max-w-140 md:max-w-180 lg:max-w-245 xl:max-w-300 2xl:max-w-330">
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
              image={getImageByTitle(card.title)}
              teacher1={getFirstTeacher(card.title)}
              teacher2={getSecTeacher(card.title)}
              title={card.title}
              href={`/programs/${getSlugByTitle(card.title)}`}
              description={getDescByTitle(card.title)}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BeginnerSlider;
