"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

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
        <header className="w-full shadow bg-white/80 sticky top-0 z-10">
          <nav className="max-w-3xl mx-auto flex gap-4 px-4 py-3 items-center">
            <span className="font-bold text-xl tracking-tight mr-6 text-indigo-700">
              Use It Or Lose It
            </span>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 rounded transition font-medium ${
                  pathname === item.href
                    ? "bg-indigo-100 text-indigo-700"
                    : "hover:bg-indigo-50 text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="max-w-3xl mx-auto p-6 sm:p-10 flex flex-col items-center min-h-[80vh]">
          {children}
        </main>
        <footer className="text-center text-xs text-gray-400 py-4">
          &copy; {new Date().getFullYear()} Use It Or Lose It
        </footer>
      </body>
    </html>
  );
}
