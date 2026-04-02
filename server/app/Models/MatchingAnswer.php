<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchingAnswer extends Model
{
    use HasFactory;

    protected $table = 'matching_answers';
    protected $primaryKey = 'answer_id';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'answer_id',
        'question_id',
        'left_item',
        'right_item',
    ];

    public function matchingQuestion()
    {
        return $this->belongsTo(MatchingQuestion::class, 'question_id', 'question_id');
    }
}
