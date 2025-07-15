<?php

namespace App\Http\Controllers;

use App\Models\Word;
use App\Models\Mistake;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    /**
     * クイズ問題を取得
     */
    public function getQuiz(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 10);
        $difficulty = $request->get('difficulty', 'mixed'); // easy, hard, mixed

        $query = Word::query();

        // 難易度に基づいて単語を選択
        switch ($difficulty) {
            case 'easy':
                // 正解率が高い単語（80%以上）または未回答の単語
                $query->where(function ($q) {
                    $q->whereDoesntHave('mistakes')
                      ->orWhereHas('mistakes', function ($subQ) {
                          $subQ->select(DB::raw('word_id, AVG(correct) as avg_correct'))
                               ->groupBy('word_id')
                               ->having('avg_correct', '>=', 0.8);
                      });
                });
                break;
            case 'hard':
                // 正解率が低い単語（50%未満）
                $query->whereHas('mistakes', function ($q) {
                    $q->select(DB::raw('word_id, AVG(correct) as avg_correct'))
                      ->groupBy('word_id')
                      ->having('avg_correct', '<', 0.5);
                });
                break;
            default:
                // mixed: 全単語からランダム選択
                break;
        }

        $words = $query->inRandomOrder()->limit($limit)->get();

        // 各単語に対して選択肢を生成
        $quizQuestions = $words->map(function ($word) {
            $choices = $this->generateChoices($word);
            
            return [
                'id' => $word->id,
                'word' => $word->word,
                'part_of_speech' => $word->part_of_speech,
                'choices' => $choices,
                'correct_answer' => $word->meaning,
            ];
        });

        return response()->json([
            'questions' => $quizQuestions,
            'total_questions' => $quizQuestions->count(),
        ]);
    }

    /**
     * クイズの回答を処理
     */
    public function submitAnswer(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'word_id' => 'required|exists:words,id',
            'answer' => 'required|string',
            'is_correct' => 'required|boolean',
        ]);

        // 間違い記録を作成
        Mistake::create([
            'word_id' => $validated['word_id'],
            'attempted_at' => now(),
            'correct' => $validated['is_correct'],
        ]);

        $word = Word::find($validated['word_id']);

        return response()->json([
            'message' => '回答が記録されました',
            'word' => $word,
            'correct_rate' => $word->correct_rate,
        ]);
    }

    /**
     * 学習進捗を取得
     */
    public function getProgress(): JsonResponse
    {
        $totalWords = Word::count();
        $wordsWithMistakes = Word::whereHas('mistakes')->count();
        $wordsWithoutMistakes = $totalWords - $wordsWithMistakes;

        // 正解率別の単語数
        $progressByRate = Word::with('mistakes')
            ->get()
            ->groupBy(function ($word) {
                $rate = $word->correct_rate;
                if ($rate === 0.0) return '未回答';
                if ($rate >= 80) return '80%以上';
                if ($rate >= 60) return '60-79%';
                if ($rate >= 40) return '40-59%';
                return '40%未満';
            })
            ->map->count();

        // 最近間違えた単語（過去7日間）
        $recentMistakes = Word::whereHas('mistakes', function ($query) {
            $query->where('correct', false)
                  ->where('attempted_at', '>=', now()->subDays(7));
        })->with('mistakes')->get();

        return response()->json([
            'total_words' => $totalWords,
            'words_with_mistakes' => $wordsWithMistakes,
            'words_without_mistakes' => $wordsWithoutMistakes,
            'progress_by_rate' => $progressByRate,
            'recent_mistakes' => $recentMistakes,
        ]);
    }

    /**
     * 選択肢を生成
     */
    private function generateChoices(Word $correctWord): array
    {
        $choices = [$correctWord->meaning];

        // 他の単語から3つの選択肢をランダムに取得
        $otherWords = Word::where('id', '!=', $correctWord->id)
            ->inRandomOrder()
            ->limit(3)
            ->pluck('meaning')
            ->toArray();

        $choices = array_merge($choices, $otherWords);
        shuffle($choices);

        return $choices;
    }
} 