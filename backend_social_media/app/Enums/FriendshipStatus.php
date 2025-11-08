<?php

namespace App\Enums;

class FriendshipStatus
{
    const PENDING = 'pending';
    const ACCEPTED = 'accepted';
    const REJECTED = 'rejected';

    /**
     * Hiển thị nhãn thân thiện (tuỳ chọn)
     */

    public static function values(): array
    {
        return [self::PENDING, self::ACCEPTED, self::REJECTED];
    }

    public static function labels(): array
    {
        return [
            self::PENDING => 'Pending',
            self::ACCEPTED => 'Accepted',
            self::REJECTED => 'Rejected',
        ];
    }
}
