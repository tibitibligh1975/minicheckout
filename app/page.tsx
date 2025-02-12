import MiniCheckout from "@/components/MiniCheckout";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full p-4 border-b">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Nome da Empresa</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <MiniCheckout />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-4 border-t">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>Precisa de ajuda? Entre em contato com nosso suporte</p>
          <p>suporte@empresa.com.br | (11) 9999-9999</p>
        </div>
      </footer>
    </div>
  );
} 