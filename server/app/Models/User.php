<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // nếu dùng Sanctum

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'user_id';
    public $timestamps = false; // vì chỉ có created_at (timestamp)
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $maxId = static::max($model->getKeyName());
                if (!$maxId) {
                    $model->{$model->getKeyName()} = 'UR01';
                } else {
                    $num = (int) substr($maxId, 2);
                    $model->{$model->getKeyName()} = 'UR' . str_pad($num + 1, 2, '0', STR_PAD_LEFT);
                }
            }
        });
    }

    protected $fillable = [
        'username', 'email', 'password', 'role', 'status'
    ];

    protected $hidden = [
        'password', // ẩn password khi trả về JSON
    ];

    protected $casts = [
        'role' => 'integer',
        'status' => 'integer',
        'created_at' => 'datetime',
    ];
}