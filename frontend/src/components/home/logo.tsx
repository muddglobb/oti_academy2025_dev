import Image from "next/image";
import Link from "next/link";

const Logo = () => {
    return (
        <Image
            src="/logo.jpeg" 
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
        />
    );
}

export default Logo;   