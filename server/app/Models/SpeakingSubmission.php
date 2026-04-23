<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpeakingSubmission extends Model
{
    use HasFactory;

    protected $table = 'speaking_submissions';
    protected $primaryKey = 'speaking_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'speaking_id',
        'user_id',
        'result_id',
        'question_id',
        'group_id',
        'audio_url',
        'score',
    ];

    protected $casts = [
        'score' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->speaking_id)) {
                $latest = static::orderBy('speaking_id', 'desc')->first();
                if (!$latest) {
                    $model->speaking_id = 'SP01';
                } else {
                    $number = intval(substr($latest->speaking_id, 2));
                    $model->speaking_id = 'SP' . str_pad($number + 1, 2, '0', STR_PAD_LEFT);
                }
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id', 'question_id');
    }

    public function result()
    {
        return $this->belongsTo(Result::class, 'result_id', 'result_id');
    }

    public function group()
    {
        return $this->belongsTo(QuestionGroup::class, 'group_id', 'group_id');
    }
}
