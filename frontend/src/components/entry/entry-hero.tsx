// import React from "react";
// import CountdownTimer from "@/components/timer";
// import BackButton from "@/components/backButton";
// import Link from "next/link";

// type HeroProps = {
//   className: string;
//   classDescription: string;
// };

// const EntryHero = ({ className, classDescription }: HeroProps) => {
//   return (
//     <div className="relative w-full overflow-hidden">
//       <div
//         className="absolute inset-0 bg-cover bg-center -z-10"
//         style={{ backgroundImage: "url('/images/space-background.png')" }}
//       >
//         <div className="absolute inset-0 bg-linear-to-t from-neutral-900/100 to-neutral-900/10 -z-20"></div>
//       </div>
//       <div
//         className="absolute w-3/4 h-3/4 -mt-[3%] top-1/4 left-1/5 -translate-x-1/2 bg-contain bg-no-repeat -z-10 brightness-40 drop-shadow-[0_0_30px_rgba(20,74,200,0.2)]"
//         style={{ backgroundImage: "url(/images/planet/planet-kuning.png)" }}
//       ></div>
//       <section className="flex flex-col items-center justify-center h-152 font-display  bg-no-repeat bg-cover w-full">
//         <div className="self-start">
//           <BackButton></BackButton>
//         </div>
//         <div className="flex flex-col items-center text-center font-display w-sm md:w-2xl lg:w-4xl gap-3">
//           <div className="flex justify-center items-center gap-5">
//             <div className="text-white border-solid border-1 rounded-[5px] px-4.5 py-1.5 border-white">
//               <CountdownTimer targetDate={"2025-05-30T23:59:59"} />
//             </div>
//             <div className="bg-primary-800 text-white  rounded-lg text-center">
//               <p className="m-auto px-4.5 py-2">Beginer Level</p>
//             </div>
//           </div>

//           <p className="sm:text-[46px] text-2xl font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
//             {className}
//           </p>
//           <p className="sm:text-lg text-sm font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
//             {classDescription}
//           </p>
//           <Link
//             href={"../programs"}
//             className="bg-blue-500 text-white p-[8px] text-base m-[14px] rounded-lg"
//             type="button"
//           >
//             Begin Your Journey Here
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default EntryHero;


import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import CountdownTimer from "../timer";
import {ArrowLeft} from "lucide-react";

type HeroProps = {
  hero: [string, string];
};
const EntryHero = ({ hero }: HeroProps) => {
  const [title, description] = hero;
  // bg-[url('/images/background-programs.png')]
  return (
    <div
      className="flex flex-col
        h-133 bg-cover 
        bg-center bg-[linear-gradient(0deg,rgba(5,12,26,1.0)_0%,rgba(5,12,26,0.2)_100%)] relative"
      >
      <Image
        src="/images/stars-hero-programs.png"
        alt="stars"
        fill
        className="absolute top-0 left-0 w-full object-cover -z-10"
      ></Image>


      <div className="
      mt-20 ml-3
      ">
        <Link href="/programs" className="flex gap-2 bg-[var(--color-primary-800)] text-[14px] font-bold px-4.5 py-3 rounded-[5px] w-fit">
          <ArrowLeft size={20} color="white"/>
          <p className="text-white ">Kembali</p>
        </Link>
      </div>

      <div
        className="
        flex
        flex-col
        items-center
        justify-center
        relative
        w-full
      "
      >
        {/* bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)] */}

        <div className="flex-col items-center justify-center 
        px-4
        md:px-10
        lg:px-15

        mt-11
        ">
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-5 items-center justify-center">
                <div className="text-white border-solid border-1 rounded-[5px] px-4.5 py-1.5 border-white">
                  <CountdownTimer targetDate={"2025-06-30T23:59:59"}/>
                </div>

                <div>
                  <p className="text-[var(--color-neutral-50)] bg-[var(--color-primary-800)] font-bold px-4.5 py-3 rounded-[5px]
                  text-[12px]
                  sm:text-[18px]
                  ">
                    Beginner Level
                  </p>
                </div>
              </div>

              <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center font-bold
              text-[22px]
              md:text-[30px]
              lg:text-[46px]
              ">
                {title}
              </p>
              <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center 
              text-[14px]
              md:text-[20px]
              lg:text-[27px]
              ">
                {description}
              </p>
            </div>

            <Link href="/register">
              <Button>Begin Your Journey Here!</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryHero;
