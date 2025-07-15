'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Use It Or Lose It</h1>
      <nav className="space-x-4">
        <Link href="/words" className="underline text-blue-600">単語一覧</Link>
        <Link href="/quiz" className="underline text-blue-600">クイズ</Link>
        <Link href="/progress" className="underline text-blue-600">進捗</Link>
      </nav>
    </main>
  );
}
