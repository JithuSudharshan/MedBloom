import Button from './Button';

const Navbar = () => {
    const navLinks = [
        { label: 'Home', href: '#', active: true },
        { label: 'About Us', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Find Doctors', href: '#doctors' },
        { label: 'Login', href: '/login' },
        { label: 'Admin', href: '/admin/login' },
        { label: 'Articles', href: '#articles' }
    ];

    return (
        <nav className="bg-white py-4 px-8 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold text-gray-900">
                    MEDBLOOM
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    {navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${link.active
                                ? 'text-white bg-teal-600 px-4 py-2 rounded-full'
                                : 'text-gray-700 hover:text-teal-600'
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* CTA Button */}
                <Button variant="primary" size="md">
                    Book Now
                </Button>
            </div>
        </nav>
    )
}

export default Navbar;
