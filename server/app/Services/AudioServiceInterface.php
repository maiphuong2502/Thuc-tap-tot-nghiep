<?php

namespace App\Services;

interface AudioServiceInterface extends BaseServiceInterface
{
    public function getAudiosList($search = null);
}
