'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/"
              className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
                pathname === '/' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Checkout
            </Link>
            <Link 
              href="/orders"
              className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
                pathname === '/orders' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pedidos
            </Link>
            <Link 
              href="/status"
              className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
                pathname === '/status' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Status
            </Link>
            <Link 
              href="/admin"
              className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
                pathname === '/admin' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 