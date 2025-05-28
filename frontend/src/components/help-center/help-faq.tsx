import { HelpAccordion, HelpAccordionContent, HelpAccordionItem, HelpAccordionTrigger } from "../ui/help-faq-button";

const AnswerQuestion = [
    {
        question: "Saya benar-benar pemula, apakah tetap bisa ikut?",
        answer: "Tentu saja! Kelas Entry kami sangat cocok untuk pemula. Materinya disusun secara bertahap dan mentor akan membimbingmu dengan pendekatan yang ramah dan mudah dipahami.",
    },
    {
        question: "Boleh ambil lebih dari satu kelas di level yang sama?",
        answer: "Untuk saat ini, hanya diperbolehkan satu kelas per level. Kami ingin memastikan kamu bisa fokus dan mendapatkan pengalaman belajar yang optimal di setiap tahap.",
    },
    {
        question: "Apakah saya bisa mengikuti lebih dari satu kelas?",
        answer: "Bisa, namun dengan ketentuan: kamu hanya dapat mengambil maksimal 1 kelas Entry dan 1 kelas Intermediate, atau langsung memilih Bundling Package yang sudah mencakup keduanya.",
    },
    {
        question: "Apakah kelas yang sudah dibayar bisa diganti?",
        answer: "Sayangnya, kelas yang sudah dibayar tidak dapat diganti. Karena itu, penting untuk memilih kelas yang paling sesuai dengan kebutuhan dan minatmu sejak awal.",
    },
    {
        question: "Apakah pembayaran bisa direfund?",
        answer: "Mohon maaf, seluruh pembayaran bersifat final dan tidak dapat direfund. Pastikan kamu sudah mempertimbangkan pilihan kelasmu dengan matang sebelum melakukan pembayaran, ya!",
    },
]

const HelpFAQ = () => {
    return (
        <div className="border-2 border-neutral-500 rounded-[20px] p-5">
            <h1 className="text-neutral-50 text-[14px] lg:text-[18px] font-bold border-b-2 border-neutral-500 pb-3">
              Frequently Asked Questions
            </h1>
            <div className="flex flex-col pt-4">
              <HelpAccordion
                type="single"
                collapsible
                className="flex flex-col gap-2"
              >
                {AnswerQuestion.map((item, index) => (
                  <HelpAccordionItem
                    key={index}
                    value={`item-${index + 1}`}
                    className="flex flex-col"
                  >
                    <HelpAccordionTrigger>{item.question}</HelpAccordionTrigger>
                    <HelpAccordionContent>
                      <div>
                        <p className="text-[12px] border-t-2 border-neutral-500 pt-3">
                          {item.answer}
                        </p>
                      </div>
                    </HelpAccordionContent>
                  </HelpAccordionItem>
                ))}
              </HelpAccordion>
            </div>
        </div>
    )
}

export default HelpFAQ;

