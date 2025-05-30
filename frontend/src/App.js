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
          お名前
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input interactive"
          placeholder="お名前をご入力ください"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          メールアドレス
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
          メッセージ
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="form-input interactive"
          placeholder="プロジェクトについて、またはお手伝いできることについてお聞かせください..."
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
            送信中...
          </span>
        ) : (
          'メッセージを送信'
        )}
      </MagneticButton>
      
      {submitStatus === 'success' && (
        <div className="success-message animate-reveal">
          <div className="checkmark"></div>
          ありがとうございます！メッセージが正常に送信されました。
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="error-message animate-reveal">
          申し訳ございません。エラーが発生しました。もう一度お試しください。
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
            <a href="#home" className="nav-link interactive">ホーム</a>
            <a href="#expertise" className="nav-link interactive">専門分野</a>
            <a href="#services" className="nav-link interactive">サービス</a>
            <a href="#testimonials" className="nav-link interactive">お客様の声</a>
            <a href="#contact" className="nav-link interactive">お問い合わせ</a>
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
              新しいプロジェクトを受付中
            </div>
            <h1 className="hero-title">
              <span className="hero-greeting">こんにちは、私は</span>
              <span className="hero-name">Taichi</span>
              <span className="hero-greeting-suffix">です</span>
            </h1>
            <div className="hero-subtitle">
              <p className="role-title">AIクリエイター・AIコンサルタント</p>
              <p className="role-description">
                インテリジェントオートメーションと最先端のAIソリューションで企業の変革をお手伝いします
              </p>
            </div>
            
            <div className="hero-actions">
              <MagneticButton className="primary-button interactive">
                <span>作品を見る</span>
                <div className="button-shine"></div>
              </MagneticButton>
              <MagneticButton className="secondary-button interactive">
                <span>お問い合わせ</span>
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
            <h2 className="section-title">私の専門分野</h2>
            <p className="section-subtitle">
              ビジネスの成長とイノベーションを推進するインテリジェントソリューションの創出を専門としています
            </p>
          </div>
          
          <div className="expertise-grid">
            {[
              {
                icon: "🧠",
                title: "生成AI",
                description: "コンテンツ制作、自動化、イノベーションのための最先端の生成AIソリューション開発における専門知識。"
              },
              {
                icon: "👨‍🏫",
                title: "AIコーチング",
                description: "チームや個人がAI技術をワークフローやビジネスプロセスに効果的に統合できるよう指導いたします。"
              },
              {
                icon: "⚡",
                title: "ワークフロー最適化",
                description: "AI駆動の自動化とインテリジェントなワークフロー設計により、ビジネスプロセスを合理化します。"
              },
              {
                icon: "🎨",
                title: "AI画像生成",
                description: "高度なAI画像生成ツールと技術を使用して、素晴らしいビジュアルコンテンツを制作します。"
              },
              {
                icon: "🎬",
                title: "AI動画制作",
                description: "AI駆動ツールと自動動画生成システムを通じて、魅力的な動画コンテンツを制作します。"
              },
              {
                icon: "💡",
                title: "AIユースケース",
                description: "測定可能なビジネス価値を提供する戦略的なAIアプリケーションの特定と実装を行います。"
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
            <h2 className="section-title">提供サービス</h2>
            <p className="section-subtitle">
              お客様のビジネスニーズに合わせたAIソリューションを包括的に提供いたします
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
                <h3 className="service-title">AI戦略・コンサルティング</h3>
                <p className="service-description">
                  最も影響力のあるAI機会を特定し、実装のための包括的な戦略を策定するお手伝いをいたします。初期評価から完全展開まで、AIトランスフォーメーションの全過程をガイドします。
                </p>
                <div className="service-features">
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    AI準備状況評価
                  </div>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    カスタムAIソリューション設計
                  </div>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    実装ロードマップ
                  </div>
                </div>
              </div>
            </div>
            
            <div className="service-item reveal">
              <div className="service-content glass-element">
                <h3 className="service-title">コンテンツ制作・自動化</h3>
                <p className="service-description">
                  生成AIの力を活用してコンテンツ制作プロセスを変革します。高品質な画像、動画、文章コンテンツを大規模に生産する自動化システムの構築を専門としています。
                </p>
                <div className="service-features">
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    AI駆動画像生成
                  </div>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    自動動画制作
                  </div>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    コンテンツワークフロー最適化
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
            <h2 className="section-title">お客様の声</h2>
            <p className="section-subtitle">
              AIで事業運営を変革された企業様からのお声をお聞きください
            </p>
          </div>
          
          <div className="testimonials-grid">
            {[
              {
                name: "Sarah Mitchell",
                role: "マーケティングディレクター, TechCorp",
                avatar: "SM",
                content: "Taichiさんのおかげで、AI駆動のコンテンツ制作システムを導入し、生産性が300%向上しました。生成AIに関する彼の専門知識は本当に素晴らしいです。"
              },
              {
                name: "Michael Johnson",
                role: "CEO, InnovateLab",
                avatar: "MJ",
                content: "Taichiさんが設計したAIワークフロー最適化により、週20時間以上の時間を節約できました。AI実装への彼の戦略的アプローチは卓越しています。"
              },
              {
                name: "Emily Chen",
                role: "CTO, DataFlow Solutions",
                avatar: "EC",
                content: "Taichiさんとの協働はゲームチェンジャーでした。彼のAIコーチングにより、チームがAIツールを効果的に理解し活用できるようになりました。強くお勧めします！"
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
            <h2 className="section-title">一緒に働きませんか</h2>
            <p className="section-subtitle">
              AIでビジネスを変革する準備はできていますか？目標達成のお手伝いについてお話しましょう。
            </p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info reveal">
              <div className="contact-item glass-element">
                <div className="contact-icon">
                  <span>✉️</span>
                </div>
                <div className="contact-details">
                  <h4>メール</h4>
                  <p>taichi@example.com</p>
                </div>
              </div>
              
              <div className="contact-item glass-element">
                <div className="contact-icon">
                  <span>🌍</span>
                </div>
                <div className="contact-details">
                  <h4>所在地</h4>
                  <p>世界中どこでも対応（リモート）</p>
                </div>
              </div>
              
              <div className="contact-item glass-element">
                <div className="contact-icon">
                  <span>⚡</span>
                </div>
                <div className="contact-details">
                  <h4>返信時間</h4>
                  <p>24時間以内</p>
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
                <h3 className="form-title">メッセージを送信</h3>
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
              AIクリエイター・AIコンサルタント - インテリジェントオートメーションで企業を変革
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