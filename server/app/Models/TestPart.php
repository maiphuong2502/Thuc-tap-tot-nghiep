<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestPart extends Model
{
    use HasFactory;

    protected $table = 'test_parts';
    protected $primaryKey = 'part_id';
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
                    $model->{$model->getKeyName()} = 'PT01';
                } else {
                    $num = (int) substr($maxId, 2);
                    $model->{$model->getKeyName()} = 'PT' . str_pad($num + 1, 2, '0', STR_PAD_LEFT);
                }
            }
        });
    }

    protected $fillable = [
        'test_id',
        'skill_id',
        'part_name',
        'order_index',
    ];

    public function test()
    {
        return $this->belongsTo(Test::class, 'test_id', 'test_id');
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class, 'skill_id', 'id');
    }
}
