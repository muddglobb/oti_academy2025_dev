import Image from "next/image"

type CommentProps = {
    nama: string;
    pic: string;
    job: string;
    comment: string;
}

const CommentCard = ({ nama, pic, job, comment }: CommentProps) => {
    return (
        <div className="flex flex-col border rounded-[10px] p-5">
            <p className="text-neutral-50 text-[14px] leading-relaxed whitespace-pre-line">{comment}</p>
            <div className="flex flex-row gap-4 mt-20">
                <Image
                    src={`/${pic}`}
                    alt="Profile Picture"
                    width={50}
                    height={50}
                    className="rounded-full"
                />
                <div>
                    <h2 className="text-neutral-50 text-[18px] font-bold">{nama}</h2>
                    <p className="text-neutral-50 text-[14px]">{job}</p>
                </div>
            </div>
        </div>
    )
}

export default CommentCard