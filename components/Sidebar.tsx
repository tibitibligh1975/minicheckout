'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  HomeIcon, 
  ChartBarIcon, 
  KeyIcon,
  CreditCardIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Vendas', href: '/dashboard/sales', icon: ChartBarIcon },
    { name: 'Chaves API', href: '/dashboard/api-keys', icon: KeyIcon },
    { name: 'Financeiro', href: '/dashboard/finance', icon: CreditCardIcon },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Mini Checkout</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-3 p-3 w-full text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
} 