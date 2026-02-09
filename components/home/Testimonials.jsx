'use client';
import React from 'react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import testimonialsData from '@/data/testimonials.json';

function Testimonials() {
  const swiperOptions = {
    modules: [Navigation],
    slidesPerView: 'auto',
    spaceBetween: 30,
    loop: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 'auto',
      },
    },
    navigation: {
      nextEl: '.testim-modern .swiper-button-next',
      prevEl: '.testim-modern .swiper-button-prev',
    },
  };

  return (
    <section className="testim-modern section-padding sub-bg bord-top-grd bord-bottom-grd">
      <div className="container">
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center">
            <div>
              <span className="sub-title main-color mb-5">Testimonials</span>
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Trusted <span className="fw-200">by Clients.</span>
                </span>
              </h3>
            </div>
            <div className="ml-auto">
              <div className="swiper-arrow-control">
                <div
                  className="swiper-button-prev"
                  role="button"
                  aria-label="Previous slide"
                  tabIndex="0"
                >
                  <span className="ti-arrow-left"></span>
                </div>
                <div
                  className="swiper-button-next"
                  role="button"
                  aria-label="Next slide"
                  tabIndex="0"
                >
                  <span className="ti-arrow-right"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="testim-swiper3 out-right"
          data-carousel="swiper"
          data-loop="true"
          data-space="30"
        >
          <Swiper
            {...swiperOptions}
            id="content-carousel-container-unq-testim"
            className="swiper-container"
            data-swiper="container"
          >
            {testimonialsData.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="item">
                  <div className="cont">
                    <h6 className="sub-title mb-15">Feedback</h6>
                    <div className="text">
                      <p>“ {item.content} ”</p>
                    </div>
                  </div>
                  <div className="info">
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="img fit-img">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            style={{ width: '100%', height: 'auto', borderRadius: '50%' }}
                          />
                        </div>
                      </div>
                      <div className="ml-20">
                        <h6 className="fz-18">{item.name}</h6>
                        <span className="p-color opacity-8 fz-15 mt-5">
                          {item.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
