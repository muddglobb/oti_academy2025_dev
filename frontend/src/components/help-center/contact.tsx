import { Button } from "../ui/button"

const Contact = () => {
    return (
        <div className="border-2 border-neutral-500 rounded-[20px] p-5">
            <h1 className="text-neutral-50 text-[14px] lg:text-[18px] font-bold border-b-2 border-neutral-500 pb-3">
                Contact Person
            </h1>
            <p className="text-neutral-50 pt-4 text-[12px]">
                Butuh Bantuan atau Masih Bingung? Tenang, kamu nggak sendiri! Kalau ada pertanyaan lebih lanjut atau mengalami kendala, kamu bisa langsung hubungi contact person kami (Azka) melalui WhatsApp:
            </p>
            <div className="flex justify-end my-3">
                <a href="https://wa.me/6281906340991" target="_blank">
                    <Button className="text-[12px] px-4 py-3">
                        Hubungi Sekarang
                    </Button>
                </a>
            </div>
        </div>
    )
}

export default Contact