<?php

namespace Database\Seeders;

use App\Models\Word;
use Illuminate\Database\Seeder;

class WordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $words = [
            [
                'word' => 'apple',
                'meaning' => 'りんご',
                'part_of_speech' => 'noun',
                'example_sentence' => 'I eat an apple every day.',
            ],
            [
                'word' => 'beautiful',
                'meaning' => '美しい',
                'part_of_speech' => 'adjective',
                'example_sentence' => 'She is a beautiful woman.',
            ],
            [
                'word' => 'run',
                'meaning' => '走る',
                'part_of_speech' => 'verb',
                'example_sentence' => 'I run in the park every morning.',
            ],
            [
                'word' => 'quickly',
                'meaning' => '素早く',
                'part_of_speech' => 'adverb',
                'example_sentence' => 'He quickly finished his homework.',
            ],
            [
                'word' => 'computer',
                'meaning' => 'コンピューター',
                'part_of_speech' => 'noun',
                'example_sentence' => 'I use my computer to work.',
            ],
            [
                'word' => 'happy',
                'meaning' => '幸せな',
                'part_of_speech' => 'adjective',
                'example_sentence' => 'I am happy to see you.',
            ],
            [
                'word' => 'study',
                'meaning' => '勉強する',
                'part_of_speech' => 'verb',
                'example_sentence' => 'I study English every day.',
            ],
            [
                'word' => 'slowly',
                'meaning' => 'ゆっくりと',
                'part_of_speech' => 'adverb',
                'example_sentence' => 'He walks slowly.',
            ],
            [
                'word' => 'book',
                'meaning' => '本',
                'part_of_speech' => 'noun',
                'example_sentence' => 'I read a book before bed.',
            ],
            [
                'word' => 'tall',
                'meaning' => '背が高い',
                'part_of_speech' => 'adjective',
                'example_sentence' => 'He is a tall man.',
            ],
            [
                'word' => 'write',
                'meaning' => '書く',
                'part_of_speech' => 'verb',
                'example_sentence' => 'I write in my diary.',
            ],
            [
                'word' => 'carefully',
                'meaning' => '注意深く',
                'part_of_speech' => 'adverb',
                'example_sentence' => 'She drives carefully.',
            ],
            [
                'word' => 'teacher',
                'meaning' => '教師',
                'part_of_speech' => 'noun',
                'example_sentence' => 'My teacher is very kind.',
            ],
            [
                'word' => 'smart',
                'meaning' => '賢い',
                'part_of_speech' => 'adjective',
                'example_sentence' => 'She is a smart student.',
            ],
            [
                'word' => 'speak',
                'meaning' => '話す',
                'part_of_speech' => 'verb',
                'example_sentence' => 'I speak English fluently.',
            ],
        ];

        foreach ($words as $wordData) {
            Word::create($wordData);
        }
    }
} 