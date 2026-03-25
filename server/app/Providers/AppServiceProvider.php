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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
