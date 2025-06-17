import { HelpAccordion, HelpAccordionContent, HelpAccordionItem, HelpAccordionTrigger } from "../ui/help-faq-button";

const AnswerQuestion = [
    {
        question: "Ini khusus mahasiswa UGM aja atau terbuka untuk umum?",
        answer: <>Kegiatan ini terbuka untuk <strong>siapa saja</strong>, tidak terbatas hanya untuk mahasiswa UGM. Jadi, <strong>dari mana pun kamu berasal</strong>, kamu tetap bisa ikut dan berpartisipasi.</>,
    },
    {
        question: "Saya benar-benar pemula, apakah tetap bisa ikut?",
        answer: <>Tentu saja! Kelas Entry kami <strong>sangat cocok untuk pemula</strong>. Materinya disusun secara bertahap dan mentor akan membimbingmu dengan <strong>pendekatan yang ramah dan mudah dipahami</strong>.</>,
    },
    {
        question: "Boleh ambil lebih dari satu kelas di level yang sama?",
        answer: <>Untuk saat ini, hanya diperbolehkan <strong>satu kelas per level</strong>. Kami ingin memastikan kamu bisa fokus dan mendapatkan <strong>pengalaman belajar yang optimal</strong> di setiap tahap.</>,
    },
    {
        question: "Apakah saya bisa mengikuti lebih dari satu kelas?",
        answer: <>Bisa, namun dengan ketentuan: kamu hanya dapat mengambil <strong>maksimal 1 kelas Entry dan 1 kelas Intermediate</strong>, atau langsung memilih <strong>Bundling Package yang sudah mencakup keduanya</strong>.</>,
    },
    {
        question: "Apakah kelas yang sudah dibayar bisa diganti?",
        answer: <>Sayangnya, <strong>kelas yang sudah dibayar tidak dapat diganti</strong>. Karena itu, penting untuk memilih kelas yang <strong>paling sesuai dengan kebutuhan dan minatmu</strong> sejak awal.</>,
    },
    {
        question: "Apakah pembayaran bisa direfund?",
        answer: <>Mohon maaf, <strong>seluruh pembayaran bersifat final dan tidak dapat direfund</strong>. Pastikan kamu sudah mempertimbangkan pilihan kelasmu dengan matang sebelum melakukan pembayaran, ya!</>,
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

