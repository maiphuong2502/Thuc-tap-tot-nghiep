<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\SkillRepositoryInterface::class,
            \App\Repositories\SkillRepository::class
        );

        $this->app->bind(
            \App\Services\SkillServiceInterface::class,
            \App\Services\SkillService::class
        );

        $this->app->bind(
            \App\Repositories\UserRepositoryInterface::class,
            \App\Repositories\UserRepository::class
        );

        $this->app->bind(
            \App\Services\UserServiceInterface::class,
            \App\Services\UserService::class
        );

        $this->app->bind(
            \App\Repositories\TopicRepositoryInterface::class,
            \App\Repositories\TopicRepository::class
        );

        $this->app->bind(
            \App\Services\TopicServiceInterface::class,
            \App\Services\TopicService::class
        );

        $this->app->bind(
            \App\Repositories\PassageRepositoryInterface::class,
            \App\Repositories\PassageRepository::class
        );

        $this->app->bind(
            \App\Services\PassageServiceInterface::class,
            \App\Services\PassageService::class
        );

        $this->app->bind(
            \App\Repositories\AudioRepositoryInterface::class,
            \App\Repositories\AudioRepository::class
        );

        $this->app->bind(
            \App\Services\AudioServiceInterface::class,
            \App\Services\AudioService::class
        );

        $this->app->bind(
            \App\Repositories\TestRepositoryInterface::class,
            \App\Repositories\TestRepository::class
        );

        $this->app->bind(
            \App\Services\TestServiceInterface::class,
            \App\Services\TestService::class
        );

        $this->app->bind(
            \App\Repositories\TestPartRepositoryInterface::class,
            \App\Repositories\TestPartRepository::class
        );

        $this->app->bind(
            \App\Services\TestPartServiceInterface::class,
            \App\Services\TestPartService::class
        );

        $this->app->bind(
            \App\Repositories\QuestionGroupRepositoryInterface::class,
            \App\Repositories\QuestionGroupRepository::class
        );

        $this->app->bind(
            \App\Services\QuestionGroupServiceInterface::class,
            \App\Services\QuestionGroupService::class
        );

        $this->app->bind(
            \App\Repositories\QuestionRepositoryInterface::class,
            \App\Repositories\QuestionRepository::class
        );

        $this->app->bind(
            \App\Services\QuestionServiceInterface::class,
            \App\Services\QuestionService::class
        );

        $this->app->bind(
            \App\Repositories\McqQuestionRepositoryInterface::class,
            \App\Repositories\McqQuestionRepository::class
        );

        $this->app->bind(
            \App\Services\McqQuestionServiceInterface::class,
            \App\Services\McqQuestionService::class
        );
        $this->app->bind(
            \App\Repositories\McqOptionRepositoryInterface::class,
            \App\Repositories\McqOptionRepository::class
        );

        $this->app->bind(
            \App\Services\McqOptionServiceInterface::class,
            \App\Services\McqOptionService::class
        );

        $this->app->bind(
            \App\Repositories\FillQuestionRepositoryInterface::class,
            \App\Repositories\FillQuestionRepository::class
        );

        $this->app->bind(
            \App\Services\FillQuestionServiceInterface::class,
            \App\Services\FillQuestionService::class
        );

        $this->app->bind(
            \App\Repositories\FillAnswerRepositoryInterface::class,
            \App\Repositories\FillAnswerRepository::class
        );

        $this->app->bind(
            \App\Services\FillAnswerServiceInterface::class,
            \App\Services\FillAnswerService::class
        );

        $this->app->bind(
            \App\Repositories\DropdownQuestionRepositoryInterface::class,
            \App\Repositories\DropdownQuestionRepository::class
        );

        $this->app->bind(
            \App\Services\DropdownQuestionServiceInterface::class,
            \App\Services\DropdownQuestionService::class
        );

        $this->app->bind(
            \App\Repositories\DropdownOptionRepositoryInterface::class,
            \App\Repositories\DropdownOptionRepository::class
        );

        $this->app->bind(
            \App\Services\DropdownOptionServiceInterface::class,
            \App\Services\DropdownOptionService::class
        );

        $this->app->bind(
            \App\Repositories\MatchingQuestionRepositoryInterface::class,
            \App\Repositories\MatchingQuestionRepository::class
        );

        $this->app->bind(
            \App\Services\MatchingQuestionServiceInterface::class,
            \App\Services\MatchingQuestionService::class
        );

        $this->app->bind(
            \App\Repositories\MatchingAnswerRepositoryInterface::class,
            \App\Repositories\MatchingAnswerRepository::class
        );

        $this->app->bind(
            \App\Services\MatchingAnswerServiceInterface::class,
            \App\Services\MatchingAnswerService::class
        );

        $this->app->bind(
            \App\Repositories\TfngQuestionRepositoryInterface::class,
            \App\Repositories\TfngQuestionRepository::class
        );

        $this->app->bind(
            \App\Services\TfngQuestionServiceInterface::class,
            \App\Services\TfngQuestionService::class
        );

        $this->app->bind(
            \App\Repositories\TfngAnswerRepositoryInterface::class,
            \App\Repositories\TfngAnswerRepository::class
        );

        $this->app->bind(
            \App\Services\TfngAnswerServiceInterface::class,
            \App\Services\TfngAnswerService::class
        );
    }

    /**

     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
