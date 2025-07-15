<?php

namespace App\Http\Controllers;

use App\Models\Word;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use App\Http\Requests\StoreWordRequest;
use App\Http\Requests\UpdateWordRequest;

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

        // 正解率でソート
        if ($request->has('sort_by_correct_rate')) {
            $query->withCount(['mistakes as total_attempts'])
                  ->withCount(['mistakes as correct_attempts' => function ($q) {
                      $q->where('correct', true);
                  }]);
        }

        $words = $query->with('mistakes')
                      ->orderBy('created_at', 'desc')
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
} 