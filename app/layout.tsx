import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mini Checkout",
  description: "Sistema de checkout com PIX",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}