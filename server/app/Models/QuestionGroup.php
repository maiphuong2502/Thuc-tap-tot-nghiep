<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionGroup extends Model
{
    use HasFactory;

    protected $table = 'question_groups';
    protected $primaryKey = 'group_id';
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
                    $model->{$model->getKeyName()} = 'QR01';
                } else {
                    $num = (int) substr($maxId, 2);
                    $model->{$model->getKeyName()} = 'QR' . str_pad($num + 1, 2, '0', STR_PAD_LEFT);
                }
            }
        });
    }

    protected $fillable = [
        'skill_id',
        'title',
        'passage_id',
        'audio_id',
        'type',
    ];

    public function skill()
    {
        return $this->belongsTo(Skill::class, 'skill_id', 'id');
    }

    public function passage()
    {
        return $this->belongsTo(Passage::class, 'passage_id', 'passage_id');
    }

    public function audio()
    {
        return $this->belongsTo(Audio::class, 'audio_id', 'audio_id');
    }
}
