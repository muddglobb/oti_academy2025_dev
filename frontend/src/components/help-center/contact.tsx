import { Button } from "../ui/button"

const Contact = () => {
    return (
        <div className="border-2 border-neutral-500 rounded-[20px] p-5">
            <h1 className="text-neutral-50 text-[14px] lg:text-[18px] font-bold border-b-2 border-neutral-500 pb-3">
                Contact Person
            </h1>
            <div className="flex flex-col gap-7">
                <p className="text-neutral-50 pt-4 text-[12px]">
                    Masih bingung atau butuh bantuan? Tenang, kamu nggak sendiri! Langsung hubungi CP kami, Jose via WhatsApp kalau ada pertanyaan atau kendala.
                </p>
                <div className="flex justify-end">
                    <a href="https://wa.me/6281325076332" target="_blank">
                        <Button className="text-[12px] px-4 py-3">
                            Hubungi Sekarang
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Contact