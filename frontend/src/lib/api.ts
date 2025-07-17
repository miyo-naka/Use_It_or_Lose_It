import { Word } from '@/types/word';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    // credentials: 'include', // 認証が必要な場合
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// 単語一覧取得（ページネーション対応）
export async function fetchWords(
  page: number = 1,
  sortBy: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<PaginatedResponse<Word>> {
  const params = new URLSearchParams({
    page: page.toString(),
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  return apiFetch<PaginatedResponse<Word>>(`/words?${params.toString()}`);
}

// 単語追加
export async function addWord(data: Omit<Word, 'id' | 'created_at' | 'updated_at'>): Promise<Word> {
  return apiFetch<Word>('/words', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 単語編集
export async function updateWord(id: number, data: Omit<Word, 'id' | 'created_at' | 'updated_at'>): Promise<Word> {
  return apiFetch<Word>(`/words/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 単語削除
export async function deleteWord(id: number): Promise<void> {
  await apiFetch(`/words/${id}`, { method: 'DELETE' });
}

// CSVインポート
export async function importCsv(file: File): Promise<{
  message: string;
  imported_count: number;
  errors: string[];
  total_errors: number;
}> {
  const formData = new FormData();
  formData.append('csv_file', file);

  const res = await fetch(`${API_BASE_URL}/words/import`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
} 