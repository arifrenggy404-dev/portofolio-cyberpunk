# Spesifikasi Rancangan Setup Proyek

Dokumen ini menjelaskan spesifikasi dan langkah-langkah untuk melakukan setup awal proyek Portofolio Cyberpunk secara lokal menggunakan MySQL sebagai database.

## Deskripsi Proyek
Proyek ini adalah aplikasi portofolio bertema cyberpunk yang dibangun menggunakan Laravel 13 di sisi backend, React 19 dengan Inertia.js di sisi frontend, serta Tailwind CSS 4 untuk styling.

## Spesifikasi Lingkungan
- **Sistem Operasi:** Linux
- **Runtime Backend:** PHP ^8.3 (Laravel ^13.8)
- **Runtime Frontend:** Node.js (React ^19.2, Vite ^8.0)
- **Database:** MySQL
  - Host: 127.0.0.1
  - Port: 3306
  - Database: `laravel`
  - Username: `root`
  - Password: (kosong)

## Langkah Setup & Verifikasi
1. **Instalasi Dependensi:**
   - Menjalankan `composer install` untuk dependensi PHP.
   - Menjalankan `npm install` untuk dependensi Node.js.
2. **Konfigurasi Lingkungan (`.env`):**
   - Menyalin `.env.example` ke `.env`.
   - Mengonfigurasi `DB_CONNECTION=mysql` dan menghapus/menyesuaikan parameter MySQL default.
   - Menjalankan `php artisan key:generate` untuk menghasilkan kunci aplikasi.
3. **Migrasi Database:**
   - Menjalankan `php artisan migrate --seed` untuk membuat tabel dan mengisi data awal.
   - Membuat database secara otomatis jika belum terdeteksi di server MySQL lokal.
4. **Kompilasi Aset:**
   - Menjalankan `npm run build` untuk memverifikasi bahwa build frontend berhasil tanpa error.
