<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TfngUserAnswer extends Model
{
    use HasFactory;

    protected $table = 'tfng_user_answers';
    protected $primaryKey = 'tuw_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'tuw_id',
        'result_id',
        'question_id',
        'user_answer',
        'is_correct',
    ];
}
