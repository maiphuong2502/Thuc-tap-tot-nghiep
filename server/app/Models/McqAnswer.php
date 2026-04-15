<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class McqAnswer extends Model
{
    use HasFactory;

    protected $table = 'mcq_answers';
    protected $primaryKey = 'amc_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'amc_id',
        'result_id',
        'question_id',
        'selected_option_id',
        'is_correct',
    ];
}
