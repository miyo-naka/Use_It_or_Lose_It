"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/words", label: "単語一覧" },
  { href: "/quiz", label: "クイズ" },
  { href: "/progress", label: "進捗" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html lang="ja">
      <body className="min-h-screen bg-cyan-50/30 text-gray-900">
        <Header />
        <main className="max-w-3xl mx-auto p-6 sm:p-10 flex flex-col items-center min-h-[80vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
