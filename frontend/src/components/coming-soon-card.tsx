import Image from "next/image";

const ComingSoonCard = () => {
  return (
    <div
      className="
      flex 
      sm:flex-row 
      sm:w-123

      md:flex-col
      md:w-75
      md:h-100
    bg-neutral-900 rounded-lg"
    >
      <div
        className="
        h-42
        mask-r-from-90%

        sm:w-60
        sm:h-auto
        sm:min-h-85

        md:w-75 
        md:h-100
        md:mask-b-from-90%
        md:mask-r-from-100%
        rounded-lg"
      >

        <div className="flex flex-row md:flex-col h-full">
            <div className="justify-between bg-neutral-900 w-full flex xl:flex-col flex-row h-full">
              <div className="relative rounded-lg overflow-hidden aspect-square"> {/* Added relative, rounded-lg, and overflow-hidden */}
                <Image
                  src={"/images/mentor-coming-soon.webp"}
                  alt="mentor"
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-b from-transparent to-neutral-900" /> {/* Corrected gradient class */}
              </div>
              <p className="lg:leading-17 mx-5 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-left text-[18px] lg:text-[22px] font-bold items-end">To Be Announced.</p>
            </div>
        </div>
      </div>
  </div>
  )
}

export default ComingSoonCard;