<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DropdownAnswer extends Model
{
    use HasFactory;

    protected $table = 'dropdown_answers';
    protected $primaryKey = 'daw_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'daw_id',
        'result_id',
        'question_id',
        'selected_option_id',
        'is_correct',
    ];
}
