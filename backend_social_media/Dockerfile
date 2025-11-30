# 1. Dùng PHP 8.2 (hoặc sửa thành 8.1 nếu code bạn cũ)
FROM php:8.2-cli

# 2. Cài đặt các thư viện cần thiết cho Linux
# Quan trọng: libpq-dev dùng để kết nối Supabase (PostgreSQL)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libonig-dev \
    libzip-dev

# 3. Cài đặt extension PHP để nối Database và các thứ khác
RUN docker-php-ext-install pdo pdo_pgsql bcmath zip

# 4. Cài đặt Composer (Công cụ quản lý thư viện Laravel)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Thiết lập thư mục làm việc
WORKDIR /var/www

# 6. Copy toàn bộ code từ máy bạn vào container
COPY . .

# 7. Chạy lệnh cài đặt thư viện Laravel
RUN composer install --no-dev --optimize-autoloader

# 8. Mở port 8000 (Mặc định của Laravel serve)
EXPOSE 8000

# 9. Lệnh chạy server khi khởi động (Render sẽ gọi lệnh này)
# Dùng sh -c để nhận diện biến môi trường $PORT của Render nếu cần, 
# nhưng ở đây ta ép cứng port 10000 cho khớp cấu hình Render
CMD php artisan serve --host=0.0.0.0 --port=10000