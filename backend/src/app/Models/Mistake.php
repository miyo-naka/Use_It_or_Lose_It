<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mistake extends Model
{
    use HasFactory;

    protected $fillable = [
        'word_id',
        'attempted_at',
        'correct',
    ];

    protected $casts = [
        'attempted_at' => 'datetime',
        'correct' => 'boolean',
    ];

    /**
     * この間違い記録に関連する単語を取得
     */
    public function word(): BelongsTo
    {
        return $this->belongsTo(Word::class);
    }
} 