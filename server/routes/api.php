<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\TopicController;
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/debug-test', function() {
    return \App\Models\Test::with('parts.questionGroups')->first();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // API dành cho Học viên

    Route::get('/user/exams', [\App\Http\Controllers\Api\UserExamController::class, 'index']);
    Route::get('/user/exams/{id}/full-structure', [\App\Http\Controllers\Api\UserExamController::class, 'getFullStructure']);

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

        // Writing Submissions
        Route::get('/writing-submissions', [\App\Http\Controllers\Api\WritingSubmissionController::class, 'index']);
        Route::post('/writing-submissions', [\App\Http\Controllers\Api\WritingSubmissionController::class, 'store']);
        Route::get('/writing-submissions/{id}', [\App\Http\Controllers\Api\WritingSubmissionController::class, 'show']);
        Route::put('/writing-submissions/{id}', [\App\Http\Controllers\Api\WritingSubmissionController::class, 'update']);
        Route::delete('/writing-submissions/{id}', [\App\Http\Controllers\Api\WritingSubmissionController::class, 'destroy']);

        // Speaking Submissions
        Route::get('/speaking-submissions', [\App\Http\Controllers\Api\SpeakingSubmissionController::class, 'index']);
        Route::post('/speaking-submissions', [\App\Http\Controllers\Api\SpeakingSubmissionController::class, 'store']);
        Route::get('/speaking-submissions/{id}', [\App\Http\Controllers\Api\SpeakingSubmissionController::class, 'show']);
        Route::put('/speaking-submissions/{id}', [\App\Http\Controllers\Api\SpeakingSubmissionController::class, 'update']);
        Route::delete('/speaking-submissions/{id}', [\App\Http\Controllers\Api\SpeakingSubmissionController::class, 'destroy']);

        // Results Admin
        Route::get('/results', [\App\Http\Controllers\Api\ResultController::class, 'index']);

        // McqAnswers Admin
        Route::get('/mcq-answers', [\App\Http\Controllers\Api\McqAnswerController::class, 'index']);
        Route::post('/mcq-answers', [\App\Http\Controllers\Api\McqAnswerController::class, 'store']);
        Route::get('/mcq-answers/{id}', [\App\Http\Controllers\Api\McqAnswerController::class, 'show']);
        Route::put('/mcq-answers/{id}', [\App\Http\Controllers\Api\McqAnswerController::class, 'update']);
        Route::delete('/mcq-answers/{id}', [\App\Http\Controllers\Api\McqAnswerController::class, 'destroy']);

        // Fill User Answers Admin
        Route::get('/fill-user-answers', [\App\Http\Controllers\Api\FillUserAnswerController::class, 'index']);
        Route::post('/fill-user-answers', [\App\Http\Controllers\Api\FillUserAnswerController::class, 'store']);
        Route::get('/fill-user-answers/{id}', [\App\Http\Controllers\Api\FillUserAnswerController::class, 'show']);
        Route::put('/fill-user-answers/{id}', [\App\Http\Controllers\Api\FillUserAnswerController::class, 'update']);
        Route::delete('/fill-user-answers/{id}', [\App\Http\Controllers\Api\FillUserAnswerController::class, 'destroy']);

        // Dropdown Answers Admin
        Route::get('/dropdown-answers', [\App\Http\Controllers\Api\DropdownAnswerController::class, 'index']);
        Route::post('/dropdown-answers', [\App\Http\Controllers\Api\DropdownAnswerController::class, 'store']);
        Route::get('/dropdown-answers/{id}', [\App\Http\Controllers\Api\DropdownAnswerController::class, 'show']);
        Route::put('/dropdown-answers/{id}', [\App\Http\Controllers\Api\DropdownAnswerController::class, 'update']);
        Route::delete('/dropdown-answers/{id}', [\App\Http\Controllers\Api\DropdownAnswerController::class, 'destroy']);

        // Matching User Answers Admin
        Route::get('/matching-user-answers', [\App\Http\Controllers\Api\MatchingUserAnswerController::class, 'index']);
        Route::post('/matching-user-answers', [\App\Http\Controllers\Api\MatchingUserAnswerController::class, 'store']);
        Route::get('/matching-user-answers/{id}', [\App\Http\Controllers\Api\MatchingUserAnswerController::class, 'show']);
        Route::put('/matching-user-answers/{id}', [\App\Http\Controllers\Api\MatchingUserAnswerController::class, 'update']);
        Route::delete('/matching-user-answers/{id}', [\App\Http\Controllers\Api\MatchingUserAnswerController::class, 'destroy']);

        // TFNG User Answers Admin
        Route::get('/tfng-user-answers', [\App\Http\Controllers\Api\TfngUserAnswerController::class, 'index']);
        Route::post('/tfng-user-answers', [\App\Http\Controllers\Api\TfngUserAnswerController::class, 'store']);
        Route::get('/tfng-user-answers/{id}', [\App\Http\Controllers\Api\TfngUserAnswerController::class, 'show']);
        Route::put('/tfng-user-answers/{id}', [\App\Http\Controllers\Api\TfngUserAnswerController::class, 'update']);
        Route::delete('/tfng-user-answers/{id}', [\App\Http\Controllers\Api\TfngUserAnswerController::class, 'destroy']);
    });

    // Test Results (Học viên & Admin)
    Route::post('/submit-test', [\App\Http\Controllers\Api\ResultController::class, 'submitTest']);
    Route::get('/results/{id}', [\App\Http\Controllers\Api\ResultController::class, 'show']);
    Route::get('/results/{id}/review', [\App\Http\Controllers\Api\ResultController::class, 'review']);
    Route::get('/my-results', [\App\Http\Controllers\Api\ResultController::class, 'userResults']);
});
