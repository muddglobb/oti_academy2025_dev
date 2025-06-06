// import React from "react";
// import Image from "next/image";
// import IntermediateSlider from "@/components/intermediate-slider";

// const IntermediateClass = () => {
//   // bg-[url('/images/intermediate-background.png')]
//   return (
//     <div
//       className="
//         w-full
//         h-[741px]

//         bg-cover
//         bg-center
//         flex
//         flex-col
//         px-14
//         gap-11

//         justify-center
//         bg-[linear-gradient(0deg,rgba(5,12,26,0.3)_0%,rgba(5,12,26,0.9)_100%)]
//         relative
//         "
//     >
//       {/* bg-[linear-gradient(0deg,rgba(5,12,26,0.9)_0%,rgba(5,12,26,0.3)_100%)] */}
//       <Image
//         src="/images/stars-intermediate-programs.png"
//         alt="stars"
//         fill
//         className="absolute top-0 left-0 w-full object-cover -z-10"
//       ></Image>

//       <div>
// <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[32px] font-bold">
//   Kelas Intermediate untuk Naik Level Skill-mu
// </p>
// <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[18px]">
//   Saatnya naik ke level berikutnya buat kamu yang udah paham dasar-dasar
//   dan siap eksplor lebih dalam dari{" "}
//   <span className="font-bold">1 juni - 15 juni 2025</span>
// </p>
//       </div>

//       <div className="flex items-center justify-center">
//         <div className="">
//           <IntermediateSlider></IntermediateSlider>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IntermediateClass;

import React from "react";
import Image from "next/image";
import IntermediateSlider from "@/components/intermediate-slider";

const IntermediateClass = () => {
  // bg-[url('/images/background-programs.png')]
  return (
    <>
      <div
        id="intermediate-class"
        className="invisible h-0 scroll-mt-2 md:scroll-mt-[3rem]"
        aria-hidden="true"
      />
      <div
        className="w-full h-200 bg-cover bg-center flex flex-col items-center justify-center
          bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.9)_100%)]
          relative
        "
      >
        <div className="flex-col items-center justify-center 
        px-10
        lg:px-60">
          {/* bintang dan planet */}
          <>
            <Image
              src="/images/stars-intermediate-programs.png"
              // src="/images/tes_bg.jpg"
              alt="stars"
              fill
              className="absolute top-0 left-0 w-full object-cover -z-1"
            ></Image>
          </>

          {/* isi */}
          <>
            <div className="mb-11">
              <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center 
              text-[22px]
              lg:text-[32px] font-bold">
                Kelas Intermediate untuk Naik Level Skill-mu
              </p>
              <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center 
              text-[14px]
              lg:text-[18px]">
                Saatnya naik ke level berikutnya buat kamu yang udah paham
                dasar-dasar dan siap eksplor lebih dalam dari{" "}
                <span className="font-bold">1 juni - 15 juni 2025</span>
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="">
                <IntermediateSlider />
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default IntermediateClass;
