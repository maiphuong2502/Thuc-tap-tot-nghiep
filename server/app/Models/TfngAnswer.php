<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TfngAnswer extends Model
{
    use HasFactory;

    protected $table = 'tfng_answers';
    protected $primaryKey = 'answer_id';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'answer_id',
        'question_id',
        'correct_answer',
    ];

    public function tfngQuestion()
    {
        return $this->belongsTo(TfngQuestion::class, 'question_id', 'question_id');
    }
}
