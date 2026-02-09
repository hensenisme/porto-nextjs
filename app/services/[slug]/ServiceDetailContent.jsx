'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Marq2 from '@/components/common/Marq2';
import loadBackgroudImages from '@/common/loadBackgroudImages';

// Komponen ini sekarang adalah Client Component dan menerima 'service' sebagai prop
export default function ServiceDetailContent({ service }) {
  // useEffect sekarang aman digunakan di sini
  useEffect(() => {
    // Efek ini akan memuat gambar latar belakang untuk header
    loadBackgroudImages();
  }, []);

  // Jika service null (meskipun seharusnya sudah ditangani oleh server),
  // kita bisa kembalikan null atau loading state.
  if (!service) {
    return null;
  }

  // JSX untuk tampilan detail layanan
  return (
    <>
      {/* Header Halaman */}
      <div
        className="header page-header bg-img section-padding valign"
        data-overlay-dark="8"
        // Latar belakang header diatur di sini
        style={{ backgroundImage: "url('/assets/imgs/background/bg4.jpg')" }}
      >
        <div className="container pt-80">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="text-u ls1 fz-80">
                  {service.title.includes(' ') ? (
                    <>
                      {service.title.substring(
                        0,
                        service.title.lastIndexOf(' ')
                      )}
                      <span className="fw-200">
                        {service.title.substring(
                          service.title.lastIndexOf(' ')
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="fw-200">{service.title}</span>
                  )}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Konten Detail Layanan */}
      <section className="intro section-padding">
        <div className="container">
          <div className="row lg-marg">
            {/* Bagian Deskripsi */}
            <div className="col-lg-8">
              <div className="row lg-marg">
                <div className="col-md-12">
                  <div>
                    <h6 className="sub-title main-color mb-15">Description</h6>
                    <h3 className="mb-30">{service.title}</h3>
                    <div className="text">
                      {/* Menggunakan 'details' jika ada, fallback ke 'desc' */}
                      <p className="fz-18">{service.details || service.desc}</p>
                      
                      {/* PERBAIKAN: Ini adalah blok yang diperbaiki untuk menampilkan tag */}
                      {service.tags && service.tags.length > 0 && (
                        <div className="mt-30">
                          <h6 className="mb-15">
                            Related Skills / Technologies:
                          </h6>
                          {/* Loop .map sekarang berisi konten (<span>) di dalamnya */}
                          {service.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="tag mr-10 mb-10 inline-block bg-gray-800 p-2"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Akhir blok perbaikan */}

                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Bagian Gambar */}
            <div className="col-lg-4">
              <div className="img-full fit-img">
                <Image
                  src={
                    service.img
                      ? service.img
                      : '/assets/imgs/intro/2.jpg'
                  } // Gunakan gambar service
                  alt={service.title}
                  width={400}
                  height={600}
                  style={{ objectFit: 'cover', borderRadius: '10px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Marquee */}
      <Marq2 />
    </>
  );
}
