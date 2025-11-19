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
        Schema::create('privacy_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->unique();
            $table->enum('show_profile', ['public', 'friends', 'private'])->default('public');
            $table->enum('show_posts', ['public', 'friends', 'private'])->default('public');
            $table->enum('show_friends', ['public', 'friends', 'private'])->default('public');
            $table->enum('show_email', ['public', 'friends', 'private'])->default('public');
            $table->enum('show_phone', ['public', 'friends', 'private'])->default('private');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('privacy_settings');
    }
};
