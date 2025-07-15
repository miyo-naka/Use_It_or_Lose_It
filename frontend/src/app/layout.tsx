"use client";

import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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
