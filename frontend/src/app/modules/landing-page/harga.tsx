import Container from "@/components/container";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        title: "DIKE UGM",
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
        <Container className="items-center gap-4 lg:gap-10 bg-gradient-to-b from-neutral-900 to-neutral-900/10]">
            <h1 className="pt-10 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold">
                Harga Program Kami
            </h1>
            <div className="flex flex-col md:flex-row w-screen px-4 md:px-0 md:justify-center gap-4 md:gap-5 items-end ">
                {/* putih kiri */}
                <div className="border bg-neutral-50 rounded-[10px] max-w-102 p-5 flex flex-col items-center justify-between w-full ">

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

                {/* biru tengah */}

                {/* header atasnya */}

                    <div className="border bg-gradient-to-b from-[#0716A2] to-[#03083C] text-neutral-50 rounded-[10px] max-w-105 p-5 flex flex-col items-center justify-between w-full ring-2 ring-neutral-50">
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
                
                

                {/* putih kanan */}
                <div className="border bg-neutral-50 rounded-[10px] max-w-102 p-5 flex flex-col items-center justify-between w-full">

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
        </Container>
    )
}

export default Harga;