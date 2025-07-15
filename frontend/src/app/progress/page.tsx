'use client';

import { apiFetch } from '@/lib/api';
import * as React from 'react';

type ProgressData = {
  total_words: number;
  words_with_mistakes: number;
  words_without_mistakes: number;
  progress_by_rate: Record<string, number>;
  recent_mistakes: { id: number; word: string; meaning: string; part_of_speech: string; }[];
};

export default function ProgressPage() {
  const [data, setData] = React.useState<ProgressData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiFetch<ProgressData>('/quiz/progress')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">読み込み中...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return <div className="p-8">データなし</div>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">進捗</h1>
      <div className="mb-4">総単語数: {data.total_words}</div>
      <div className="mb-4">間違い記録のある単語: {data.words_with_mistakes}</div>
      <div className="mb-4">未挑戦の単語: {data.words_without_mistakes}</div>
      <h2 className="text-xl font-bold mt-6 mb-2">正解率分布</h2>
      <ul className="mb-6">
        {Object.entries(data.progress_by_rate).map(([label, count]) => (
          <li key={label}>{label}: {count}語</li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">最近間違えた単語（7日以内）</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2">単語</th>
            <th className="border px-2">意味</th>
            <th className="border px-2">品詞</th>
          </tr>
        </thead>
        <tbody>
          {data.recent_mistakes.map(w => (
            <tr key={w.id}>
              <td className="border px-2">{w.word}</td>
              <td className="border px-2">{w.meaning}</td>
              <td className="border px-2">{w.part_of_speech}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
} 