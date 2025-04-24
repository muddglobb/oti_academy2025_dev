import Container from '@/components/container'
import { Button } from '../ui/button'
import Link from 'next/link'
import Logo from './logo'


const navbarItems = [
    { name: 'About Us', href: '/about' },
    { name: 'Programs', href: '/programs'},
    { name: 'Log In', href: '/login' }
]

const Navbar = () => {
    return (
        <main className="fixed inset-x-0 top-0 z-10 backdrop-blur-md">
            <Container className="flex-row items-center justify-between py-4">
                <div className='flex items-end'>
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>
                <div className='flex items-end'>
                    <nav className="flex gap-4 items-center">
                        {navbarItems.map((item) => (
                            <a key={item.name} href={item.href} className="text-white text-base hover:bg-neutral-200/20 rounded-md lg:px-3 lg:py-2 active:font-bold">
                                {item.name}
                            </a>
                        ))}
                        <Link href="/register">
                            <Button>
                                Get Started
                            </Button>
                        </Link>
                    </nav>
                </div>
            </Container>
        </main>
    );
}


export default Navbar