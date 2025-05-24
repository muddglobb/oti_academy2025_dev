import Container from "@/components/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/faq-button";
import Image from "next/image";

const AnswerQuestion = [
  {
    question: "Lorem ipsum Dolor Sit Amet?",
    answer:
      "OmahTI Academy adalah program belajar IT yang dirancang untuk membantu peserta dari berbagai latar belakang, baik pemula maupun yang sudah berpengalaman, untuk mengembangkan keterampilan dan pengetahuan di bidang teknologi informasi.",
  },
  {
    question: "Lorem ipsum Dolor Sit Amet?",
    answer:
      "OmahTI Academy adalah program belajar IT yang dirancang untuk membantu peserta dari berbagai latar belakang, baik pemula maupun yang sudah berpengalaman, untuk mengembangkan keterampilan dan pengetahuan di bidang teknologi informasi.",
  },
  {
    question: "Lorem ipsum Dolor Sit Amet?",
    answer:
      "OmahTI Academy adalah program belajar IT yang dirancang untuk membantu peserta dari berbagai latar belakang, baik pemula maupun yang sudah berpengalaman, untuk mengembangkan keterampilan dan pengetahuan di bidang teknologi informasi.",
  },
  {
    question: "Lorem ipsum Dolor Sit Amet?",
    answer:
      "OmahTI Academy adalah program belajar IT yang dirancang untuk membantu peserta dari berbagai latar belakang, baik pemula maupun yang sudah berpengalaman, untuk mengembangkan keterampilan dan pengetahuan di bidang teknologi informasi.",
  },
  {
    question: "Lorem ipsum Dolor Sit Amet?",
    answer:
      "OmahTI Academy adalah program belajar IT yang dirancang untuk membantu peserta dari berbagai latar belakang, baik pemula maupun yang sudah berpengalaman, untuk mengembangkan keterampilan dan pengetahuan di bidang teknologi informasi.",
  },
];

const FAQ = () => {
  return (
    <div
      className="w-full bg-cover bg-center flex flex-col items-center justify-center
                bg-[linear-gradient(0deg,rgba(5,12,26,0.0)_0%,rgba(5,12,26,0.8)_100%)]
                relative
              "
    >
      <div
        className="flex-col items-center justify-center w-full px-10"
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

        <Container className="">
          <div className="pb-44 z-0">
            <h1 className="pt-44 px-4 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold">
              Frequently Asked Questions
            </h1>
            <div className="pt-5 flex flex-col">
              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-5"
              >
                {AnswerQuestion.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index + 1}`}
                    className="flex flex-col"
                  >
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <div>
                        <p className="text-[12px] lg:text-[14px] px-2 py-1 rounded-[5px]">
                          {item.answer}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default FAQ;
