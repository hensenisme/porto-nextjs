'use client';
import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ submitting: false, success: true, error: null });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const result = await response.json();
        setStatus({
          submitting: false,
          success: false,
          error: result.message || 'Something went wrong.',
        });
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: 'Network error. Please try again.',
      });
    }
  };

  return (
    <section className="contact section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 valign">
            <div className="sec-head info-box full-width md-mb80">
              <div className="phone fz-30 fw-600 underline main-color">
                <a
                  href="https://wa.me/6282171106310"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +628 217 110 6310
                </a>
              </div>
              <div className="morinfo mt-50 pb-30 bord-thin-bottom">
                <h6 className="mb-15">Address</h6>
                <p>Jl. Telekomunikasi No. 1, Bojongsoang, Bandung, Indonesia</p>
              </div>
              <div className="morinfo mt-30 pb-30 bord-thin-bottom">
                <h6 className="mb-15">Email</h6>
                <p>hensenisme@gmail.com</p>
              </div>

              <div className="social-icon mt-50 has-spacing">
                <style jsx>{`
                  .has-spacing a { margin-right: 15px; }
                `}</style>
                <a href="https://github.com/hensenisme" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://linkedin.com/in/hendrig" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://instagram.com/hens3n" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="mailto:hensenisme@gmail.com">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-7 offset-lg-1 valign">
            <div className="full-width">
              <div className="sec-head mb-50">
                <h6 className="sub-title main-color mb-15">Let&lsquo;s Chat</h6>
                <h3 className="text-u ls1">
                  Send a <span className="fw-200">message</span>
                </h3>
              </div>
              <form
                id="contact-form"
                className="form2"
                onSubmit={handleSubmit}
              >
                <div className="messages">
                  {status.success && (
                    <h5 className="text-success mb-30" role="alert">
                      Message sent successfully!
                    </h5>
                  )}
                  {status.error && (
                    <h5 className="text-danger mb-30" role="alert">
                      {status.error}
                    </h5>
                  )}
                </div>

                <div className="controls row">
                  <div className="col-lg-6">
                    <div className="form-group mb-30">
                      <input
                        id="form_name"
                        type="text"
                        name="name"
                        placeholder="Name"
                        required="required"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group mb-30">
                      <input
                        id="form_email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        required="required"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group mb-30">
                      <input
                        id="form_subject"
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <textarea
                        id="form_message"
                        name="message"
                        placeholder="Message"
                        rows="4"
                        required="required"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="mt-30">
                      <button
                        type="submit"
                        className="butn butn-full butn-bord radius-30"
                        disabled={status.submitting}
                      >
                        <span className="text">
                          {status.submitting ? 'Sending...' : "Let's Talk"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
