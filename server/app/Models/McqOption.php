<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class McqOption extends Model
{
    use HasFactory;

    protected $table = 'mcq_options';
    protected $primaryKey = 'option_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'option_id',
        'question_id',
        'content',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];
}
