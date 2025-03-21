'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
}

export default function Header() {
  const pathname = usePathname();
  
  const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/practice', label: 'Practice Tests' },
    { href: '/instruments', label: 'Instruments' },
  ];
  
  return (
    <header className="py-4 mb-8 border-b">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold mb-4 sm:mb-0">
          ASVAB Project
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors ${
                    pathname === link.href
                      ? 'text-primary font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
} 
