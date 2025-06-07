"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const images = [
  { 
    src: "/images/kenali-omahti/kenali-1.webp", 
    alt: "Kenali 1" 
  },
  { 
    src: "/images/kenali-omahti/kenali-2.webp", 
    alt: "Kenali 2" 
  },
  { 
    src: "/images/kenali-omahti/kenali-3.webp", 
    alt: "Kenali 3" 
  },
  { 
    src: "/images/kenali-omahti/kenali-4.webp", 
    alt: "Kenali 4" 
  },
];

const KenaliSlider = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const settings = {
    onClick: false,
    arrows: false,
    infinite: true,
    autoplay: isMobile || isTablet,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: { 
          slidesToShow: 3,
          centerPadding: "10px",
         },
      },
      {
        breakpoint: 768, 
        settings: { 
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  // For screens larger than 1024px, render as a simple grid
  if (!isMobile && !isTablet) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-center items-center gap-4 px-2">
          {images.map((img) => (
            <div key={img.alt} className="flex-1 max-w-[312px]">
              <Image
                src={img.src}
                alt={img.alt}
                width={312}
                height={224}
                className="rounded-lg object-cover aspect-[312/224] w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // For mobile and tablet, use the slider
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
