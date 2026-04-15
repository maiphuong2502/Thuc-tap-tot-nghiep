<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    protected $table = 'results';
    protected $primaryKey = 'result_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'result_id', 'user_id', 'test_id', 'start_time', 'end_time', 
        'total_questions', 'correct_count', 'wrong_count', 'skipped_count', 'band_score',
        'listening_band', 'reading_band', 'writing_band', 'speaking_band'
    ];

    protected $casts = [
        'band_score' => 'float',
        'listening_band' => 'float',
        'reading_band' => 'float',
        'writing_band' => 'float',
        'speaking_band' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function test()
    {
        return $this->belongsTo(Test::class, 'test_id', 'test_id');
    }

    public function mcqAnswers()
    {
        return $this->hasMany(McqAnswer::class, 'result_id', 'result_id');
    }

    public function fillUserAnswers()
    {
        return $this->hasMany(FillUserAnswer::class, 'result_id', 'result_id');
    }

    public function dropdownAnswers()
    {
        return $this->hasMany(DropdownAnswer::class, 'result_id', 'result_id');
    }

    public function matchingUserAnswers()
    {
        return $this->hasMany(MatchingUserAnswer::class, 'result_id', 'result_id');
    }

    public function tfngUserAnswers()
    {
        return $this->hasMany(TfngUserAnswer::class, 'result_id', 'result_id');
    }
}
