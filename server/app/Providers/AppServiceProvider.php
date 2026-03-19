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

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
