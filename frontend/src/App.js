import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Custom cursor component
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    };

    const handleMouseEnter = () => {
      cursor.classList.add('cursor-hover');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('cursor-hover');
    };

    document.addEventListener('mousemove', moveCursor);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor"></div>
      <div ref={cursorDotRef} className="cursor-dot"></div>
    </>
  );
};

// Scroll reveal hook
const useScrollReveal = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

// Parallax hook
const useParallax = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

// Magnetic button effect
const MagneticButton = ({ children, className, ...props }) => {
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = () => {
    buttonRef.current.style.transform = 'translate(0px, 0px)';
  };

  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

// Contact Form Component with enhanced UX
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input interactive"
          placeholder="Your name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input interactive"
          placeholder="your.email@example.com"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="form-input interactive"
          placeholder="Tell me about your project or how I can help you..."
        />
      </div>
      
      <MagneticButton
        type="submit"
        disabled={isSubmitting}
        className="primary-button w-full interactive"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <div className="loading-spinner"></div>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </MagneticButton>
      
      {submitStatus === 'success' && (
        <div className="success-message animate-reveal">
          <div className="checkmark"></div>
          Thank you! Your message has been sent successfully.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="error-message animate-reveal">
          Sorry, there was an error. Please try again.
        </div>
      )}
    </form>
  );
};

// Floating elements component
const FloatingElements = () => {
  return (
    <div className="floating-elements">
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      <div className="floating-particle particle-1"></div>
      <div className="floating-particle particle-2"></div>
      <div className="floating-particle particle-3"></div>
    </div>
  );
};

