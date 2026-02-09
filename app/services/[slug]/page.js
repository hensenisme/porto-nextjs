import React from 'react';
import { notFound } from 'next/navigation';
import servicesData from '@/data/services.json';
import ServiceDetailContent from './ServiceDetailContent'; // Kita akan buat file ini

// 1. (generateStaticParams) Membuat semua halaman layanan secara statis saat build
export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

// 2. (generateMetadata) Mengatur metadata halaman secara dinamis
export async function generateMetadata({ params }) {
  const service = servicesData.find((s) => s.slug === params.slug);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.title} | Service Details`,
    description: service.desc,
  };
}

// 3. (Page Component) Mengambil data dan meneruskannya ke Client Component
export default async function ServiceDetailPage({ params }) {
  const { slug } = params;
  const service = servicesData.find((s) => s.slug === slug);

  // Jika slug tidak ada di JSON, tampilkan 404
  if (!service) {
    notFound();
  }

  // Meneruskan data 'service' yang ditemukan sebagai prop ke Client Component
  return <ServiceDetailContent service={service} />;
}