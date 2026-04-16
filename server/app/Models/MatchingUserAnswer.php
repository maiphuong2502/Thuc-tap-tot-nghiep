<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchingUserAnswer extends Model
{
    use HasFactory;

    protected $table = 'matching_user_answers';
    protected $primaryKey = 'muw_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'muw_id',
        'result_id',
        'question_id',
        'left_item',
        'right_item',
        'is_correct',
    ];
}
