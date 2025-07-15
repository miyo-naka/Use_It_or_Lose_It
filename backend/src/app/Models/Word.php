<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Word extends Model
{
    use HasFactory;

    protected $fillable = [
        'word',
        'meaning',
        'part_of_speech',
        'example_sentence',
    ];

    /**
     * この単語に関連する間違い記録を取得
     */
    public function mistakes(): HasMany
    {
        return $this->hasMany(Mistake::class);
    }

    /**
     * 正解率を計算
     */
    public function getCorrectRateAttribute(): float
    {
        $totalAttempts = $this->mistakes()->count();
        if ($totalAttempts === 0) {
            return 0.0;
        }

        $correctAttempts = $this->mistakes()->where('correct', true)->count();
        return round(($correctAttempts / $totalAttempts) * 100, 2);
    }

    /**
     * 最後に間違えた日時を取得
     */
    public function getLastMistakeDateAttribute(): ?string
    {
        $lastMistake = $this->mistakes()
            ->where('correct', false)
            ->orderBy('attempted_at', 'desc')
            ->first();

        return $lastMistake ? $lastMistake->attempted_at : null;
    }
} 