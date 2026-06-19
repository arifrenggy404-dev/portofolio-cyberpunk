#!/bin/sh
set -e

# Konfigurasi port untuk Railway
PORT=${PORT:-80}
echo "Mengonfigurasi Nginx untuk mendengarkan port $PORT..."
sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/sites-available/default
sed -i "s/listen \[::\]:80;/listen \[::\]:${PORT};/g" /etc/nginx/sites-available/default

# Atur kepemilikan dan izin akses volume database agar bisa diakses oleh www-data
echo "Mengatur izin akses direktori database..."
chown -R www-data:www-data /var/www/html/database_persistent
chmod -R 775 /var/www/html/database_persistent

# Setup persistent storage uploads
echo "Mengonfigurasi persistent storage uploads..."
mkdir -p /var/www/html/database_persistent/storage
chown -R www-data:www-data /var/www/html/database_persistent/storage
chmod -R 775 /var/www/html/database_persistent/storage

# Link Laravel's public storage folder to the persistent volume
if [ ! -L /var/www/html/storage/app/public ]; then
    echo "Membuat symlink dari storage/app/public ke database_persistent/storage..."
    rm -rf /var/www/html/storage/app/public
    ln -s /var/www/html/database_persistent/storage /var/www/html/storage/app/public
    chown -h www-data:www-data /var/www/html/storage/app/public
fi

# Buat symbolic link Laravel untuk akses public
echo "Membuat symbolic link storage:link..."
php artisan storage:link --force

# Inisialisasi database SQLite jika belum ada
INITIAL_INSTALL=false
if [ ! -f /var/www/html/database_persistent/database.sqlite ]; then
    echo "Membuat database SQLite baru..."
    touch /var/www/html/database_persistent/database.sqlite
    chown www-data:www-data /var/www/html/database_persistent/database.sqlite
    chmod 664 /var/www/html/database_persistent/database.sqlite
    INITIAL_INSTALL=true
fi

# Jalankan migrasi database
echo "Menjalankan migrasi database..."
php artisan migrate --force

# Seed database (aman & non-destruktif karena pengecekan count === 0)
echo "Menjalankan database seeder..."
php artisan db:seed --force

# Optimasi Laravel untuk produksi
echo "Mengoptimalkan konfigurasi Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Jalankan supervisord
echo "Menjalankan PHP-FPM dan Nginx..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
