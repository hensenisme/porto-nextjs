'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RelatedPostCard from '@/components/common/RelatedPostCard';
import MagneticButton from '@/components/common/MagneticButton';
// 1. Impor Framer Motion
import { motion } from 'framer-motion';

// 2. Definisikan varian animasi sederhana
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function PortfolioDetailContent({ post, relatedPosts }) {
  // Tentukan sub-kategori utama (logika dari file lama)
  const primarySubCategory =
    post.allCategories?.nodes.find(
      (cat) => cat.parent?.node?.slug === 'portfolio'
    ) || null;

  return (
    <>
      <main className="main-bg o-hidden">
        {/* Header (Tidak perlu animasi) */}
        <div
          className="header header-project d-flex align-items-end position-relative"
          data-overlay-dark="8"
        >
          {post.featuredImage?.node?.sourceUrl && (
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              fill
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mMm+w8AAW8BH0916QoAAAAASUVORK5CYII="
              style={{ objectFit: 'cover', zIndex: -1 }}
            />
          )}
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="caption">
                  <div className="mb-30">
                    <MagneticButton href="/portfolio" className="butn butn-sm radius-30">
                      <span className="icon ti-arrow-left mr-10"></span>
                      <span className="text">Back to Portfolio</span>
                    </MagneticButton>
                  </div>
                  <h1>{post.title}</h1>
                  {primarySubCategory && (
                    <p className="mt-10 fz-16">
                      <Link
                        href={`/portfolio?category=${primarySubCategory.slug}`}
                      >
                        {primarySubCategory.name}
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <section className="section-padding">
          <div className="container">
            {/* 3. Tambahkan <motion.div> untuk "Scroll Reveal" */}
            <motion.div
              className="info mb-80 pb-20 bord-thin-bottom"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }} // Memicu saat 30% terlihat
            >
              <div className="row">
                <div className="col-md-6 col-lg-4">
                  <div className="item mb-30">
                    <span className="opacity-8 mb-5">Category:</span>
                    <h6>
                      {post.allCategories?.nodes
                        .filter((cat) => cat.parent?.node?.slug === 'portfolio')
                        .map((cat) => cat.name)
                        .join(', ')}
                    </h6>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  {/* Di sini Anda bisa tambahkan data ACF nanti, misal "Client" */}
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="item mb-30">
                    <span className="opacity-8 mb-5">Date:</span>
                    <h6>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h6>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Section */}
            {/* 4. Tambahkan <motion.div> lagi untuk konten utama */}
            <motion.div
              className="row justify-content-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }} // Memicu lebih awal
            >
              <div className="col-lg-11">
                {/* Target class ".wordpress-content" ini untuk styling 
                  (lihat Bagian 2 di bawah)
                */}
                <div
                  className="wordpress-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Related Projects Section */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="related-posts section-padding bord-top-grd">
          <div className="container">
            <div className="sec-head mb-80">
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Related <span className="fw-200">Projects</span>
                </span>
              </h3>
            </div>
            <div className="row">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard
                  key={relatedPost.slug}
                  post={relatedPost}
                  type="portfolio"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
