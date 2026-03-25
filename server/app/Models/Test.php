<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;

    protected $table = 'tests';
    protected $primaryKey = 'test_id';
    public $timestamps = false; // Only using created_at via database default or custom logic
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $maxId = static::max($model->getKeyName());
                if (!$maxId) {
                    $model->{$model->getKeyName()} = 'TE01';
                } else {
                    $num = (int) substr($maxId, 2);
                    $model->{$model->getKeyName()} = 'TE' . str_pad($num + 1, 2, '0', STR_PAD_LEFT);
                }
            }
        });
    }

    protected $fillable = [
        'test_name',
        'description',
    ];
}
