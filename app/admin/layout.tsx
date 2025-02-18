import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
        <nav className="space-y-2">
          <a href="/admin" className="block py-2 px-4 rounded hover:bg-gray-700">
            Dashboard
          </a>
          <a href="/admin/users" className="block py-2 px-4 rounded hover:bg-gray-700">
            Usuários
          </a>
          <a href="/admin/transactions" className="block py-2 px-4 rounded hover:bg-gray-700">
            Transações
          </a>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
} 