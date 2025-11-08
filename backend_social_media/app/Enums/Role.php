<?php
// app/Enums/Role.php
namespace App\Enums;

class Role
{
    const ADMIN = 'admin';
    const USER = 'user';
    public static function values(): array
    {
        return [self::USER, self::ADMIN];
    }
}
