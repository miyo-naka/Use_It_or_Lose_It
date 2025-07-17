"use client";

import React from "react";
import { fetchWords, PaginatedResponse, importCsv } from "@/lib/api";
import { Word } from "@/types/word";
import WordModal from "@/components/WordModal";
import Pagination from "@/components/Pagination";
import LoadingSpinner from "@/components/LoadingSpinner";

type ModalState = {
  isOpen: boolean;
  mode: "add" | "edit" | "delete";
  word?: Word;
};

type SortOption = {
  value: string;
  label: string;
};

const sortOptions: SortOption[] = [
  { value: "created_at", label: "登録日順" },
  { value: "word", label: "ABC順" },
  { value: "part_of_speech", label: "品詞順" },
  { value: "updated_at", label: "更新日順" },
];

export default function WordsPage() {
  const [words, setWords] = React.useState<Word[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [sortBy, setSortBy] = React.useState("created_at");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [importing, setImporting] = React.useState(false);
  const [importResult, setImportResult] = React.useState<{
    message: string;
    imported_count: number;
    errors: string[];
    total_errors: number;
  } | null>(null);
  const [modalState, setModalState] = React.useState<ModalState>({
    isOpen: false,
    mode: "add",
  });

  const fetchWordsData = React.useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const res: PaginatedResponse<Word> = await fetchWords(page, sortBy, sortOrder);
      setWords(res.data);
      setCurrentPage(res.current_page);
      setTotalPages(res.last_page);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("不明なエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  React.useEffect(() => {
    fetchWordsData(1);
  }, [fetchWordsData]);

  const openModal = (mode: "add" | "edit" | "delete", word?: Word) => {
    setModalState({
      isOpen: true,
      mode,
      word,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
    });
  };

  const handleSuccess = () => {
    fetchWordsData(currentPage); // 現在のページを再取得
  };

  const handlePageChange = (page: number) => {
    fetchWordsData(page);
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // 同じソート項目の場合は順序を切り替え
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 新しいソート項目の場合は降順で開始
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (!file) return;

    try {
      setImporting(true);
      setImportResult(null);
      setError(null);

      const result = await importCsv(file);
      setImportResult(result);

      // インポート成功時は現在のページを再取得
      if (result.imported_count > 0) {
        fetchWordsData(currentPage);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("インポート中にエラーが発生しました");
      }
    } finally {
      setImporting(false);
      // ファイル入力をリセット
      event.target.value = "";
    }
  };

  const downloadCsvTemplate = () => {
    const csvContent = "単語,意味,品詞,例文\nhello,こんにちは,noun,Hello, how are you?\nworld,世界,noun,The world is beautiful.\nstudy,勉強する,verb,I study English every day.";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "words_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <section className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mt-8">
        
          <h1 className="text-2xl font-bold text-indigo-700 mb-8">単語一覧</h1>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            
            <label className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold shadow hover:bg-green-600 transition cursor-pointer">
              📁 CSVインポート
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={importing}
              />
            </label>
            <button
              onClick={downloadCsvTemplate}
              className="px-4 py-2 bg-gray-500 text-white rounded-full font-semibold shadow hover:bg-gray-600 transition"
            >
              テンプレート
            </button>
            <button
              onClick={() => openModal("add")}
              className="px-4 py-2 bg-indigo-500 text-white rounded-full font-semibold shadow hover:bg-indigo-600 transition"
            >
              ＋ 単語追加
            </button>
          </div>
        </div>

        {/* インポート結果表示 */}
        {importResult && (
          <div className={`mb-4 p-4 rounded-lg ${
            importResult.total_errors === 0
              ? "bg-green-50 border border-green-200"
              : "bg-yellow-50 border border-yellow-200"
          }`}>
            <div className="font-semibold text-green-700">
              {importResult.message}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              インポート成功: {importResult.imported_count}件
              {importResult.total_errors > 0 && (
                <span className="ml-2 text-yellow-600">
                  エラー: {importResult.total_errors}件
                </span>
              )}
            </div>
            {importResult.errors.length > 0 && (
              <div className="mt-2 text-sm text-red-600">
                <div className="font-semibold">エラー詳細:</div>
                <ul className="list-disc list-inside mt-1">
                  {importResult.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {importResult.errors.length > 5 && (
                    <li>... 他 {importResult.errors.length - 5}件のエラー</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* インポート中表示 */}
        {importing && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              <span className="text-blue-700">CSVファイルをインポート中...</span>
            </div>
          </div>
        )}

        {/* ソート機能 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                sortBy === option.value
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
              {sortBy === option.value && (
                <span className="ml-1">
                  {sortOrder === "asc" ? "↑" : "↓"}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner />}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg overflow-hidden">
                <thead className="border bg-indigo-50">
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
                    <tr
                      key={word.id}
                      className={`border
                        ${i % 2 === 0 ? "bg-white" : "bg-indigo-50/50"}`}
                    >
                      <td className="border px-3 py-2 font-semibold text-indigo-700">
                        {word.word}
                      </td>
                      <td className="border px-3 py-2">{word.meaning}</td>
                      <td className="border px-3 py-2">{word.part_of_speech}</td>
                      <td className="border px-3 py-2 text-sm text-gray-500">
                        {word.example_sentence}
                      </td>
                      <td className="px-3 py-2 flex gap-2">
                        <button
                          onClick={() => openModal("edit", word)}
                          className="px-3 py-1 bg-indigo-400 text-white rounded hover:bg-indigo-500 transition text-xs"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => openModal("delete", word)}
                          className="px-3 py-1 bg-rose-400 text-white rounded hover:bg-rose-500 transition text-xs"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      <WordModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        word={modalState.word}
        onSuccess={handleSuccess}
      />
    </>
  );
}
