<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FillAnswer extends Model
{
    use HasFactory;

    protected $table = 'fill_answers';
    protected $primaryKey = 'answer_id';
    public $incrementing = false;
    protected $keyType = 'string';

    // Disable timestamps since they are not in the schema provided by the user
    public $timestamps = false;

    protected $fillable = [
        'answer_id',
        'question_id',
        'correct_answer',
    ];

    public function fillQuestion()
    {
        return $this->belongsTo(FillQuestion::class, 'question_id', 'question_id');
    }
}
