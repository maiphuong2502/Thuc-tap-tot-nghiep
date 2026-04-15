<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FillUserAnswer extends Model
{
    use HasFactory;

    protected $table = 'fill_user_answers';
    protected $primaryKey = 'faw_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'faw_id',
        'result_id',
        'question_id',
        'user_answer',
        'is_correct',
    ];
}
