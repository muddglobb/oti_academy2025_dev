import Container from '@/components/container'

const navbarItems = [
    { name: 'About Us', href: '/about' },
    { name: 'Programs', href: '/programs' },
    { name: 'Log In', href: '/login' }   
]

const Navbar = async () => {

    return (
        <main className="fixed inset-x-0 top-0 z-10 backdrop-blur-md">
            <Container className="flex-row items-center justify-between py-4">
                <div className='flex items-end'>
                    
                </div>
                <div className='flex items-end'>
                    <nav className="flex gap-4">
                        {navbarItems.map((item) => (
                            <a key={item.name} href={item.href} className="text-white hover:bg-neutral-200/20 rounded-md px-3 py-2">
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </Container>
        </main>
    )
}

export default Navbar