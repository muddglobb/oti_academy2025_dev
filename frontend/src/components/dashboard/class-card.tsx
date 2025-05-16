import { UsersType } from "@/types/users-type"
import { ClassData } from "@/types/users-type"
import Image from "next/image"

export const CardClass = async () => {
    return (
        <div className="flex flex-row max-w-125">
            <div>
                <Image
                    src="/images/class-card.png"
                    alt="class-card"
                    width={300}
                    height={200}
                    className="rounded-lg"
                />
            </div>
            <div>
                {/* tulisan */}
                <h1>

                </h1>
                <p>

                </p>
                <div>
                    {/* pic */}
                </div>
                <div>
                    {/* button */}
                </div>
                <p>
                    {/* session */}
                </p>
            </div>
        </div>
    )
}

// export default CardClass