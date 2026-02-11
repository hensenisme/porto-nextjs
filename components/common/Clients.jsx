'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import clientsData from '@/data/clients.json';

function Clients() {
  const swiperOptions = {
    speed: 600,
    loop: true,
    slidesPerView: 5,
    spaceBetween: 40,
    centeredSlides: true,
    breakpoints: {
      // when window width is >= 640px
      640: {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 20,
        centeredSlides: false,
      },
      // when window width is >= 768px
      768: {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: false,
      },
      // when window width is >= 1200px
      1000: {
        loop: true,
        slidesPerView: 5,
        spaceBetween: 40,
        centeredSlides: true,
      },
    },
  };
  return (
    <section className="clients-carso in-circle section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-7 col-lg-8 col-md-10">
            <div className="sec-head text-center mb-80">
              <h3>
                I&apos;m proud to have participated in competitions and collaborated with various institutions.
              </h3>
            </div>
          </div>
        </div>

        <div className="swiper5" data-carousel="swiper">
          <Swiper
            {...swiperOptions}
            id="content-carousel-container-unq-clients"
            className="swiper-container"
            data-swiper="container"
          >
            {clientsData.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="item">
                  <div className="img icon-img-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={60}
                      style={{
                        width: '100%',
                        height: 'auto',
                        filter: 'brightness(0) invert(1)',
                        opacity: 0.7,
                        transition: 'opacity 0.4s'
                      }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="sec-bottom mt-100">
          <div className="main-bg d-flex align-items-center">
            <h6 className="fz-14 fw-400">
              Trusted for <span className="fw-400">delivering innovative </span>
              {" "}software and IoT solutions.
            </h6>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Clients;
