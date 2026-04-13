<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WritingSubmission extends Model
{
    use HasFactory;

    protected $table = 'writing_submissions';
    protected $primaryKey = 'writing_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'writing_id',
        'user_id',
        'question_id',
        'content',
        'score',
    ];

    protected $casts = [
        'score' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->writing_id)) {
                $latest = static::orderBy('writing_id', 'desc')->first();
                if (!$latest) {
                    $model->writing_id = 'WR01';
                } else {
                    $number = intval(substr($latest->writing_id, 2));
                    $model->writing_id = 'WR' . str_pad($number + 1, 2, '0', STR_PAD_LEFT);
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
}
