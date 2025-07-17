<?php

namespace App\Http\Controllers;

use App\Models\Word;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use App\Http\Requests\StoreWordRequest;
use App\Http\Requests\UpdateWordRequest;
use Illuminate\Support\Facades\Storage;

class WordController extends Controller
{
    /**
     * 単語一覧を取得
     */
    public function index(Request $request): JsonResponse
    {
        $query = Word::query();

        // 検索フィルター
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('word', 'like', "%{$search}%")
                  ->orWhere('meaning', 'like', "%{$search}%");
            });
        }

        // 品詞フィルター
        if ($request->has('part_of_speech')) {
            $query->where('part_of_speech', $request->get('part_of_speech'));
        }

        // ソート機能
        $sortBy = $request->get('sort_by', 'created_at'); // デフォルトは登録日
        $sortOrder = $request->get('sort_order', 'desc'); // デフォルトは降順

        switch ($sortBy) {
            case 'word':
                // ABC順（単語名）
                $query->orderBy('word', $sortOrder);
                break;
            case 'part_of_speech':
                // 品詞順
                $query->orderBy('part_of_speech', $sortOrder);
                break;
            case 'created_at':
                // 登録日順
                $query->orderBy('created_at', $sortOrder);
                break;
            case 'updated_at':
                // 更新日順
                $query->orderBy('updated_at', $sortOrder);
                break;
            default:
                // デフォルトは登録日降順
                $query->orderBy('created_at', 'desc');
                break;
        }

        $words = $query->with('mistakes')
                      ->paginate(20);

        return response()->json($words);
    }

    /**
     * 特定の単語を取得
     */
    public function show(Word $word): JsonResponse
    {
        $word->load('mistakes');
        
        return response()->json([
            'word' => $word,
            'correct_rate' => $word->correct_rate,
            'last_mistake_date' => $word->last_mistake_date,
        ]);
    }

    /**
     * 新しい単語を作成
     */
    public function store(StoreWordRequest $request): JsonResponse
    {
        $word = Word::create($request->validated());
        return response()->json($word, 201);
    }

    /**
     * 単語を更新
     */
    public function update(UpdateWordRequest $request, Word $word): JsonResponse
    {
        $word->update($request->validated());
        return response()->json($word);
    }

    /**
     * 単語を削除
     */
    public function destroy(Word $word): JsonResponse
    {
        $word->delete();

        return response()->json(['message' => '単語が削除されました']);
    }

    /**
     * 統計情報を取得
     */
    public function stats(): JsonResponse
    {
        $totalWords = Word::count();
        $wordsWithMistakes = Word::whereHas('mistakes')->count();
        $averageCorrectRate = Word::with('mistakes')->get()->avg('correct_rate');

        return response()->json([
            'total_words' => $totalWords,
            'words_with_mistakes' => $wordsWithMistakes,
            'average_correct_rate' => round($averageCorrectRate, 2),
        ]);
    }

    /**
     * CSVファイルから単語を一括インポート
     */
    public function importCsv(Request $request): JsonResponse
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048', // 2MB制限
        ]);

        $file = $request->file('csv_file');
        $path = $file->store('temp');
        $fullPath = Storage::path($path);

        try {
            $importedCount = 0;
            $errors = [];
            $lineNumber = 0;

            if (($handle = fopen($fullPath, 'r')) !== false) {
                // ヘッダー行をスキップ
                $header = fgetcsv($handle);
                $lineNumber++;

                while (($data = fgetcsv($handle)) !== false) {
                    $lineNumber++;
                    
                    // CSVの列数チェック（word, meaning, part_of_speech, example_sentence）
                    if (count($data) < 3) {
                        $errors[] = "行 {$lineNumber}: 列数が不足しています（最低3列必要）";
                        continue;
                    }

                    try {
                        $wordData = [
                            'word' => trim($data[0]),
                            'meaning' => trim($data[1]),
                            'part_of_speech' => trim($data[2]),
                            'example_sentence' => isset($data[3]) ? trim($data[3]) : '',
                        ];

                        // バリデーション
                        $validator = \Validator::make($wordData, [
                            'word' => 'required|string|max:255',
                            'meaning' => 'required|string|max:255',
                            'part_of_speech' => 'required|string|max:50',
                            'example_sentence' => 'nullable|string|max:500',
                        ]);

                        if ($validator->fails()) {
                            $errors[] = "行 {$lineNumber}: " . implode(', ', $validator->errors()->all());
                            continue;
                        }

                        // 重複チェック
                        $existingWord = Word::where('word', $wordData['word'])->first();
                        if ($existingWord) {
                            $errors[] = "行 {$lineNumber}: 単語{$wordData['word']}' は既に存在します";
                            continue;
                        }

                        Word::create($wordData);
                        $importedCount++;

                    } catch (\Exception $e) {
                        $errors[] = "行 {$lineNumber}: 処理中にエラーが発生しました - " . $e->getMessage();
                    }
                }
                fclose($handle);
            }

            // 一時ファイルを削除
            Storage::delete($path);

            return response()->json([
                'message' => "インポートが完了しました",
                'imported_count' => $importedCount,
                'errors' => $errors,
                'total_errors' => count($errors),
            ]);

        } catch (\Exception $e) {
            // 一時ファイルを削除
            Storage::delete($path);
            
            return response()->json([
                'message' => "CSVファイルの処理中にエラーが発生しました",
                'error' => $e->getMessage(),
            ], 500);
        }
    }
} 