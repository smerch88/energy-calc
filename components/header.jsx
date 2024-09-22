'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '@/public/logo.png';
import Image from 'next/image';

export function HeaderComponent() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <Image src={logo} alt="logo" className="w-8 h-8" />
                            {/* <span className="ml-2 text-xl font-bold text-gray-800">Logo</span> */}
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-4">
                        <Link href="#" className="text-gray-600 hover:text-gray-900">
                            Партнери
                        </Link>
                        <Link href="#" className="text-gray-600 hover:text-gray-900">
                            Контакти
                        </Link>
                    </nav>
                    <div className="md:hidden">
                        <button
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                            onClick={toggleMenu}
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile menu, show/hide based on menu state */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link
                        href="/"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                        About
                    </Link>
                    <Link
                        href="/services"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                        Services
                    </Link>
                    <Link
                        href="/contact"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </header>
    );
}
