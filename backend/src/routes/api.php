<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WordController;
use App\Http\Controllers\QuizController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// 単語管理API
Route::prefix('words')->group(function () {
    Route::get('/', [WordController::class, 'index']);
    Route::get('/stats', [WordController::class, 'stats']);
    Route::get('/{word}', [WordController::class, 'show']);
    Route::post('/', [WordController::class, 'store']);
    Route::post('/import', [WordController::class, 'importCsv']);
    Route::put('/{word}', [WordController::class, 'update']);
    Route::delete('/{word}', [WordController::class, 'destroy']);
});

// クイズAPI
Route::prefix('quiz')->group(function () {
    Route::get('/', [QuizController::class, 'getQuiz']);
    Route::post('/answer', [QuizController::class, 'submitAnswer']);
    Route::get('/progress', [QuizController::class, 'getProgress']);
});
