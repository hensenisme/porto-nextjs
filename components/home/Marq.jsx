import Image from 'next/image';

function Marq() {
  // Daftar keahlian diperbarui untuk mencerminkan skill Anda
  const items = [
    'Full-Stack Web Development',
    'React & Next.js',
    'Mobile Apps with Flutter',
    'IoT & Embedded Systems',
    'Cloud & DevOps Solutions',
    'Node.js Backend',
    'API Development',
    'Electrical Engineering',
  ];

  return (
    <section className="marq">
      <div className="main-marq lrg sub-bg pt-20 pb-20 shadow-off">
        <div className="slide-har st1">
          <div className="box">
            {items.map((item, i) => (
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
          <div className="box">
            {items.map((item, i) => (
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
        </div>
      </div>
    </section>
  );
}

export default Marq;
