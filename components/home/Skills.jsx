'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Data keahlian diperbarui berdasarkan CV dan informasi tambahan Anda
const skillsData = [
  {
    name: 'Web Development',
    iconSrc: '/assets/imgs/resume/s2.png', // Menggunakan ikon development
    level: 90,
    description: 'Mengembangkan aplikasi web full-stack yang fungsional dan responsif menggunakan React, Next.js, dan Node.js.',
  },
  {
    name: 'Mobile Development',
    iconSrc: '/assets/imgs/resume/s_flutter.png', // Anda perlu menambahkan ikon ini
    level: 85,
    description: 'Membangun aplikasi mobile cross-platform untuk Android dan iOS menggunakan Flutter.',
  },
  {
    name: 'IoT & Embedded',
    iconSrc: '/assets/imgs/resume/s_iot.png', // Anda perlu menambahkan ikon ini
    level: 95,
    description: 'Merancang dan memprogram sistem tertanam (embedded systems) dan solusi Internet of Things (IoT) menggunakan mikrokontroller seperti ESP32.',
  },
  {
    name: 'Cloud & DevOps',
    iconSrc: '/assets/imgs/resume/s_cloud.png', // Anda perlu menambahkan ikon ini
    level: 80,
    description: 'Menangani setup dan maintenance server (Ubuntu, Nginx), deployment, serta konfigurasi jaringan dan cloud.',
  },
  {
    name: 'Electrical Engineering',
    iconSrc: '/assets/imgs/resume/s_electrical.png', // Anda perlu menambahkan ikon ini
    level: 88,
    description: 'Keahlian dalam elektronika arus lemah dan kuat, termasuk instalasi sistem kelistrikan seperti PLTS.',
  },
  {
    name: 'UI/UX Design',
    iconSrc: '/assets/imgs/resume/s1.png', // Menggunakan ikon UI/UX
    level: 75,
    description: 'Merancang antarmuka pengguna yang intuitif dan fungsional menggunakan tools seperti Figma.',
  },
];

function Skills() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const itemsRef = useRef([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const openModal = (skill) => {
    setSelectedSkill(skill);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      });

      const handleMagneticMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        itemsRef.current.forEach(item => {
          if (!item) return;
          const { top, left, width, height } = item.getBoundingClientRect();
          const x = clientX - (left + width / 2);
          const y = clientY - (top + height / 2);
          gsap.to(item, { x: x * 0.1, y: y * 0.1, duration: 0.5, ease: 'power2.out' });
        });
      };

      const handleMagneticLeave = () => {
        itemsRef.current.forEach(item => {
          if (!item) return;
          gsap.to(item, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
        });
      };

      section.addEventListener('mousemove', handleMagneticMove);
      section.addEventListener('mouseleave', handleMagneticLeave);
      section.addEventListener('touchmove', handleMagneticMove, { passive: true });
      section.addEventListener('touchend', handleMagneticLeave, { passive: true });

      itemsRef.current.forEach((item, index) => {
        if (!item) return;
        gsap.from(item, {
          y: 100,
          opacity: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
          delay: index * 0.1,
          scrollTrigger: { trigger: item, start: 'top 95%', toggleActions: 'play none none none' },
        });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style jsx global>{`
        .my-skills .item {
          text-align: center;
          position: relative;
          padding: 40px 20px;
          border: 1px solid #333;
          border-radius: 40px;
          transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
          cursor: pointer;
        }
        .my-skills .item:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);
          border-color: var(--main-color);
        }
        .my-skills .box-bord {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 30px;
          border-radius: 50%;
          background: #1f1f1f;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .my-skills .box-bord .img {
          width: 60px;
          height: 60px;
          position: relative;
        }
        .my-skills .box-bord .img img {
          filter: grayscale(100%);
          transition: filter 0.4s ease, transform 0.4s ease;
        }
        .my-skills .item:hover .box-bord .img img {
          filter: grayscale(0%);
          transform: scale(1.1);
        }
        .my-skills .item h6 {
          margin-top: auto;
          transition: color 0.4s ease;
        }
        .my-skills .item:hover h6 {
          color: var(--main-color);
        }
        .skill-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .skill-modal-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .skill-modal-content {
          background: #1a1a1a;
          padding: 40px;
          border-radius: 15px;
          width: 90%;
          max-width: 500px;
          border: 1px solid #333;
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }
        .skill-modal-overlay.open .skill-modal-content {
          transform: scale(1);
        }
        .skill-modal-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .skill-modal-header h4 {
          margin: 0;
        }
        .skill-modal-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          margin-left: auto;
          cursor: pointer;
        }
        .progress-bar-container {
          width: 100%;
          height: 8px;
          background: #333;
          border-radius: 4px;
          margin: 10px 0 20px;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--main-color);
          border-radius: 4px;
          transform-origin: left;
        }
      `}</style>
      <section className="my-skills section-padding" ref={sectionRef}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-10">
              <div className="sec-head text-center mb-80" ref={titleRef}>
                <h3>
                  My Core <span className="opacity-7">Expertise Areas</span>
                </h3>
              </div>
            </div>
          </div>
          <div className="row md-marg">
            {skillsData.map((skill, index) => (
              <div className="col-lg-2 col-md-4 col-6" key={index}>
                <div
                  className="item mb-30"
                  ref={(el) => (itemsRef.current[index] = el)}
                  onClick={() => openModal(skill)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openModal(skill);
                    }
                  }}
                >
                  <div className="box-bord">
                    <div className="img">
                      <Image
                        src={skill.iconSrc}
                        alt={skill.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/60x60/1f1f1f/FFF?text=?'; }} // Fallback
                      />
                    </div>
                  </div>
                  <h6 className="fz-18">{skill.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal untuk detail skill */}
      {selectedSkill && (
        <div
          className={`skill-modal-overlay ${modalOpen ? 'open' : ''}`}
          onClick={closeModal}
        >
          <div
            className="skill-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="skill-modal-header">
              <h4>{selectedSkill.name}</h4>
              <button className="skill-modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <p className="p-color">{`Proficiency: ${selectedSkill.level}%`}</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: '0%',
                  animation: modalOpen ? `fill-progress 1s ease-out forwards` : 'none',
                  '--final-width': `${selectedSkill.level}%`,
                }}
              ></div>
            </div>
            <p>{selectedSkill.description}</p>
          </div>
        </div>
      )}

      {/* Menambahkan keyframes untuk animasi progress bar di modal */}
      <style jsx global>{`
        @keyframes fill-progress {
          from { width: 0%; }
          to { width: var(--final-width); }
        }
      `}</style>
    </>
  );
}

export default Skills;
