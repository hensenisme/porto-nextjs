import { getPortfolioPosts, getBlogPosts } from "@/lib/wordpress";

import Clients from "@/components/common/Clients";
import Marq2 from "@/components/common/Marq2";
import Blog from "@/components/home/Blog"; // Komponen Blog ini mungkin perlu disesuaikan nanti
import Testimonials from "@/components/home/Testimonials"; // Komponen Testimonials ini mungkin perlu disesuaikan nanti
import About from "@/components/home/About";
import Header from "@/components/home/Header";
import Marq from "@/components/home/Marq";
import Portfolio from "@/components/home/Portfolio"; // Komponen Portfolio ini mungkin perlu disesuaikan nanti
import Services from "@/components/home/Services";
import Skills from "@/components/home/Skills";

import ScrollToAnchor from "@/components/common/ScrollToAnchor";

// Aktifkan ISR untuk halaman utama (jika diinginkan, sesuaikan interval)
export const revalidate = 60; // Revalidate every 60 seconds

// Halaman utama tetap Server Component
export default async function Home() {
  // Ambil 5 item portofolio terbaru dan 3 artikel blog terbaru
  // FIXED: Panggil nama fungsi yang baru
  const portfolioPostsData = await getPortfolioPosts({ first: 5 });
  const blogPostsData = await getBlogPosts({ first: 3 });

  // Error handling sederhana (opsional tapi bagus)
  if (!portfolioPostsData?.nodes || !blogPostsData?.nodes) {
    console.error("Failed to fetch initial posts for homepage.");
    // Anda bisa menampilkan pesan error atau fallback UI di sini
  }

  return (
    <>
      <ScrollToAnchor />
      <main className="main-bg o-hidden">
        <div id="home">
          <Header />
        </div>
        <Marq />
        <div id="about">
          <About />
        </div>
        <div id="skills">
          <Skills />
        </div>
        <div id="services">
          <Services />
        </div>
        <div id="portfolio">
          {/* Kirim data portfolio ke komponen */}
          <Portfolio posts={portfolioPostsData?.nodes || []} />
        </div>
        {/* <div id="testimonials">
          <Testimonials />
        </div> */}
        <div id="clients">
          <Clients />
        </div>
        <div id="blog">
          {/* Kirim data blog ke komponen */}
          <Blog posts={blogPostsData?.nodes || []} />
        </div>
        <Marq2 />
      </main>
    </>
  );
}
