'use client';
// 1. Impor komponen Image dari next/image
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
function About() {
  const imgRef = useRef(null);
  const num1Ref = useRef(null);
  const num2Ref = useRef(null);
  const sectionRef = useRef(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Animasi 1: Reveal Gambar Profil
      gsap.fromTo(
        imgRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Animasi 2: Count-Up Angka
      const animateCountUp = (ref, endValue, isPercent = false) => {
        const target = { val: 0 };
        gsap.to(target, {
          val: endValue,
          duration: 2,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (ref.current) {
              ref.current.innerText =
                Math.round(target.val) + (isPercent ? '%' : '');
            }
          },
        });
      };

      if (num1Ref.current) {
        animateCountUp(num1Ref, 100, true);
      }
      if (num2Ref.current) {
        animateCountUp(num2Ref, 25);
      }
    }, sectionRef); // Scope to sectionRef

    return () => ctx.revert();
  }, []);
  return (
    <section className="about-author section-padding" ref={sectionRef}>
      <div className="container with-pad">
        <div className="row lg-marg">
          <div className="col-lg-5 valign">
            <div className="profile-img" ref={imgRef}>
              <div className="img">
                {/* Ganti dengan path foto profil Anda */}
                <Image
                  src="/assets/imgs/header/p2.jpg"
                  alt="Hendri Gunawan Profile Picture"
                  width={500}
                  height={700}
                  style={{
                    width: '100%',
                    height: 'auto',
                    pointerEvents: 'none',
                  }}
                  priority
                />
              </div>
              <span className="icon">
                <Image
                  src="/assets/imgs/resume/icon1.png"
                  alt="icon"
                  width={40}
                  height={40}
                  style={{ pointerEvents: 'none' }} // <-- PERUBAHAN DI SINI
                />
              </span>
              <span className="icon">
                <Image
                  src="/assets/imgs/resume/icon2.png"
                  alt="icon"
                  width={40}
                  height={40}
                  style={{ pointerEvents: 'none' }} // <-- PERUBAHAN DI SINI
                />
              </span>
              <span className="icon">
                <Image
                  src="/assets/imgs/resume/icon3.png"
                  alt="icon"
                  width={40}
                  height={40}
                  style={{ pointerEvents: 'none' }} // <-- PERUBAHAN DI SINI
                />
              </span>
              <span className="icon">
                <Image
                  src="/assets/imgs/resume/icon4.png"
                  alt="icon"
                  width={40}
                  height={40}
                  style={{ pointerEvents: 'none' }} // <-- PERUBAHAN DI SINI
                />
              </span>
            </div>
          </div>
          <div className="col-lg-7 valign">
            <div className="cont">
              <h6 className="sub-title main-color mb-30">About Me</h6>
              <div className="text">
                {/* Konten di bawah ini telah diperbarui ke Bahasa Inggris */}
                <h4 className="mb-30">
                  I am a{' '}
                  <span className="fw-200">
                    Software & IoT Engineer
                  </span>{' '}
                  focused on modern digital product development.
                </h4>
                <p>
                  As an Information Technology graduate, I have a passion for
                  transforming complex ideas into functional and intuitive
                  digital solutions. My goal is to build impactful digital
                  experiences, whether it&apos;s sophisticated web applications
                  with React & Next.js, cross-platform mobile apps with
                  Flutter, or innovative IoT systems.
                </p>
                <Link href="/assets/CV-Hensen.pdf" target="_blank" className="butn butn-md butn-bord radius-30 mt-30">
                  <span className="text">Download CV</span>
                </Link>
                <div className="numbers mt-50">
                  <div className="row lg-marg">
                    <div className="col-md-6">
                      <div className="item bord-thin-top pt-30 d-flex align-items-end mt-20">
                        <div>
                          <h3 className="fw-300 mb-10" ref={num1Ref}>
                            0%
                          </h3>
                          <h6 className="p-color sub-title">
                            Clients Satisfaction
                          </h6>
                        </div>
                        <div className="ml-auto">
                          <div className="icon-img-40">
                            <Image
                              src="/assets/imgs/arw0.png"
                              alt="arrow"
                              width={40}
                              height={40}
                              style={{ pointerEvents: 'none' }} // <-- PERUBAHAN DI SINI
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="item bord-thin-top pt-30 d-flex align-items-end mt-20">
                        <div>
                          <h3 className="fw-300 mb-10" ref={num2Ref}>
                            0
                          </h3>
                          <h6 className="p-color sub-title">
                            Projects Completed
                          </h6>
                        </div>
                        <div className="ml-auto">
                          <div className="icon-img-40">
                            <Image
                              src="/assets/imgs/arw0.png"
                              alt="arrow"
                              width={40}
                              height={40}
                              style={{ pointerEvents: 'none' }} // <-- PERUBAHAN DI SINI
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default About;
