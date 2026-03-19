<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamType extends Model
{
    use HasFactory;

    protected $table = 'exam_type';
    protected $primaryKey = 'category_id';
    public $timestamps = false;

    protected $fillable = [
        'category_name',
        'description',
    ];
}
