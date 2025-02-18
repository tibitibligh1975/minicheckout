'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              Home
            </Link>
            <Link href="/status" className="ml-8 flex items-center">
              Status dos Pedidos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 