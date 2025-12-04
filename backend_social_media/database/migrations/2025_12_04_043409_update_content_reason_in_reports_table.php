<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            // Thêm enum cho type: 'private' = 2 người, 'group' = nhóm
            $table->enum('type', ['private', 'group'])->default('private')->after('name');
            // avatar_url lưu đường dẫn ảnh đại diện, cho phép null
            $table->string('avatar_url')->nullable()->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropColumn(['type', 'avatar_url']);
        });
    }
};
