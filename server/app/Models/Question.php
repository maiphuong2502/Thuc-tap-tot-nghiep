<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $table = 'questions';
    protected $primaryKey = 'question_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'question_id',
        'group_id',
        'skill_id',
        'question_type',
        'order_index',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->question_id)) {
                $latest = static::orderBy('question_id', 'desc')->first();
                if (!$latest) {
                    $model->question_id = 'QS01';
                } else {
                    $number = intval(substr($latest->question_id, 2));
                    $model->question_id = 'QS' . str_pad($number + 1, 2, '0', STR_PAD_LEFT);
                }
            }
        });
    }

    public function group()
    {
        return $this->belongsTo(QuestionGroup::class, 'group_id', 'group_id');
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class, 'skill_id', 'id');
    }
}
