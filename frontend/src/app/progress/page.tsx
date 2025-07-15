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

const rateColors: Record<string, string> = {
  '80%以上': 'bg-green-400',
  '60-79%': 'bg-blue-400',
  '40-59%': 'bg-yellow-400',
  '40%未満': 'bg-red-400',
  '未回答': 'bg-gray-300',
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

  // グラフ用合計
  const total = Object.values(data.progress_by_rate).reduce((a, b) => a + b, 0);

  return (
    <section className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">進捗</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-extrabold text-indigo-600">{data.total_words}</div>
          <div className="text-gray-500 mt-1">総単語数</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-extrabold text-indigo-600">{data.words_with_mistakes}</div>
          <div className="text-gray-500 mt-1">間違い記録のある単語</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-extrabold text-indigo-600">{data.words_without_mistakes}</div>
          <div className="text-gray-500 mt-1">未挑戦の単語</div>
        </div>
      </div>
      <h2 className="text-xl font-bold mt-6 mb-2 text-indigo-700">正解率分布</h2>
      <div className="flex gap-2 mb-6">
        {Object.entries(data.progress_by_rate).map(([label, count]) => (
          <div key={label} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full mb-1 ${rateColors[label] || 'bg-gray-200'}`}></div>
            <div className="text-xs font-bold">{label}</div>
            <div className="text-xs">{count}語</div>
            <div className="w-8 h-2 bg-gray-200 rounded-full mt-1">
              <div className={`${rateColors[label] || 'bg-gray-200'} h-2 rounded-full`} style={{ width: `${(count / total) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-6 mb-2 text-indigo-700">最近間違えた単語（7日以内）</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border px-3 py-2">単語</th>
              <th className="border px-3 py-2">意味</th>
              <th className="border px-3 py-2">品詞</th>
            </tr>
          </thead>
          <tbody>
            {data.recent_mistakes.map(w => (
              <tr key={w.id}>
                <td className="border px-3 py-2 font-semibold text-indigo-700">{w.word}</td>
                <td className="border px-3 py-2">{w.meaning}</td>
                <td className="border px-3 py-2">{w.part_of_speech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
} 