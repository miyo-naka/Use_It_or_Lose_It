import React from "react";

export type CsvImportResult = {
  message: string;
  imported_count: number;
  errors: string[];
  total_errors: number;
};

type CsvImportProps = {
  onImport: (file: File) => Promise<CsvImportResult>;
  onImportSuccess?: (result: CsvImportResult) => void;
  onError?: (error: string) => void;
  loading?: boolean;
  result?: CsvImportResult | null;
};

const CsvImport: React.FC<CsvImportProps> = ({
  onImport,
  onImportSuccess,
  onError,
  loading = false,
  result,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (!file) return;
    try {
      const res = await onImport(file);
      onImportSuccess?.(res);
    } catch (e: any) {
      onError?.(e.message || "インポート中にエラーが発生しました");
    } finally {
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
    <div className="flex gap-2 items-center">
      <label className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold shadow hover:bg-green-600 transition cursor-pointer">
        📁 CSVインポート
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          className="hidden"
          disabled={loading}
          ref={fileInputRef}
        />
      </label>
      <button
        onClick={downloadCsvTemplate}
        className="px-4 py-2 bg-gray-500 text-white rounded-full font-semibold shadow hover:bg-gray-600 transition"
        type="button"
      >
        テンプレート
      </button>
      {loading && (
        <span className="ml-2 text-blue-700 text-sm">インポート中...</span>
      )}
    </div>
  );
};

export default CsvImport; 