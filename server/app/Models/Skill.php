<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $table = 'skills';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $maxId = static::max($model->getKeyName());
                if (!$maxId) {
                    $model->{$model->getKeyName()} = 'SK01';
                } else {
                    $num = (int) substr($maxId, 2);
                    $model->{$model->getKeyName()} = 'SK' . str_pad($num + 1, 2, '0', STR_PAD_LEFT);
                }
            }
        });
    }

    protected $fillable = [
        'skill_name',
        'description',
        'time_limit',
    ];
}