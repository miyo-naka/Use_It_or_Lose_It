'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-10 mt-16">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 drop-shadow">Use It Or Lose It</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl">
        <Link href="/words" className="group bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:bg-indigo-50 transition">
          <span className="text-2xl font-bold text-indigo-600 mb-2">単語一覧</span>
          <span className="text-gray-500">登録済みの単語を確認・編集</span>
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition">開く</button>
        </Link>
        <Link href="/quiz" className="group bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:bg-indigo-50 transition">
          <span className="text-2xl font-bold text-indigo-600 mb-2">クイズ</span>
          <span className="text-gray-500">ランダム出題で実力チェック</span>
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition">挑戦する</button>
        </Link>
        <Link href="/progress" className="group bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:bg-indigo-50 transition">
          <span className="text-2xl font-bold text-indigo-600 mb-2">進捗</span>
          <span className="text-gray-500">学習状況・統計を確認</span>
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition">見る</button>
        </Link>
      </div>
    </section>
  );
}