function App() {
  useScrollReveal();
  useParallax();

  return (
    <div className="app-container">
      <CustomCursor />
      <FloatingElements />
      
      {/* Enhanced Navigation */}
      <nav className="glass-nav">
        <div className="nav-container">
          <div className="logo interactive">
            <span className="logo-text">Taichi</span>
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link interactive">Home</a>
            <a href="#expertise" className="nav-link interactive">Expertise</a>
            <a href="#services" className="nav-link interactive">Services</a>
            <a href="#testimonials" className="nav-link interactive">Reviews</a>
            <a href="#contact" className="nav-link interactive">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content reveal">
            <div className="hero-badge">
              <span className="availability-dot"></span>
              Available for new projects
            </div>
            <h1 className="hero-title">
              <span className="hero-greeting">Hi, I'm</span>
              <span className="hero-name">Taichi</span>
            </h1>
            <div className="hero-subtitle">
              <p className="role-title">AI Creator & AI Consultant</p>
              <p className="role-description">
                Transforming businesses through intelligent automation and cutting-edge AI solutions
              </p>
            </div>
            
            <div className="hero-actions">
              <MagneticButton className="primary-button interactive">
                View My Work
              </MagneticButton>
              <MagneticButton className="secondary-button interactive">
                Get In Touch
              </MagneticButton>
            </div>
          </div>
          
          <div className="hero-visual parallax" data-speed="0.3">
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1607895232440-6ba075948c14"
                alt="AI Technology"
                className="hero-image"
              />
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="expertise-section">
        <div className="section-container">
          <div className="section-header reveal">
            <h2 className="section-title">My Expertise</h2>
            <p className="section-subtitle">
              Specialized in creating intelligent solutions that drive business growth and innovation
            </p>
          </div>
          
          <div className="expertise-grid">
            {[
              {
                icon: "🧠",
                title: "Generative AI",
                description: "Expertise in developing cutting-edge generative AI solutions for content creation, automation, and innovation."
              },
              {
                icon: "👨‍🏫",
                title: "AI Coaching",
                description: "Guiding teams and individuals to successfully integrate AI technologies into their workflows and business processes."
              },
              {
                icon: "⚡",
                title: "Workflow Optimization",
                description: "Streamlining business processes through AI-powered automation and intelligent workflow design."
              },
              {
                icon: "🎨",
                title: "AI Image Creation",
                description: "Creating stunning visual content using advanced AI image generation tools and techniques."
              },
              {
                icon: "🎬",
                title: "AI Video Production",
                description: "Producing engaging video content through AI-powered tools and automated video generation systems."
              },
              {
                icon: "💡",
                title: "AI Use Cases",
                description: "Identifying and implementing strategic AI applications that deliver measurable business value."
              }
            ].map((skill, index) => (
              <div key={index} className="expertise-card reveal interactive" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="card-icon">{skill.icon}</div>
                <h3 className="card-title">{skill.title}</h3>
                <p className="card-description">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-container">
          <div className="section-header reveal">
            <h2 className="section-title">Services I Offer</h2>
            <p className="section-subtitle">
              Comprehensive AI solutions tailored to your business needs
            </p>
          </div>
          
          <div className="services-content">
            <div className="service-item reveal">
              <div className="service-visual parallax" data-speed="0.2">
                <img 
                  src="https://images.unsplash.com/photo-1573164574230-db1d5e960238"
                  alt="AI Consulting"
                  className="service-image"
                />
              </div>
              <div className="service-content">
                <h3 className="service-title">AI Strategy & Consulting</h3>
                <p className="service-description">
                  I help businesses identify the most impactful AI opportunities and develop comprehensive strategies for implementation. From initial assessment to full deployment, I guide you through every step of your AI transformation journey.
                </p>
                <div className="service-features">
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    AI Readiness Assessment
                  </div>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    Custom AI Solution Design
                  </div>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    Implementation Roadmap
                  </div>
                </div>
              </div>
            </div>
            
            <div className="service-item reveal">
              <div className="service-content">
                <h3 className="service-title">Content Creation & Automation</h3>
                <p className="service-description">
                  Leverage the power of generative AI to transform your content creation process. I specialize in building automated systems that produce high-quality images, videos, and written content at scale.
                </p>
                <div className="service-features">
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    AI-Powered Image Generation
                  </div>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    Automated Video Production
                  </div>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    Content Workflow Optimization
                  </div>
                </div>
              </div>
              <div className="service-visual parallax" data-speed="0.2">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                  alt="Content Creation"
                  className="service-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <div className="section-header reveal">
            <h2 className="section-title">What Clients Say</h2>
            <p className="section-subtitle">
              Hear from businesses that have transformed their operations with AI
            </p>
          </div>
          
          <div className="testimonials-grid">
            {[
              {
                name: "Sarah Mitchell",
                role: "Marketing Director, TechCorp",
                avatar: "SM",
                content: "Taichi helped us implement an AI-powered content creation system that increased our productivity by 300%. His expertise in generative AI is truly remarkable."
              },
              {
                name: "Michael Johnson",
                role: "CEO, InnovateLab",
                avatar: "MJ",
                content: "The AI workflow optimization Taichi designed for us saved over 20 hours per week. His strategic approach to AI implementation is exceptional."
              },
              {
                name: "Emily Chen",
                role: "CTO, DataFlow Solutions",
                avatar: "EC",
                content: "Working with Taichi was a game-changer. His AI coaching helped our team understand and leverage AI tools effectively. Highly recommended!"
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card reveal interactive" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <div className="section-header reveal">
            <h2 className="section-title">Let's Work Together</h2>
            <p className="section-subtitle">
              Ready to transform your business with AI? Let's discuss how I can help you achieve your goals.
            </p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info reveal">
              <div className="contact-item">
                <div className="contact-icon">
                  <span>✉️</span>
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>taichi@example.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <span>🌍</span>
                </div>
                <div className="contact-details">
                  <h4>Location</h4>
                  <p>Available globally (Remote)</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <span>⚡</span>
                </div>
                <div className="contact-details">
                  <h4>Response Time</h4>
                  <p>Within 24 hours</p>
                </div>
              </div>
              
              <div className="contact-visual">
                <img 
                  src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"
                  alt="AI Technology"
                  className="contact-image"
                />
              </div>
            </div>
            
            <div className="contact-form-container reveal">
              <div className="form-wrapper">
                <h3 className="form-title">Send a Message</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">Taichi</div>
            <p className="footer-description">
              AI Creator & AI Consultant - Transforming businesses through intelligent automation
            </p>
            <div className="footer-bottom">
              <p>© 2025 Taichi. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;