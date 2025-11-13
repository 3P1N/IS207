<?php

namespace App\Enums;

class Gender
{
    const MALE = 'male';
    const  FEMALE = 'female';
    const OTHER = 'other';
    public static function values(): array
    {
        return [self::MALE, self::FEMALE, self::OTHER]; 
    }
}