// ※ このファイルを利用するには 'react' および '@types/react' の依存が必要です。
//   例: npm install react react-dom @types/react @types/react-dom

'use client';

import * as React from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

type Word = {
  id: number;
  word: string;
  meaning: string;
  part_of_speech: string;
  example_sentence?: string;
  created_at: string;
  updated_at: string;
};

export default function WordsPage() {
  const [words, setWords] = React.useState<Word[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiFetch<{ data: Word[] }>('/words')
      .then(res => setWords(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">単語一覧</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition">＋ 単語追加</button>
      </div>
      {loading && <div>読み込み中...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border px-3 py-2">単語</th>
              <th className="border px-3 py-2">意味</th>
              <th className="border px-3 py-2">品詞</th>
              <th className="border px-3 py-2">例文</th>
              <th className="border px-3 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, i) => (
              <tr key={word.id} className={i % 2 === 0 ? 'bg-white' : 'bg-indigo-50/50'}>
                <td className="border px-3 py-2 font-semibold text-indigo-700">{word.word}</td>
                <td className="border px-3 py-2">{word.meaning}</td>
                <td className="border px-3 py-2">{word.part_of_speech}</td>
                <td className="border px-3 py-2 text-sm text-gray-500">{word.example_sentence}</td>
                <td className="border px-3 py-2 flex gap-2">
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs">編集</button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs">削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
} 