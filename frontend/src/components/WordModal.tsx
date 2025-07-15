'use client';

import * as React from 'react';
import { apiFetch } from '@/lib/api';

type Word = {
  id: number;
  word: string;
  meaning: string;
  part_of_speech: string;
  example_sentence?: string;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'delete';
  word?: Word;
  onSuccess: () => void;
};

export default function WordModal({ isOpen, onClose, mode, word, onSuccess }: ModalProps) {
  const [formData, setFormData] = React.useState({
    word: '',
    meaning: '',
    part_of_speech: '',
    example_sentence: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // 編集モード時に既存データをフォームに設定
  React.useEffect(() => {
    if (mode === 'edit' && word) {
      setFormData({
        word: word.word,
        meaning: word.meaning,
        part_of_speech: word.part_of_speech,
        example_sentence: word.example_sentence || '',
      });
    } else if (mode === 'add') {
      setFormData({
        word: '',
        meaning: '',
        part_of_speech: '',
        example_sentence: '',
      });
    }
  }, [mode, word]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'add') {
        await apiFetch('/words', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      } else if (mode === 'edit' && word) {
        await apiFetch(`/words/${word.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else if (mode === 'delete' && word) {
        await apiFetch(`/words/${word.id}`, {
          method: 'DELETE',
        });
      }
      onSuccess();
      onClose();
    } catch (err:unknown) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' && '単語追加'}
            {mode === 'edit' && '単語編集'}
            {mode === 'delete' && '単語削除'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {mode === 'delete' ? (
          // 削除確認
          <div>
            <p className="mb-4 text-gray-700">
              「<span className="font-bold">{word?.word}</span>」を削除しますか？
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                disabled={loading}
              >
                {loading ? '削除中...' : '削除'}
              </button>
            </div>
          </div>
        ) : (
          // 追加・編集フォーム
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  単語 *
                </label>
                <input
                  type="text"
                  name="word"
                  value={formData.word}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  意味 *
                </label>
                <input
                  type="text"
                  name="meaning"
                  value={formData.meaning}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  品詞 *
                </label>
                <select
                  name="part_of_speech"
                  value={formData.part_of_speech}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  <option value="noun">名詞</option>
                  <option value="verb">動詞</option>
                  <option value="adjective">形容詞</option>
                  <option value="adverb">副詞</option>
                  <option value="preposition">前置詞</option>
                  <option value="conjunction">接続詞</option>
                  <option value="pronoun">代名詞</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  例文
                </label>
                <textarea
                  name="example_sentence"
                  value={formData.example_sentence}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                disabled={loading}
              >
                {loading ? '保存中...' : (mode === 'add' ? '追加' : '更新')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 