# PANDUAN STRUKTUR PROYEK: WEBFOLIO-NEXTJS

Kepada AI Agent, sebelum melanjutkan ke tahap eksekusi, tolong pahami struktur dan peran setiap direktori/file berikut untuk memastikan sinkronisasi pemahaman kita:

## 1. Root Directory (Konfigurasi)

* **`package.json`** : Jantung proyek. Berisi daftar dependencies (Next.js, GSAP, Framer Motion) dan script (dev, build, start).
* **`.env.local`** : Menyimpan variabel lingkungan sensitif, terutama `WORDPRESS_GRAPHQL_ENDPOINT` untuk koneksi Headless CMS.
* **`next.config.js`** : Konfigurasi framework Next.js, termasuk pengaturan domain gambar untuk `next/image`.

## 2. Direktori `app/` (Next.js App Router)

Direktori ini mengontrol routing dan layout utama aplikasi.

* **`layout.js`** : Layout utama yang membungkus seluruh aplikasi. Di sini banyak *script legacy* (jQuery, plugins) dimuat secara global melalui `next/script`.
* **`page.js`** : Halaman beranda (Home).
* **`page-services-details/page.js`** : Halaman detail layanan yang saat ini sedang mengalami masalah  *Hydration* .
* **`portfolio/` atau `blog/`** : Folder routing untuk fitur dinamis yang mengambil data dari WordPress.

## 3. Direktori `components/` (UI & Logika Tampilan)

Komponen dipecah berdasarkan kategori untuk modularitas:

* **`common/`** : Komponen yang muncul di hampir semua halaman (Navbar, Footer, Cursor, Loader, ProgressScroll, Lines).
* **`home-personal/`** : Komponen khusus untuk layout personal, termasuk `Portfolio.jsx` yang menjadi fokus pengembangan kita.
* **`page-services-details/`** : Komponen pendukung untuk halaman detail layanan (Header, Intro, Feat).
* **`home-digital-agency/`** : Komponen dari layout lain yang sering digunakan kembali (misal: `Intro2`).

## 4. Direktori `public/` (Asset Statis & Legacy JS)

Ini adalah area kritis karena mengandung skrip yang memanipulasi DOM secara langsung:

* **`assets/js/`** : Berisi file `.js` mentah (GSAP, Isotope, ScrollTrigger, plugins.js, scripts.js). File-file ini dimuat di `layout.js` dan sering berkonflik dengan React.
* **`assets/css/`** : Berisi file CSS global dan plugin.
* **`assets/imgs/`** : Tempat penyimpanan gambar statis lokal.

## 5. Direktori `data/` (Manajemen Konten Statis)

Berisi file JSON yang bertindak sebagai "database lokal":

* **`portfolios/works1.json`** : Sumber data untuk komponen portofolio. Berisi array objek proyek (img, title, subtitle, dll).
* **`services.json`** ,  **`team.json`** , dll: Data statis lainnya.

## 6. Direktori `lib/` (Integrasi Backend)

* **`wordpress.js`** : Berisi logika `fetch` menggunakan GraphQL untuk mengambil data dari WordPress Headless.

### Catatan Tambahan untuk Developer

* **Interaksi Client-Side** : Hampir semua komponen UI menggunakan `'use client'` karena ketergantungan pada GSAP dan manipulasi DOM untuk efek kursor/scroll.
* **Pola Komponen** : Proyek ini menggunakan pola "Wrapper-Content". Banyak elemen UI yang bergantung pada ID spesifik seperti `#smooth-wrapper` dan `#smooth-content` untuk keperluan  *smooth scrolling* .
