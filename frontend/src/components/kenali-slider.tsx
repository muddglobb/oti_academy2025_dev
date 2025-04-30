"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const images = [
  { 
    src: "/images/kenali-omahti/satyeah-wirawr.jpeg", 
    alt: "Kenali 1" 
  },
  { 
    src: "/images/class-profile/hako.jpg", 
    alt: "Kenali 2" 
  },
  { 
    src: "/images/teacher/faris.jpg", 
    alt: "Kenali 3" 
  },
  { 
    src: "/logo.jpeg", 
    alt: "Kenali 4" 
  },
];

const KenaliSlider = () => {
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
    arrows: false,
    infinite: isMobile,
    autoplay: isMobile,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: { 
          slidesToShow: 2,
         },
      },
      {
        breakpoint: 769, 
        settings: { 
          slidesToShow: 1.5,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <div className="max-w-screen mx-auto">
      <Slider key={isMobile ? "mobile" : "desktop"} {...settings}>
        {images.map((img) => (
          <div key={img.alt} className="px-2 w-full">
            <Image
              src={img.src}
              alt={img.alt}
              width={312}
              height={224}
              className="rounded-lg object-cover aspect-[312/224]"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default KenaliSlider;
