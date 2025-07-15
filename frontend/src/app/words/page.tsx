// ※ このファイルを利用するには 'react' および '@types/react' の依存が必要です。
//   例: npm install react react-dom @types/react @types/react-dom

'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

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
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ data: Word[] }>('/words')
      .then(res => setWords(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">単語一覧</h1>
      {loading && <div>読み込み中...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2">単語</th>
            <th className="border px-2">意味</th>
            <th className="border px-2">品詞</th>
            <th className="border px-2">例文</th>
          </tr>
        </thead>
        <tbody>
          {words.map(word => (
            <tr key={word.id}>
              <td className="border px-2">{word.word}</td>
              <td className="border px-2">{word.meaning}</td>
              <td className="border px-2">{word.part_of_speech}</td>
              <td className="border px-2">{word.example_sentence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
} 