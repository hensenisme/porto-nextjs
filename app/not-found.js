import React from 'react';
import Error from '@/components/page-404/Error'; // Menggunakan komponen Error yang sudah ada

// Metadata untuk halaman 404
export const metadata = {
  title: '404 - Halaman Tidak Ditemukan',
  robots: {
    noindex: true, // Memberitahu Google untuk tidak mengindeks halaman ini
  },
};

export default function NotFound() {
  return (
    <main className="main-bg o-hidden">
      <Error />
    </main>
  );
}