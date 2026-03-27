<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\TopicController;
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::middleware('admin')->group(function () {
        // Quản lý tài khoản (chỉ admin)
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{userId}', [UserController::class, 'update']);
        Route::delete('/users/{userId}', [UserController::class, 'destroy']);
        
        Route::get('/skills', [SkillController::class, 'index']);

        // Topics
        Route::get('/topics', [TopicController::class, 'index']);
        Route::post('/topics', [TopicController::class, 'store']);
        Route::put('/topics/{id}', [TopicController::class, 'update']);
        Route::delete('/topics/{id}', [TopicController::class, 'destroy']);

        // Passages
        Route::get('/passages', [\App\Http\Controllers\Api\PassageController::class, 'index']);
        Route::post('/passages', [\App\Http\Controllers\Api\PassageController::class, 'store']);
        Route::put('/passages/{id}', [\App\Http\Controllers\Api\PassageController::class, 'update']);
        Route::delete('/passages/{id}', [\App\Http\Controllers\Api\PassageController::class, 'destroy']);

        // Audios
        Route::get('/audios', [\App\Http\Controllers\Api\AudioController::class, 'index']);
        Route::post('/audios', [\App\Http\Controllers\Api\AudioController::class, 'store']);
        Route::put('/audios/{id}', [\App\Http\Controllers\Api\AudioController::class, 'update']);
        Route::delete('/audios/{id}', [\App\Http\Controllers\Api\AudioController::class, 'destroy']);

        // Tests
        Route::get('/tests', [\App\Http\Controllers\Api\TestController::class, 'index']);
        Route::post('/tests', [\App\Http\Controllers\Api\TestController::class, 'store']);
        Route::put('/tests/{id}', [\App\Http\Controllers\Api\TestController::class, 'update']);
        Route::delete('/tests/{id}', [\App\Http\Controllers\Api\TestController::class, 'destroy']);

        // Test Parts
        Route::get('/test-parts', [\App\Http\Controllers\TestPartController::class, 'index']);
        Route::post('/test-parts', [\App\Http\Controllers\TestPartController::class, 'store']);
        Route::get('/test-parts/{id}', [\App\Http\Controllers\TestPartController::class, 'show']);
        Route::put('/test-parts/{id}', [\App\Http\Controllers\TestPartController::class, 'update']);
        Route::delete('/test-parts/{id}', [\App\Http\Controllers\TestPartController::class, 'destroy']);

        // Question Groups
        Route::get('/question-groups', [\App\Http\Controllers\QuestionGroupController::class, 'index']);
        Route::post('/question-groups', [\App\Http\Controllers\QuestionGroupController::class, 'store']);
        Route::get('/question-groups/{id}', [\App\Http\Controllers\QuestionGroupController::class, 'show']);
        Route::put('/question-groups/{id}', [\App\Http\Controllers\QuestionGroupController::class, 'update']);
        Route::delete('/question-groups/{id}', [\App\Http\Controllers\QuestionGroupController::class, 'destroy']);

        // Questions
        Route::get('/questions', [\App\Http\Controllers\Api\QuestionController::class, 'index']);
        Route::post('/questions', [\App\Http\Controllers\Api\QuestionController::class, 'store']);
        Route::get('/questions/{id}', [\App\Http\Controllers\Api\QuestionController::class, 'show']);
        Route::put('/questions/{id}', [\App\Http\Controllers\Api\QuestionController::class, 'update']);
        Route::delete('/questions/{id}', [\App\Http\Controllers\Api\QuestionController::class, 'destroy']);
    });
});
