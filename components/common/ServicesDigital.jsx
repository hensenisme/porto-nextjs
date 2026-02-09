'use client';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import servicesData from '@/data/services.json'; // Import data yang sudah diupdate
gsap.registerPlugin(ScrollTrigger);

function Services() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const titleRef = useRef(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    gsap.registerPlugin(ScrollTrigger);

    // Refresh ScrollTrigger
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Store handlers for cleanup
    const cleanupHandlers = [];

    const ctx = gsap.context(() => {
      const section = sectionRef.current;

      // Animasi Judul
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      });

      // Animasi untuk setiap kartu layanan
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.fromTo(
          item,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
        const icon = item.querySelector('.icon-img-60');
        const title = item.querySelector('h5');
        const textContainer = item.querySelector('.text');
        const arrow = item.querySelector('a.arrow-icon');
        gsap.set(item, { transformPerspective: 1000 });

        // --- Fungsi-fungsi Aksi Universal ---
        const handleInteractionStart = () => {
          gsap.to(textContainer, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' });
          gsap.to(arrow, { opacity: 1, duration: 0.5, ease: 'power2.out' });
          gsap.to(icon, { scale: 1.1, duration: 0.4, ease: 'power2.out' });
        };
        const handleInteractionEnd = () => {
          gsap.to(item, { rotationX: 0, rotationY: 0, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' });
          gsap.to([icon, title], { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
          gsap.to(textContainer, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' });
          gsap.to(arrow, { opacity: 0, duration: 0.4, ease: 'power2.in' });
          gsap.to(icon, { scale: 1, duration: 0.4, ease: 'power2.in' });
        };
        const handleInteractionMove = (e) => {
          const { left, top, width, height } = item.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clientY = e.touches ? e.touches[0].clientY : e.clientY;
          const x = clientX - left;
          const y = clientY - top;
          const rotateX = gsap.utils.mapRange(0, height, -8, 8, y);
          const rotateY = gsap.utils.mapRange(0, width, 8, -8, x);
          item.style.setProperty('--x', `${x}px`);
          item.style.setProperty('--y', `${y}px`);
          gsap.to(item, { rotationX: rotateX, rotationY: rotateY, scale: 1.03, duration: 1, ease: 'power3.out' });
          gsap.to(icon, { x: rotateY * 0.4, y: -rotateX * 0.4, duration: 1.2, ease: 'power3.out' });
          gsap.to(title, { x: rotateY * 0.2, y: -rotateX * 0.2, duration: 1.2, ease: 'power3.out' });
        };

        // --- Tambahkan Event Listeners Universal ---
        item.addEventListener('mouseenter', handleInteractionStart);
        item.addEventListener('mouseleave', handleInteractionEnd);
        item.addEventListener('mousemove', handleInteractionMove);
        item.addEventListener('touchstart', handleInteractionStart, { passive: true });
        item.addEventListener('touchend', handleInteractionEnd, { passive: true });
        item.addEventListener('touchmove', handleInteractionMove, { passive: true });

        // Push cleanup function
        cleanupHandlers.push(() => {
          item.removeEventListener('mouseenter', handleInteractionStart);
          item.removeEventListener('mouseleave', handleInteractionEnd);
          item.removeEventListener('mousemove', handleInteractionMove);
          item.removeEventListener('touchstart', handleInteractionStart);
          item.removeEventListener('touchend', handleInteractionEnd);
          item.removeEventListener('touchmove', handleInteractionMove);
        });
      });
    }, sectionRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
      cleanupHandlers.forEach(cleanup => cleanup());
    };
  }, [isMounted]);

  if (!isMounted) return null; // Hydration guard



  return (
    <>
      <style jsx global>{`
        /* ... (style Anda yang lain tetap sama) ... */
         .item.sub-bg {
          position: relative;
          border-radius: 15px;
          padding: 40px;
          background: #181818;
          border: 1px solid #222;
          transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 380px; /* Atau sesuaikan */
        }
        .item.sub-bg:hover {
          background: #202020;
          box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.25);
        }
        .item.sub-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: inherit;
          padding: 1px;
          background: radial-gradient(
            400px circle at var(--x, 50%) var(--y, 50%),
            rgba(253, 91, 56, 0.6), /* Warna main-color Anda */
            transparent 50%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .item.sub-bg:hover::before {
          opacity: 1;
        }
        .item.sub-bg .text {
          height: 0;
          opacity: 0;
          overflow: hidden;
          transition: height 0.5s ease, opacity 0.5s ease; /* Transisi untuk text */
        }
        .item.sub-bg .arrow-icon {
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .item.sub-bg .tag {
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 8px;
          border-radius: 5px;
          font-size: 12px;
          margin-right: 5px;
          display: inline-block; /* Agar tag tidak memanjang */
          margin-bottom: 5px; /* Jarak antar tag jika wrap */
        }
      `}</style>
      <section className="services-clas" ref={sectionRef}>
        <div className="container section-padding bord-bottom-grd pt-0">
          <div className="sec-head mb-80" ref={titleRef}>
            <div className="d-flex align-items-center">
              <div>
                <span className="sub-title main-color mb-5">
                  My Specializations
                </span>
                <h3 className="fw-600 fz-50 text-u d-rotate wow">
                  <span className="rotate-text">
                    What I <span className="fw-200">Offer.</span>
                  </span>
                </h3>
              </div>
              {/* Optional: Tombol View All jika punya halaman daftar layanan */}
              {/* <div className="ml-auto vi-more">
                <Link
                  href="/services" // Arahkan ke halaman daftar layanan jika ada
                  className="butn butn-sm butn-bord radius-30"
                >
                  <span>View All</span>
                </Link>
                <span className="icon ti-arrow-top-right"></span>
              </div> */}
            </div>
          </div>
          <div className="row">
            {/* Menggunakan slice(0, 3) jika hanya ingin menampilkan 3 di homepage */}
            {servicesData.map((service, index) => (
              <div className="col-lg-4" key={service.slug}>
                <div
                  className="item sub-bg md-mb30"
                  ref={(el) => (itemsRef.current[index] = el)}
                >
                  <div>
                    <div className="icon-img-60 opacity-5 mb-40">
                      <Image
                        src={service.img}
                        alt={`${service.title} Icon`}
                        width={60}
                        height={60}
                        onError={(e) => e.currentTarget.src = 'https://placehold.co/60x60/1a1a1a/333?text=?'} // Fallback
                      />
                    </div>
                    <h5>{service.title}</h5>
                  </div>
                  <div>
                    {/* Container untuk teks deskripsi singkat dan tag */}
                    <div className="text mt-40">
                      {/* Menampilkan Tags */}
                      <div className="mb-10">
                        {service.tags && service.tags.map((tag, i) => (
                          <span key={i} className="tag">{tag}</span>
                        ))}
                      </div>
                      {/* Deskripsi singkat */}
                      <p>{service.desc}</p>
                    </div>
                    {/* Menggunakan Link component */}
                    <Link
                      href={`/services/${service.slug}`} // Link dinamis ke detail
                      className="arrow-icon mt-20 d-inline-block" // Tambahkan display inline-block
                    >
                      Learn More <span className="ti-arrow-top-right ml-10"></span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
