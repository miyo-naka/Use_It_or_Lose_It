'use client';

import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import * as React from 'react';

interface QuizQuestion {
  id: number;
  word: string;
  part_of_speech: string;
  choices: string[];
  correct_answer: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [current, setCurrent] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [finished, setFinished] = React.useState(false);
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    apiFetch<{ questions: QuizQuestion[] }>('/quiz')
      .then(res => {
        setQuestions(res.questions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAnswer = async (choice: string) => {
    if (!questions[current]) return;
    setSelected(choice);
    const isCorrect = choice === questions[current].correct_answer;
    setResult(isCorrect ? '正解！' : '不正解');
    if (isCorrect) setScore(s => s + 1);
    await apiFetch('/quiz/answer', {
      method: 'POST',
      body: JSON.stringify({
        word_id: questions[current].id,
        answer: choice,
        is_correct: isCorrect,
      }),
    });
    setTimeout(() => {
      setSelected(null);
      setResult(null);
      if (current + 1 < questions.length) {
        setCurrent(c => c + 1);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  if (loading) return <div className="p-8">読み込み中...</div>;
  if (finished) return (
    <section className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mt-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">クイズ終了！</h1>
      <div className="mb-4 text-lg">スコア: <span className="font-bold text-indigo-600">{score} / {questions.length}</span></div>
      <div className='flex gap-4'>
      <Link href="/quiz" className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-full font-semibold shadow hover:bg-indigo-600 transition">もう一度挑戦</Link>
        <Link href="/" className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-full font-semibold shadow hover:bg-indigo-600 transition">ホームへ</Link>
      </div>
    </section>
  );
  if (!questions.length) return <div className="p-8">問題がありません</div>;

  const q = questions[current];
  return (
    <section className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mt-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">クイズ</h1>
      {/* 進捗バー */}
      <div className="w-full bg-indigo-100 rounded-full h-3 mb-6">
        <div className="bg-indigo-500 h-3 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="mb-2 text-lg">{current + 1} / {questions.length}</div>
      <div className="mb-4 text-xl font-bold text-indigo-600">{q.word} <span className="text-base text-gray-500">（{q.part_of_speech}）</span></div>
      <div className="space-y-3 mb-4 w-full">
        {q.choices.map(choice => (
          <button
            key={choice}
            className={`block w-full text-left px-6 py-3 border rounded-lg text-lg font-semibold shadow transition-all
              ${selected === choice ? (choice === q.correct_answer ? 'bg-green-200 border-green-400' : 'bg-red-200 border-red-400') : 'bg-white hover:bg-indigo-50 border-indigo-100'}`}
            disabled={!!selected}
            onClick={() => handleAnswer(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      {result && (
        <div className={`mb-4 font-bold text-lg ${result === '正解！' ? 'text-green-600' : 'text-red-600'}`}>{result}</div>
      )}
    </section>
  );
} 