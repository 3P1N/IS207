# 1. Dùng PHP 8.2
FROM php:8.2-cli

# 2. Cài đặt các thư viện cần thiết cho Linux
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libonig-dev \
    libzip-dev

# 3. Cài đặt extension PHP
RUN docker-php-ext-install pdo pdo_pgsql bcmath zip

# 4. Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Thiết lập thư mục làm việc
WORKDIR /var/www

# 6. Copy code vào container
COPY . .

# 🔥 [FIX LỖI] Tạo các biến giả để quá trình Build không bị crash
# Render sẽ ghi đè các biến này bằng biến thật khi chạy (Runtime), nên không lo bảo mật.
ENV PUSHER_APP_KEY=temp_build_key
ENV PUSHER_APP_ID=temp_build_id
ENV PUSHER_APP_SECRET=temp_build_secret
ENV APP_KEY=base64:temp_key_for_build_process=================

# 7. Chạy lệnh cài đặt thư viện Laravel
# Thêm --no-scripts để an toàn hơn, tránh chạy code logic khi chưa có DB
RUN composer install --no-dev --optimize-autoloader --no-scripts

# 8. Mở port
EXPOSE 8000

# 9. Lệnh chạy server (Thêm lệnh package:discover chạy lúc khởi động)
CMD php artisan package:discover --ansi && php artisan serve --host=0.0.0.0 --port=10000