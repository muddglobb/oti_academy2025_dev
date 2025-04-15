import Image from "next/image";
import Link from "next/link";

const Logo = () => {
    return (
        <Link href="/" className="flex items-center">
        <Image
            src="" //belom ada logonya, belom ada directorynya juga
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
        />
        <span className="text-2xl font-bold">MyApp</span>
        </Link>
    );
}