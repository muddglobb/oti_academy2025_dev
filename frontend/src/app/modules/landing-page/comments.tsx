"use client";

import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Container from "@/components/container";
import CommentCard from "@/components/comment-card";

const CommentContents = [
    {
        comment: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."`,
        pic: "images/sponsors/sponsor3.JPG",
        name: "Ayasha Rahmadinni",
        job: "Full Stack Developer",
    },
    {
        comment: `Mauris condimentum nibh sit amet diam posuere, quis malesuada leo hendrerit. Pellentesque pellentesque sodales elementum. Sed vel felis eu risus finibus tincidunt nec non mi. Phasellus mollis leo id dolor rutrum, sit amet rhoncus ante pellentesque. Praesent cursus eros purus, volutpat interdum tortor porttitor vel. Sed volutpat nisl odio, non ullamcorper ante sodales eget. Nullam sagittis, metus sit amet congue congue, turpis neque efficitur magna, eget consectetur mi justo ac metus. Vestibulum vel est turpis. Etiam efficitur facilisis venenatis.`,
        pic: "images/sponsors/sponsor3.JPG",
        name: "Kevin Antonio Wiyono Lauw",
        job: "Orang Stress",
    },
    {
        comment: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."`,
        pic: "images/sponsors/sponsor3.JPG",
        name: "Regina Joan MJL",
        job: "Gatau gak kenal",
    },
    {
        comment: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."`,
        pic: "images/sponsors/sponsor3.JPG",
        name: "Ayasha Rahmadinni",
        job: "Full Stack Developer",
    },
    {
        comment: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."`,
        pic: "images/sponsors/sponsor3.JPG",
        name: "Ayasha Rahmadinni",
        job: "Full Stack Developer",
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
        centerMode: isMobile,
        centerPadding: isMobile ? "20px" : "0",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                    centerPadding: "20px",
                }
            }
        ]
    };

    return (
        <Container className="px-0 bg-gradient-to-b from-neutral-900/90 to-neutral-900/39">
            <div className="flex flex-col items-center justify-center w-full h-full py-20">
                <h1 className="pt-44 px-4 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold">
                    Kata Mereka Tentang Program Kami
                </h1>

                {/* desktop */}
                <div className="hidden lg:flex 2xl:gap-8 gap-5 mt-10 h-full">
                    {/* kiri dua */}
                    <div className="flex flex-col 2xl:gap-10 gap-5 max-w-104">
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
                    </div>

                    {/* tengah gede sendiri */}
                    <div className="flex flex-col 2xl:gap-10 gap-5 max-w-104 justify-center">
                        <CommentCard
                            nama={CommentContents[2].name}
                            pic={CommentContents[2].pic}
                            job={CommentContents[2].job}
                            comment={CommentContents[2].comment}
                        />
                    </div>

                    {/* kanan dua */}
                    <div className="flex flex-col 2xl:gap-10 gap-5 max-w-104">
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
                    </div>
                </div>

                {/* mobile */}
                <div className="lg:hidden w-full mt-10 mx-0">
                    <Slider key={isMobile ? "mobile" : "tablet"} {...sliderSettings}>
                        {CommentContents.map((item, index) => (
                            <div key={index} className="px-2">
                                <CommentCard
                                    nama={item.name}
                                    pic={item.pic}
                                    job={item.job}
                                    comment={item.comment}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            
        </Container>
    );
};

export default Comments;