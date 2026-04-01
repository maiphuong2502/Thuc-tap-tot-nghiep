<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DropdownOption extends Model
{
    use HasFactory;

    protected $table = 'dropdown_options';
    protected $primaryKey = 'option_id';
    public $incrementing = false;
    protected $keyType = 'string';

    // Disable timestamps since they are not in the schema provided by the user
    public $timestamps = false;

    protected $fillable = [
        'option_id',
        'question_id',
        'content',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function dropdownQuestion()
    {
        return $this->belongsTo(DropdownQuestion::class, 'question_id', 'question_id');
    }
}
