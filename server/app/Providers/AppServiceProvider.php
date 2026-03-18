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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
