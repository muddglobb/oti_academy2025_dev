import React from "react";
import Image from "next/image";
import Link from "next/link";

type CardProps = {
  type: string;
  image: string;
  teacher1: string;
  teacher2?: string;
  title: string;
  href: string;
  description: string;
};

const Card = ({
  type,
  image,
  teacher1,
  teacher2,
  title,
  href,
  description,
}: CardProps) => {
  return (
    <div className="bg-[var(--color-neutral-50)] rounded-[10px] overflow-hidden w-[297px]">
      <div className="relative w-[100%] h-[284px]">
        <Image src={image} alt={title} layout="fill" objectFit="cover" />

        <div className="absolute top-0 left-0 h-[284px] flex flex-col justify-between w-[100%] p-[20px]">
          <div>
            <p className="inline-block text-[var(--color-neutral-50)] bg-[var(--color-primary-500)] px-4 py-1 rounded-[5px]">
              {type}
            </p>
          </div>

          <div className="w-[100%] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-[10px]">
                <Image
                  src={teacher1}
                  alt="Teacher 1"
                  width={29}
                  height={29}
                  className="rounded-full"
                />
                {teacher2 && (
                  <Image
                    src={teacher2}
                    alt="Teacher 2"
                    width={29}
                    height={29}
                    className="rounded-full"
                  />
                )}
              </div>
            </div>

            <p className="text-[14px]">4 Jam/Sessions</p>
          </div>
        </div>
      </div>

      <div className="p-[20px]">
        <div className="flex justify-between items-center">
          <p className="font-bold text-[18px]">{title}</p>
          <div className="bg-[var(--color-primary-500)] rounded-[5px]">
            <Link href={href}>
              <Image
                src="/link-icon.png"
                width={20}
                height={20}
                alt="Link Icon"
                className="p-[5px]"
              />
            </Link>
          </div>
        </div>

        <p className="text-[12px]">{description}</p>
      </div>
    </div>
  );
};

export default Card;
