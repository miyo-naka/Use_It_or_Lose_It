'use client';

import { apiFetch } from '@/lib/api';
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
    // 回答をAPIに送信
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
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">クイズ終了！</h1>
      <div className="mb-4">スコア: {score} / {questions.length}</div>
      <a href="/quiz" className="underline text-blue-600">もう一度挑戦</a>
    </main>
  );
  if (!questions.length) return <div className="p-8">問題がありません</div>;

  const q = questions[current];
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">クイズ</h1>
      <div className="mb-2">{current + 1} / {questions.length}</div>
      <div className="mb-4">
        <span className="font-bold">{q.word}</span>（{q.part_of_speech}）
      </div>
      <div className="space-y-2 mb-4">
        {q.choices.map(choice => (
          <button
            key={choice}
            className={`block w-full text-left px-4 py-2 border rounded ${selected === choice ? (choice === q.correct_answer ? 'bg-green-200' : 'bg-red-200') : 'bg-white'}`}
            disabled={!!selected}
            onClick={() => handleAnswer(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      {result && <div className="mb-4 font-bold">{result}</div>}
    </main>
  );
} 