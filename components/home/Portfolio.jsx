'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import MagneticButton from '@/components/common/MagneticButton';

// Terima 'posts' dari props
function Portfolio({ posts = [] }) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);
      const cards = document.querySelectorAll('.cards .card-item'); // Scope is global here if not scoped, but we can stick to class names or use a ref for container if available.
      if (cards.length === 0) return;

      let stickDistance = 0;
      const firstCardST = ScrollTrigger.create({
        trigger: cards[0],
        start: 'center center',
      });

      const lastCard = cards[cards.length - 1];
      if (!lastCard) return;

      const lastCardST = ScrollTrigger.create({
        trigger: lastCard,
        start: 'bottom bottom',
      });

      if (!lastCardST) return;

      cards.forEach((card, index) => {
        const scale = 1 - (cards.length - index) * 0.025;
        const scaleDown = gsap.to(card, {
          scale: scale,
          transformOrigin: '50% ' + (lastCardST.start + stickDistance),
        });
        ScrollTrigger.create({
          trigger: card,
          start: 'center center',
          end: () => lastCardST.start + stickDistance,
          pin: true,
          pinSpacing: false,
          ease: 'none',
          animation: scaleDown,
          toggleActions: 'restart none none reverse',
        });
      });
    });

    return () => ctx.revert();
  }, [posts]);

  const maxProjects = 5;
  const portfolioData = posts || []; // Pastikan portfolioData adalah array

  return (
    <>
      <style jsx global>{`
        /* ... styling gambar Anda sebelumnya ... */
        .home-portfolio-card-padded {
          padding: 20px 20px;
        }
        .home-portfolio-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border-radius: 10px;
          background-color: #2a2a2a;
        }
        .home-portfolio-image-wrapper img {
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .card-item:hover .home-portfolio-image-wrapper img {
          transform: scale(1.05);
        }

        /* --- PERBAIKAN CSS BARU UNTUK EXCERPT --- */

        /* 1. HAPUS 'align-self: flex-start' agar kolom meregang */
        .work-card .card-item .row > .col-lg-5 {
          /* align-self: flex-start !important; */ /* <--- DIHAPUS */
          /* Biarkan 'display: flex' agar .cont bisa 100% height */
          display: flex;
        }

        /* 2. Paksa margin bawah judul agar kecil (mengurangi celah) */
        .work-card .card-item .cont h4 {
          margin-bottom: 15px !important;
          flex-shrink: 0; /* Jangan biarkan judul mengecil */
        }
        
        /* BARU: Atur .cont sebagai flex column */
        .work-card .card-item .cont {
          display: flex;
          flex-direction: column;
          width: 100%; /* Isi lebar kolom */
          height: 100%; /* Isi tinggi kolom (karena col-lg-5 meregang) */
        }

        .portfolio-excerpt-container {
          /* 3. GANTI flex-grow DENGAN line-clamp */
          /* flex-grow: 1; */ /* <--- DIHAPUS */
          
          /* Menerapkan 'line-clamp' untuk elipsis (...) */
          display: -webkit-box;
          -webkit-line-clamp: 4; /* BATASI HINGGA 4 BARIS (bisa disesuaikan) */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          
          line-height: 25px; 
          margin-bottom: 15px; /* Beri jarak ke link di bawah */
        }

        .portfolio-excerpt-container p {
          margin: 0 0 15px 0;
          padding: 0;
          /* Hapus display:inline agar line-clamp berfungsi */
        }
        .portfolio-excerpt-container p:last-child {
          margin-bottom: 0;
        }

        /* BARU: Atur link "View Details" */
        .work-card .card-item .cont .underline {
          margin-top: auto;  /* AJAIB: Mendorong link ke bawah */
          padding-top: 15px;   /* Beri jarak dari konten di atasnya */
          flex-shrink: 0; /* Jangan biarkan link mengecil */
        }
        /* --- AKHIR PERBAIKAN CSS --- */
        
        /* BARU: Tech Tags Styling (Larger & Balanced) */
        .tech-tags {
          margin-top: 15px;
          margin-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tech-tag {
          font-size: 13px; /* Diperbesar dari 11px */
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 6px 14px; /* Padding lebih lega */
          border-radius: 30px; /* Lebih bulat */
          color: #ddd;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }
        .card-item:hover .tech-tag {
          border-color: rgba(253, 91, 56, 0.4);
          background: rgba(253, 91, 56, 0.05);
        }

        /* BARU: View Details Hover Effect (Advanced) */
        .work-card .card-item .cont .underline {
           position: relative;
           display: inline-flex;
           align-items: center;
           gap: 5px;
           text-decoration: none;
        }
        .work-card .card-item .cont .underline .text {
          transition: color 0.3s ease;
          position: relative;
        }
        /* Sliding Underline Effect */
        .work-card .card-item .cont .underline .text::after {
          content: '';
          position: absolute;
          width: 0%;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: #fd5b38;
          transition: width 0.3s ease;
        }
        .work-card .card-item .cont .underline:hover .text {
          color: #fd5b38 !important;
        }
        .work-card .card-item .cont .underline:hover .text::after {
          width: 100%;
        }
        .work-card .card-item .cont .underline i {
          transition: transform 0.3s ease;
        }
        .work-card .card-item .cont .underline:hover i {
          transform: translate(3px, -3px);
        }
        
        /* BARU: View All Button Styling */
        .view-all-btn {
          height: 45px;
          padding: 0 25px;
          border-radius: 30px;
          display: flex !important;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
          background: transparent;
        }
        .view-all-btn:hover {
          background: #fff;
          color: #1d1d1d;
          border-color: #fff;
        }
        
        /* Content Vertical Center */
        .work-card .card-item .cont {
          display: flex;
          flex-direction: column;
          justify-content: center; /* Vertically center content */
          width: 100%;
          height: 100%;
          padding-right: 20px; /* Sedikit jarak dari gambar */
        }
        
        /* Image Hover Scale */
        .home-portfolio-image-wrapper img {
           transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .card-item:hover .home-portfolio-image-wrapper img {
           transform: scale(1.05);
        }
      `}</style>
      <section className="work-card section-padding pb-0">
        <div className="container">
          <div className="sec-head mb-80">
            <div className="d-flex align-itemsCen
ter">
              <div>
                <span className="sub-title main-color mb-5">My Portfolio</span>
                <h3 className="fw-600 fz-50 text-u d-rotate wow">
                  <span className="rotate-text">
                    Selected <span className="fw-200">Works</span>
                  </span>
                </h3>
              </div>
              <div className="ml-auto">
                <Link
                  href="/portfolio"
                  className="butn butn-sm radius-30 view-all-btn"
                >
                  <span className="text">View All</span>
                  <span className="icon ti-arrow-top-right"></span>
                </Link>
              </div>
            </div>
          </div>
          {portfolioData.length === 0 ? (
            <div className="text-center mt-50 mb-50">
              <h6 className="fw-400" style={{ color: '#888' }}>
                Projects are being updated. Check back soon!
              </h6>
            </div>
          ) : (
            <div className="cards">
              {portfolioData.slice(0, maxProjects).map((project) => (
                <div
                  className="card-item sub-bg home-portfolio-card-padded"
                  key={project.slug}
                >
                  <div className="row">
                    {/* 'valign' sudah dihapus,
                    CSS baru kita di <style> akan menangani perataan
                  */}
                    <div className="col-lg-5">
                      {/* .cont sekarang adalah flex column */}
                      <div className="cont">
                        {/* 1. Kategori */}
                        <div className="mb-15">
                          {project.allCategories?.nodes
                            .filter((cat) => cat.parent !== null) // Hanya sub-kategori
                            .slice(0, 2) // Batasi 2
                            .map((cat) => (
                              <Link
                                href={`/portfolio?category=${cat.slug}`}
                                className="tag"
                                key={cat.slug}
                              >
                                {cat.name}
                              </Link>
                            ))}
                        </div>

                        {/* 2. Judul */}
                        <h4>{project.title}</h4>

                        {/* 2.5 Tech Tags (New) */}
                        {project.tags?.nodes && project.tags.nodes.length > 0 && (
                          <div className="tech-tags">
                            {project.tags.nodes.slice(0, 4).map((tag) => (
                              <span key={tag.id} className="tech-tag">
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 3. Ringkasan */}
                        <div
                          className="portfolio-excerpt-container"
                          dangerouslySetInnerHTML={{
                            __html: project.excerpt,
                          }}
                        />

                        {/* 4. Link Detail  */}
                        <div className="mt-auto pt-15">
                          <MagneticButton
                            href={`/portfolio/${project.slug}`}
                            className="underline magnetic-link"
                          >
                            <span className="text main-color sub-title">
                              View Details <i className="ti-arrow-top-right"></i>
                            </span>
                          </MagneticButton>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-7">
                      {project.featuredImage && (
                        <div className="home-portfolio-image-wrapper">
                          <Image
                            src={project.featuredImage.node.sourceUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 991px) 100vw, 50vw"
                            style={{
                              objectFit: 'cover',
                              pointerEvents: 'none', // <-- PERUBAHAN DI SINI
                            }}
                            priority // Prioritaskan gambar di homepage
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Tombol "More Projects" ini tidak diperlukan 
              karena sudah ada "View All" di header */}
        </div>
        <div className="sec-bottom mt-100">
          <div className="main-bg d-flex align-items-center">
            <h6 className="fz-14 fw-400">
              More than <span className="fw-600"> 200+ companies</span> trusted
              me worldwide
            </h6>
          </div>
        </div>
      </section>
    </>
  );
}

export default Portfolio;

