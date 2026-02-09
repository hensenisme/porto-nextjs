import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Marq2() {
  const marquess = ['Get In Touch']; // Replace with your actual array
  const AllMarquess = Array(6).fill(marquess).flat();
  const contact = ['Contact Me']; // Replace with your actual array
  const AllContact = Array(6).fill(contact).flat();

  return (
    <section className="call-marq section-padding o-hidden">
      <div className="main-marq lrg sub-bg pt-20 pb-20">
        <div className="slide-har st1">
          <div className="box">
            {AllMarquess.map((item, i) => (
              <div key={i} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                  <span className="icon-img-50 ml-40">
                    <Image src="/assets/imgs/star.png" alt="star" width={50} height={50} />
                  </span>
                </h4>
              </div>
            ))}
            {AllMarquess.map((item, i) => (
              <div key={i} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                  <span className="icon-img-50 ml-40">
                    <Image src="/assets/imgs/star.png" alt="star" width={50} height={50} />
                  </span>
                </h4>
              </div>
            ))}
          </div>

          <Link href="/contact" className="overlay-link"></Link>
        </div>
      </div>
      <div className="main-marq bord-item">
        <div className="slide-har st2">
          <div className="box">
            {AllContact.map((item, i) => (
              <div key={i} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                </h4>
              </div>
            ))}
          </div>
          <div className="box">
            {AllContact.map((item, i) => (
              <div key={i} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                </h4>
              </div>
            ))}
          </div>

          <Link href="/contact" className="overlay-link"></Link>
        </div>
      </div>
    </section>
  );
}

export default Marq2;
