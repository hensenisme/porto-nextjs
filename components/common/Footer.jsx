import React from 'react';
import Image from 'next/image';

function Footer() {
  // Secara otomatis mendapatkan tahun saat ini
  const currentYear = new Date().getFullYear();

  return (
    <footer className="clean-footer crev">
      <div className="container pb-40 pt-40 ontop">
        <div className="row justify-content-between">
          <div className="col-lg-4">
            <div className="logo icon-img-100 md-mb80">
              <Image src="/assets/imgs/logo-light.png" alt="logo" width={100} height={33} style={{ width: '100px', height: 'auto' }} />
              <p className="fz-14 mt-15 opacity-8">
                Building seamless integration between Software & IoT.
              </p>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="column md-mb50">
              <h6 className="sub-title mb-30">Sitemap</h6>
              <ul className="rest fz-14 opacity-7">
                <li className="mb-15">
                  <a href="/" className="hover-this">Home</a>
                </li>
                <li className="mb-15">
                  <a href="/#about" className="hover-this">About Me</a>
                </li>
                <li className="mb-15">
                  <a href="/#services" className="hover-this">Services</a>
                </li>
                <li className="mb-15">
                  <a href="/portfolio" className="hover-this">Portfolio</a>
                </li>
                <li>
                  <a href="/blog" className="hover-this">Blog</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="column md-mb50">
              <h6 className="sub-title mb-30">Contact</h6>
              <h6 className="p-color fw-400">
                Jl. Telekomunikasi No. 1, Bojongsoang <br /> Bandung, Indonesia
              </h6>
              <h6 className="mt-30 mb-15">
                <a href="mailto:hensenisme@gmail.com" className="hover-this">hensenisme@gmail.com</a>
              </h6>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="column subscribe-minimal">
              <h6 className="sub-title mb-30">Socials</h6>
              <ul className="rest social-icon d-flex align-items-center">
                <li className="hover-this cursor-pointer">
                  <a href="https://github.com/hensenisme" target="_blank" className="hover-anim">
                    <i className="fab fa-github"></i>
                  </a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href="https://linkedin.com/in/hensenisme" target="_blank" className="hover-anim">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href="https://instagram.com/hensenisme" target="_blank" className="hover-anim">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href="https://facebook.com/hensenisme" target="_blank" className="hover-anim">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* === BAGIAN YANG DIPERBARUI === */}
        <div className="pt-30 pb-30 mt-80 bord-thin-top">
          <div className="text-center">
            <p className="fz-14">
              © {currentYear} Hensen.dev. All Rights Reserved.
            </p>
          </div>
        </div>
        {/* === AKHIR BAGIAN YANG DIPERBARUI === */}

      </div>
      <div className="circle-blur">
        <Image src="/assets/imgs/patterns/blur1.png" alt="blur" width={1000} height={1000} style={{ width: '100%', height: 'auto' }} />
      </div>
    </footer>
  );
}

export default Footer;
