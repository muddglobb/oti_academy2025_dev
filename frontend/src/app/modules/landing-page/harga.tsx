import Container from "@/components/container";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const Header = [
    {
        title: "DIKE UGM",
        offer: "Exclusive Offer",
        price: "00.000,-"
    },
    {
        title: "Bundling Package",
        offer: "Most Popular",
        price: "00.000,-"
    },
    {
        title: "Single Class",
        offer: "Standard Offer",
        price: "00.000,-" 
    }
]

const Details = [
    {
        text1: "Hemat __%",
        text2: "Hemat __%",
        text3: "Hemat __%",
        text4: "Hemat __%",
    },
    {
        text1: "Hemat __%",
        text2: "Hemat __%",
        text3: "Hemat __%",
        text4: "Hemat __%",
    },
    {
        text1: "Hemat __%",
        text2: "Hemat __%",
        text3: "Hemat __%",
        text4: "Hemat __%",
    }
]

const Harga = () => {
    return (
        <Container className="flex flex-col items-end px-4 gap-4 lg:gap-10 bg-gradient-to-b from-neutral-900/70 via-neutral-900/70 to-neutral-900/90">
            <Image
                src="/images/stars-hero-programs.png"
                alt="stars"
                layout="fill"
                className="absolute left-0 max-h-screen sm:max-h-fit object-cover -z-10"
                style={{ top: "61%" }}
            />
            <Image
                src="/images/stars-hero-programs.png"
                alt="stars"
                layout="fill"
                className="absolute left-0 max-h-screen sm:max-h-fit object-cover -z-10"
                style={{ top: "66%" }}
            />
            <div className="relative w-full mx-auto items-end">
                <h1 className="pt-10 w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold pb-10">
                    Harga Program Kami
                </h1>
                <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-5 ">
                    {/* putih kiri */}
                    <div className="relative border bg-neutral-50 rounded-[10px] max-w-105 p-5 flex flex-col items-center justify-between w-full">
                        {/* header atasnya */}
                        <div className="flex flex-col gap-5 justify-around w-full">
                            <div className="flex flex-row items-center justify-between w-full">                        
                                <h2 className="text-[18px] lg:text-[22px] font-bold justify-start">{Header[0].title}</h2>
                                <p className="text-[12px] lg:text-[14px] px-4 py-1 bg-neutral-200 rounded-[5px]">{Header[0].offer}</p>
                            </div>
                            <div>
                                <p className="text-[38px] lg:text-[46px] font-bold"><span className="font-normal">Rp</span>{Header[0].price}</p>
                            </div>
                        </div>

                        {/* bagian yang persen persenan */}
                        <div className="flex pt-10 md:pt-25 flex-col gap-2 pt-5 justify-start w-full">
                            <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[0].text1}</p> </div>
                            <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[0].text2}</p> </div>
                            <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[0].text3}</p> </div>
                            <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[0].text4}</p> </div>
                        </div>
                        <Link href="/programs" className="w-full">
                            <Button variant="learn-more-blue" className="w-full mt-5 rounded-[8px] items-center">Learn More<ArrowRight className="w-5 ml-2"/></Button>
                        </Link>
                    </div>
                    
                    {/* biru tengah with glow effect */}
                    <div className="relative border rounded-[10px] max-w-105 w-full">
                        <div className="absolute inset-0 bg-[#4A60C8]/75 rounded-[10px] blur-[20px] opacity-100 transform scale-[1.02]"></div>
                        
                        {/* header atasnya */}
                        <div className="relative border bg-gradient-to-b from-[#0716A2] to-[#03083C] text-neutral-50 rounded-[10px] p-5 flex flex-col items-center justify-between w-full h-full ring-1 ring-neutral-50/70">
                            <div className="flex flex-col gap-5 justify-around w-full">
                                <div className="flex flex-row items-center justify-between w-full">                        
                                    <h2 className="text-[18px] lg:text-[22px] font-bold justify-start">{Header[1].title}</h2>
                                    <p className="text-[12px] lg:text-[14px] px-4 py-1 bg-neutral-200 rounded-[5px] text-neutral-900">{Header[1].offer}</p>
                                </div>
                                <div>
                                    <p className="text-[38px] lg:text-[46px] font-bold"><span className="font-normal">Rp</span>{Header[1].price}</p>
                                </div>
                            </div>

                            {/* bagian yang persen persenan */}
                            <div className="flex pt-10 md:pt-40 flex-col gap-2 justify-start w-full">
                                <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[1].text1}</p> </div>
                                <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[1].text2}</p> </div>
                                <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[1].text3}</p> </div>
                                <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[1].text4}</p> </div>
                            </div>
                            <Link href="/programs" className="w-full">
                                <Button variant="learn-more-white" className="w-full mt-5 rounded-[8px] items-center">Learn More<ArrowRight className="w-5 ml-2"/></Button>
                            </Link>
                        </div>
                    </div>

                    {/* putih kanan */}
                    <div className="border bg-neutral-50 rounded-[10px] max-w-105 p-5 flex flex-col items-center justify-between w-full">
                        {/* header atasnya */}
                        <div className="flex flex-col gap-5 justify-around w-full">
                            <div className="flex flex-row items-center justify-between w-full">                        
                                <h2 className="text-[18px] lg:text-[22px] font-bold justify-start">{Header[2].title}</h2>
                                <p className="text-[12px] lg:text-[14px] px-4 py-1 bg-neutral-200 rounded-[5px]">{Header[2].offer}</p>
                            </div>
                            <div>
                                <p className="text-[38px] lg:text-[46px] font-bold"><span className="font-normal">Rp</span>{Header[2].price}</p>
                            </div>
                        </div>

                        {/* bagian yang persen persenan */}
                        <div className="flex pt-10 md:pt-25 flex-col gap-2 pt-5 justify-start w-full">
                            <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[2].text1}</p> </div>
                            <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[2].text2}</p> </div>
                            <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[2].text3}</p> </div>
                            <div className="flex flex-row gap-1 items-center"> <CheckCircle/><p className="text-[12px] lg:text-[18px]">{Details[2].text4}</p> </div>
                        </div>
                        <Link href="/programs" className="w-full">
                            <Button variant="learn-more-blue" className="w-full mt-5 rounded-[8px] items-center">Learn More<ArrowRight className="w-5 ml-2"/></Button>
                        </Link>
                    </div>
                </div>
                
                {/* text bawah */}
                <div className="h-10 md:h-12 md:left-[calc(50%-320px)] md:px-32">
                    <div className="w-full pt-2">
                        <p className="text-neutral-50 text-[12px] md:text-[14px]">*Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Harga;
