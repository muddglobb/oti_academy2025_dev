"use client";

import Card from "./card";
import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import NextArrow from "./ui/next-arrow";
import PrevArrow from "./ui/prev-arrow";
import { getDescByTitle, getFirstTeacher, getImageByTitle, getSecTeacher, getSlugByTitle } from "@/lib/course-props/course-props";

const bundleData = [
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
    title: "Software Engineering",
  },
  {
    type: "Intermediate",
    title: "Cyber Security",
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

export default IntermediateSlider;
