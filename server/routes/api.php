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
        // MCQ Questions
        Route::get('/mcq-questions', [\App\Http\Controllers\Api\McqQuestionController::class, 'index']);
        Route::post('/mcq-questions', [\App\Http\Controllers\Api\McqQuestionController::class, 'store']);
        Route::get('/mcq-questions/{id}', [\App\Http\Controllers\Api\McqQuestionController::class, 'show']);
        Route::put('/mcq-questions/{id}', [\App\Http\Controllers\Api\McqQuestionController::class, 'update']);
        Route::delete('/mcq-questions/{id}', [\App\Http\Controllers\Api\McqQuestionController::class, 'destroy']);

        // MCQ Options
        Route::get('/mcq-options', [\App\Http\Controllers\Api\McqOptionController::class, 'index']);
        Route::post('/mcq-options', [\App\Http\Controllers\Api\McqOptionController::class, 'store']);
        Route::get('/mcq-options/{id}', [\App\Http\Controllers\Api\McqOptionController::class, 'show']);
        Route::put('/mcq-options/{id}', [\App\Http\Controllers\Api\McqOptionController::class, 'update']);
        Route::delete('/mcq-options/{id}', [\App\Http\Controllers\Api\McqOptionController::class, 'destroy']);

        // Dropdown Questions
        Route::get('/dropdown-questions', [\App\Http\Controllers\Api\DropdownQuestionController::class, 'index']);
        Route::post('/dropdown-questions', [\App\Http\Controllers\Api\DropdownQuestionController::class, 'store']);
        Route::get('/dropdown-questions/{id}', [\App\Http\Controllers\Api\DropdownQuestionController::class, 'show']);
        Route::put('/dropdown-questions/{id}', [\App\Http\Controllers\Api\DropdownQuestionController::class, 'update']);
        Route::delete('/dropdown-questions/{id}', [\App\Http\Controllers\Api\DropdownQuestionController::class, 'destroy']);

        // Dropdown Options
        Route::get('/dropdown-options', [\App\Http\Controllers\Api\DropdownOptionController::class, 'index']);
        Route::post('/dropdown-options', [\App\Http\Controllers\Api\DropdownOptionController::class, 'store']);
        Route::get('/dropdown-options/{id}', [\App\Http\Controllers\Api\DropdownOptionController::class, 'show']);
        Route::put('/dropdown-options/{id}', [\App\Http\Controllers\Api\DropdownOptionController::class, 'update']);
        Route::delete('/dropdown-options/{id}', [\App\Http\Controllers\Api\DropdownOptionController::class, 'destroy']);

        // Matching Questions
        Route::get('/matching-questions', [\App\Http\Controllers\Api\MatchingQuestionController::class, 'index']);
        Route::post('/matching-questions', [\App\Http\Controllers\Api\MatchingQuestionController::class, 'store']);
        Route::get('/matching-questions/{id}', [\App\Http\Controllers\Api\MatchingQuestionController::class, 'show']);
        Route::put('/matching-questions/{id}', [\App\Http\Controllers\Api\MatchingQuestionController::class, 'update']);
        Route::delete('/matching-questions/{id}', [\App\Http\Controllers\Api\MatchingQuestionController::class, 'destroy']);

        // Matching Answers
        Route::get('/matching-answers', [\App\Http\Controllers\Api\MatchingAnswerController::class, 'index']);
        Route::post('/matching-answers', [\App\Http\Controllers\Api\MatchingAnswerController::class, 'store']);
        Route::get('/matching-answers/{id}', [\App\Http\Controllers\Api\MatchingAnswerController::class, 'show']);
        Route::put('/matching-answers/{id}', [\App\Http\Controllers\Api\MatchingAnswerController::class, 'update']);
        Route::delete('/matching-answers/{id}', [\App\Http\Controllers\Api\MatchingAnswerController::class, 'destroy']);

        // Fill Questions
        Route::get('/fill-questions', [\App\Http\Controllers\Api\FillQuestionController::class, 'index']);
        Route::post('/fill-questions', [\App\Http\Controllers\Api\FillQuestionController::class, 'store']);
        Route::get('/fill-questions/{id}', [\App\Http\Controllers\Api\FillQuestionController::class, 'show']);
        Route::put('/fill-questions/{id}', [\App\Http\Controllers\Api\FillQuestionController::class, 'update']);
        Route::delete('/fill-questions/{id}', [\App\Http\Controllers\Api\FillQuestionController::class, 'destroy']);

        // Fill Answers
        Route::get('/fill-answers', [\App\Http\Controllers\Api\FillAnswerController::class, 'index']);
        Route::post('/fill-answers', [\App\Http\Controllers\Api\FillAnswerController::class, 'store']);
        Route::get('/fill-answers/{id}', [\App\Http\Controllers\Api\FillAnswerController::class, 'show']);
        Route::put('/fill-answers/{id}', [\App\Http\Controllers\Api\FillAnswerController::class, 'update']);
        Route::delete('/fill-answers/{id}', [\App\Http\Controllers\Api\FillAnswerController::class, 'destroy']);

        // TFNG Questions
        Route::get('/tfng-questions', [\App\Http\Controllers\Api\TfngQuestionController::class, 'index']);
        Route::post('/tfng-questions', [\App\Http\Controllers\Api\TfngQuestionController::class, 'store']);
        Route::get('/tfng-questions/{id}', [\App\Http\Controllers\Api\TfngQuestionController::class, 'show']);
        Route::put('/tfng-questions/{id}', [\App\Http\Controllers\Api\TfngQuestionController::class, 'update']);
        Route::delete('/tfng-questions/{id}', [\App\Http\Controllers\Api\TfngQuestionController::class, 'destroy']);

        // TFNG Answers
        Route::get('/tfng-answers', [\App\Http\Controllers\Api\TfngAnswerController::class, 'index']);
        Route::post('/tfng-answers', [\App\Http\Controllers\Api\TfngAnswerController::class, 'store']);
        Route::get('/tfng-answers/{id}', [\App\Http\Controllers\Api\TfngAnswerController::class, 'show']);
        Route::put('/tfng-answers/{id}', [\App\Http\Controllers\Api\TfngAnswerController::class, 'update']);
        Route::delete('/tfng-answers/{id}', [\App\Http\Controllers\Api\TfngAnswerController::class, 'destroy']);
    });
});
