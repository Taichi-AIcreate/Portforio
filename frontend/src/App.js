import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from 'three';
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// 3D Background Scene Component
const AnimatedSphere = ({ position, scale, color }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
};

const ParticleField = () => {
  const pointsRef = useRef();
  const particleCount = 300;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#007AFF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const Scene3D = () => {
  return (
    <div className="three-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#5856D6" />
          
          <AnimatedSphere position={[-3, 2, -2]} scale={0.8} color="#007AFF" />
          <AnimatedSphere position={[3, -1, -3]} scale={1.2} color="#5856D6" />
          <AnimatedSphere position={[0, 3, -4]} scale={0.6} color="#34C759" />
          
          <ParticleField />
          
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Enhanced custom cursor component
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorPos = useRef({ x: 0, y: 0 });
  const cursorDotPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    const moveCursor = (e) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
    };

    const animateCursor = () => {
      if (cursor && cursorDot) {
        // Smooth cursor following with different speeds
        cursorDotPos.current.x += (cursorPos.current.x - cursorDotPos.current.x) * 0.25;
        cursorDotPos.current.y += (cursorPos.current.y - cursorDotPos.current.y) * 0.25;

        cursor.style.left = (cursorPos.current.x - 20) + 'px';
        cursor.style.top = (cursorPos.current.y - 20) + 'px';
        
        cursorDot.style.left = (cursorDotPos.current.x - 2) + 'px';
        cursorDot.style.top = (cursorDotPos.current.y - 2) + 'px';
      }
      
      requestAnimationFrame(animateCursor);
    };

    const handleMouseEnter = () => {
      cursor.classList.add('cursor-hover');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('cursor-hover');
    };

    const handleMouseDown = () => {
      cursor.classList.add('cursor-click');
    };

    const handleMouseUp = () => {
      cursor.classList.remove('cursor-click');
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    animateCursor();

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
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

// Enhanced magnetic button effect
const MagneticButton = ({ children, className, ...props }) => {
  const buttonRef = useRef(null);
  const magneticRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    let animationId;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      magneticRef.current = { x: x * 0.3, y: y * 0.3 };
    };

    const handleMouseLeave = () => {
      magneticRef.current = { x: 0, y: 0 };
    };

    const animate = () => {
      if (button) {
        button.style.transform = `translate(${magneticRef.current.x}px, ${magneticRef.current.y}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    if (button) {
      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);
      animate();
    }

    return () => {
      if (button) {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`}
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

function App() {
  useScrollReveal();

  return (
    <div className="app-container">
      <CustomCursor />
      <Scene3D />
      
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

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="glass-background"></div>
        <div className="hero-container">
          <div className="hero-content reveal">
            <div className="hero-badge glass-element">
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
                <span>View My Work</span>
                <div className="button-shine"></div>
              </MagneticButton>
              <MagneticButton className="secondary-button interactive">
                <span>Get In Touch</span>
                <div className="button-shine"></div>
              </MagneticButton>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-image-container glass-element">
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
        <div className="glass-background"></div>
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
              <div key={index} className="expertise-card glass-element reveal interactive" style={{animationDelay: `${index * 0.1}s`}}>
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
        <div className="glass-background"></div>
        <div className="section-container">
          <div className="section-header reveal">
            <h2 className="section-title">Services I Offer</h2>
            <p className="section-subtitle">
              Comprehensive AI solutions tailored to your business needs
            </p>
          </div>
          
          <div className="services-content">
            <div className="service-item reveal">
              <div className="service-visual">
                <div className="service-image-container glass-element">
                  <img 
                    src="https://images.unsplash.com/photo-1573164574230-db1d5e960238"
                    alt="AI Consulting"
                    className="service-image"
                  />
                </div>
              </div>
              <div className="service-content glass-element">
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
              <div className="service-content glass-element">
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
              <div className="service-visual">
                <div className="service-image-container glass-element">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                    alt="Content Creation"
                    className="service-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="glass-background"></div>
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
              <div key={index} className="testimonial-card glass-element reveal interactive" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar glass-element">{testimonial.avatar}</div>
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
        <div className="glass-background"></div>
        <div className="section-container">
          <div className="section-header reveal">
            <h2 className="section-title">Let's Work Together</h2>
            <p className="section-subtitle">
              Ready to transform your business with AI? Let's discuss how I can help you achieve your goals.
            </p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info reveal">
              <div className="contact-item glass-element">
                <div className="contact-icon">
                  <span>✉️</span>
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>taichi@example.com</p>
                </div>
              </div>
              
              <div className="contact-item glass-element">
                <div className="contact-icon">
                  <span>🌍</span>
                </div>
                <div className="contact-details">
                  <h4>Location</h4>
                  <p>Available globally (Remote)</p>
                </div>
              </div>
              
              <div className="contact-item glass-element">
                <div className="contact-icon">
                  <span>⚡</span>
                </div>
                <div className="contact-details">
                  <h4>Response Time</h4>
                  <p>Within 24 hours</p>
                </div>
              </div>
              
              <div className="contact-visual">
                <div className="contact-image-container glass-element">
                  <img 
                    src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"
                    alt="AI Technology"
                    className="contact-image"
                  />
                </div>
              </div>
            </div>
            
            <div className="contact-form-container glass-element reveal">
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
        <div className="glass-background"></div>
        <div className="footer-container">
          <div className="footer-content glass-element">
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