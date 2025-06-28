import Container from "@/components/container";
import ComingSoonCard from "../coming-soon-card";
import Image from "next/image";
import * as motion from "motion/react-client"
import { fadeIn } from "@/lib/animation";

const ComingSoon = () => {
  return (
    <div
      className="w-full bg-cover bg-center flex flex-col items-center justify-center
                bg-[linear-gradient(0deg,rgba(5,12,26,0.6)_0%,rgba(5,12,26,0.8)_100%)]
                relative
                py-10
              "
    >
      <div
        className="flex-col items-center justify-center 
              px-10
              "
      >
        {/* bintang dan planet */}
        <>
          <Image
            src="/images/stars-hero-programs.png"
            // src="/images/tes_bg.jpg"
            alt="stars"
            fill
            className="absolute top-0 left-0 w-full object-cover -z-1"
          ></Image>

        </>

        {/* isi */}
        <Container className="flex flex-col gap-5 lg:gap-10">
          <div className="z-0 flex flex-col items-center justify-center py-10">
            <motion.h1 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              className="pt-10 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold"
            >
              Segera Hadir Mentor-Mentor Profesional yang Siap Membimbingmu
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              className="pt-5 lg:px-24 px-9 text-neutral-50 text-center text-[12px] sm:text-[18px] pb-10"
            >
              Mereka datang dari berbagai{" "}
              <span className="font-bold"> bidang industri</span>, siap berbagi
              ilmu dan pengalaman langsung dari dunia nyata. Khusus di{" "}
              <span className="font-bold"> Kelas Intermediate</span>, para
              mentor ini akan jadi pembimbing kamu untuk naik level dengan
              <span className="font-bold">
                {" "}
                wawasan yang praktis dan relevan
              </span>
              !
            </motion.p>
            <div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center gap-14 pb-4">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 3, delay: 0.5, type: "spring" }}
              >
                <ComingSoonCard />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 3, delay: 0.7, type: "spring" }}
              >
                <ComingSoonCard />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 3, delay: 0.9, type: "spring" }}
              >
                <ComingSoonCard />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 3, delay: 1.1, type: "spring" }}
              >
                <ComingSoonCard />
              </motion.div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ComingSoon;
