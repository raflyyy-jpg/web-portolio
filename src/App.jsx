import { useState, useEffect, useRef } from 'react';

// ============================================================
// GLOBAL STYLES
// ============================================================
function GlobalStyles() {
  return (
    <style>{`
      @property --angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }

      html { scroll-behavior: smooth; background: #030712; }
      body { background: #030712; background-image: none; }
      #root { background: #030712; }
      section { scroll-margin-top: 100px; }

      @keyframes blink { 50% { opacity: 0; } }
      @keyframes eq { from { height: 4px; } to { height: 14px; } }
      @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes pulseGlow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
      @keyframes twinkleStars { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
      @keyframes earthRotate {
        from { background-position: 0% center; }
        to { background-position: -200% center; }
      }
      @keyframes atmospherePulse {
        0%, 100% {
          box-shadow: inset 0 0 60px rgba(96, 165, 250, 0.2);
          opacity: 0.8;
        }
        50% {
          box-shadow: inset 0 0 100px rgba(96, 165, 250, 0.4);
          opacity: 1;
        }
      }
      @keyframes rotateBorder { to { --angle: 360deg; } }
      @keyframes iconFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      @keyframes astronautFloat {
        0%, 100% { transform: translate(0, 0) rotate(-4deg); }
        50% { transform: translate(15px, -25px) rotate(4deg); }
      }

      @media (max-width: 640px) {
        .navbar-mobile {
          padding: 8px 16px !important;
          gap: 14px !important;
          top: 12px !important;
          max-width: 95vw !important;
        }
        .navbar-mobile a {
          font-size: 0.72rem !important;
        }

        .astronaut-wrapper,
        .astronaut-glow {
          transform: scale(0.5) !important;
          transform-origin: top right !important;
          right: -2% !important;
          top: 5% !important;
          opacity: 0.6 !important;
        }

        .hero-section {
          padding: 100px 16px 40px 16px !important;
        }

        .hero-flex {
          flex-direction: column !important;
          align-items: center !important;
          gap: 32px !important;
        }

        .hero-left {
          text-align: center !important;
          width: 100% !important;
        }
        .hero-left .hero-badge-wrap {
          display: flex !important;
          justify-content: center !important;
        }
        .hero-cta {
          justify-content: center !important;
        }
        .hero-title {
          font-size: 1.85rem !important;
        }
        .hero-subtitle {
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .about-flex {
          flex-direction: column !important;
          text-align: center !important;
        }
        .about-text {
          text-align: center !important;
        }
        .about-text .about-resume-wrap {
          display: flex !important;
          justify-content: center !important;
        }

        .portfolio-tabs {
          padding: 4px !important;
          gap: 4px !important;
          max-width: 95vw !important;
        }
        .portfolio-tabs button {
          padding: 8px 12px !important;
          font-size: 0.7rem !important;
        }
      }

      @media (max-width: 400px) {
        .navbar-mobile {
          padding: 6px 12px !important;
          gap: 10px !important;
        }
        .navbar-mobile a {
          font-size: 0.65rem !important;
        }
        .hero-title {
          font-size: 1.55rem !important;
        }
        .portfolio-tabs button {
          padding: 6px 9px !important;
          font-size: 0.65rem !important;
        }
        .astronaut-wrapper,
        .astronaut-glow {
          transform: scale(0.4) !important;
        }
      }
    `}</style>
  );
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function ScrollReveal({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(35px) scale(0.96)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// SCROLL PROGRESS
// ============================================================
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setW(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${w}%`,
        zIndex: 100,
        background: 'linear-gradient(to right, #3b82f6, #a855f7, #ec4899)',
        boxShadow: '0 0 12px #3b82f6',
        transition: 'width 0.1s linear',
        willChange: 'width',
      }}
    />
  );
}

// ============================================================
// STARFIELD
// ============================================================
function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = document.documentElement.clientWidth);
    let height = (canvas.height = document.documentElement.clientHeight);

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.012 + 0.004,
    }));

    const shootingStars = [];
    let lastShoot = 0;

    const spawnShootingStar = () => {
      const startX = Math.random() * width * 0.6 + width * 0.2;
      const startY = Math.random() * height * 0.3;
      const angle = Math.PI / 5 + (Math.random() * 0.25 - 0.125);
      const speed = Math.random() * 5 + 9;
      const length = Math.random() * 140 + 120;

      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length,
        life: 1,
        decay: 0.008 + Math.random() * 0.005,
        width: Math.random() * 1.4 + 1.2,
        color: Math.random() > 0.5 ? '160, 200, 255' : '200, 180, 255',
      });
    };

    const resize = () => {
      width = canvas.width = document.documentElement.clientWidth;
      height = canvas.height = document.documentElement.clientHeight;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };
    window.addEventListener('resize', resize);

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      frame++;
      if (frame - lastShoot > 90 + Math.random() * 140) {
        spawnShootingStar();
        lastShoot = frame;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;

        if (s.life <= 0 || s.x > width + 100 || s.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        const angle = Math.atan2(s.vy, s.vx);
        const tailX = s.x - Math.cos(angle) * s.length;
        const tailY = s.y - Math.sin(angle) * s.length;

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(${s.color}, ${s.life})`);
        grad.addColorStop(0.4, `rgba(${s.color}, ${s.life * 0.35})`);
        grad.addColorStop(1, `rgba(${s.color}, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 10);
        headGrad.addColorStop(0, `rgba(255, 255, 255, ${s.life})`);
        headGrad.addColorStop(0.5, `rgba(${s.color}, ${s.life * 0.7})`);
        headGrad.addColorStop(1, `rgba(${s.color}, 0)`);
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          display: 'block',
          margin: 0,
          padding: 0,
        }}
      />

      <div
        className="astronaut-wrapper"
        style={{
          position: 'fixed',
          top: '12%',
          right: '5%',
          zIndex: 2,
          pointerEvents: 'none',
          animation: 'astronautFloat 8s ease-in-out infinite',
        }}
      >
        <svg width="110" height="110" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="38" width="40" height="40" rx="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
          <rect x="36" y="44" width="28" height="28" rx="4" fill="#94a3b8" />
          <path d="M 30 48 L 20 52 L 20 68 L 28 70" stroke="#64748b" strokeWidth="2" fill="none" />
          <path d="M 70 48 L 80 52 L 80 68 L 72 70" stroke="#64748b" strokeWidth="2" fill="none" />
          <ellipse cx="50" cy="58" rx="18" ry="16" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
          <ellipse cx="50" cy="58" rx="12" ry="10" fill="#e2e8f0" />
          <rect x="44" y="52" width="12" height="8" rx="2" fill="#1e293b" />
          <circle cx="47" cy="56" r="1" fill="#4ade80" />
          <circle cx="50" cy="56" r="1" fill="#fbbf24" />
          <circle cx="53" cy="56" r="1" fill="#ef4444" />
          <circle cx="50" cy="32" r="20" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <ellipse cx="50" cy="32" rx="14" ry="13" fill="#1e293b" />
          <ellipse cx="50" cy="32" rx="14" ry="13" fill="url(#visorGlow)" />
          <ellipse cx="46" cy="28" rx="5" ry="4" fill="rgba(147, 197, 253, 0.7)" />
          <ellipse cx="44" cy="26" rx="2" ry="1.5" fill="rgba(255, 255, 255, 0.9)" />
          <line x1="50" y1="12" x2="50" y2="6" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="50" cy="5" r="2" fill="#ef4444">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <path d="M 32 55 Q 20 58 18 70" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 32 55 Q 20 58 18 70" stroke="#64748b" strokeWidth="1" strokeLinecap="round" fill="none" />
          <circle cx="18" cy="70" r="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <path d="M 68 55 Q 80 58 82 70" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 68 55 Q 80 58 82 70" stroke="#64748b" strokeWidth="1" strokeLinecap="round" fill="none" />
          <circle cx="82" cy="70" r="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <rect x="40" y="72" width="8" height="14" rx="3" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
          <rect x="52" y="72" width="8" height="14" rx="3" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
          <rect x="38" y="84" width="12" height="4" rx="2" fill="#94a3b8" />
          <rect x="50" y="84" width="12" height="4" rx="2" fill="#94a3b8" />
          <defs>
            <radialGradient id="visorGlow" cx="40%" cy="35%">
              <stop offset="0%" stopColor="rgba(96, 165, 250, 0.6)" />
              <stop offset="70%" stopColor="rgba(30, 58, 138, 0.3)" />
              <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div
        className="astronaut-glow"
        style={{
          position: 'fixed',
          top: '12%',
          right: '5%',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(96, 165, 250, 0.25), rgba(96, 165, 250, 0.08) 40%, transparent 70%)',
          zIndex: 1,
          pointerEvents: 'none',
          animation: 'astronautFloat 8s ease-in-out infinite',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
    </>
  );
}

// ============================================================
// LOADING SCREEN
// ============================================================
function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (phase < 3) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(() => onComplete(), 900);
          return 100;
        }
        const step = prev < 30 ? 1 : prev < 70 ? 2 : prev < 90 ? 1 : 3;
        return Math.min(prev + step, 100);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#020617',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.9s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 32% 62%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1.5px 1.5px at 55% 25%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 78% 72%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 25% 85%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1.5px 1.5px at 68% 15%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 88% 38%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 45% 90%, rgba(255,255,255,0.5), transparent)
          `,
          pointerEvents: 'none',
          animation: 'twinkleStars 4s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: phase === 0 ? 'min(140vw, 140vh)' : 'min(60vw, 60vh)',
          height: phase === 0 ? 'min(140vw, 140vh)' : 'min(60vw, 60vh)',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          overflow: 'hidden',
          zIndex: 1,
          transition: 'width 1.6s cubic-bezier(0.16, 1, 0.3, 1), height 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: `
            0 0 100px rgba(59, 130, 246, 0.7),
            0 0 200px rgba(37, 99, 235, 0.4),
            0 0 300px rgba(29, 78, 216, 0.2)
          `,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/earth.jpg)',
            backgroundSize: '200% 100%',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: '0% center',
            animation: 'earthRotate 25s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.45) 0%, rgba(147, 197, 253, 0.15) 25%, transparent 50%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 78% 78%, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 30%, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            boxShadow: `inset 0 0 120px rgba(96, 165, 250, 0.4), inset -30px -30px 100px rgba(0, 0, 0, 0.75)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(85vw, 85vh)',
          height: 'min(85vw, 85vh)',
          transform: 'translate(-50%, -50%) rotate(-20deg)',
          borderRadius: '50%',
          border: '1px dashed rgba(96, 165, 250, 0.35)',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1s ease',
          animation: 'spinSlow 30s linear infinite',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(72vw, 72vh)',
          height: 'min(72vw, 72vh)',
          transform: 'translate(-50%, -50%) rotate(15deg)',
          borderRadius: '50%',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1s ease',
          animation: 'spinSlow 25s linear infinite reverse',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(2, 6, 23, 0.75) 0%, rgba(2, 6, 23, 0.3) 35%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 24px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(96, 165, 250, 0.4)',
            borderRadius: '9999px',
            marginBottom: '24px',
            backdropFilter: 'blur(10px)',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            boxShadow: '0 0 30px rgba(96, 165, 250, 0.3)',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#60a5fa',
              boxShadow: '0 0 12px #60a5fa',
              animation: 'pulseGlow 1.5s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.68rem',
              color: '#93c5fd',
              fontFamily: 'monospace',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Initializing Experience
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
            fontWeight: '900',
            lineHeight: '1.15',
            marginBottom: '14px',
            background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(96, 165, 250, 0.7))',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
            letterSpacing: phase >= 2 ? '0.02em' : '0.3em',
            transition:
              'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1), letter-spacing 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          Muhamad Rafly
        </h1>

        <p
          style={{
            fontSize: '0.78rem',
            color: '#94a3b8',
            letterSpacing: '0.4em',
            marginBottom: '40px',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
          }}
        >
          Portofolio
        </p>

        <div
          style={{
            width: '100%',
            maxWidth: '340px',
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '3px',
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              borderRadius: '9999px',
              overflow: 'hidden',
              marginBottom: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(to right, #3b82f6, #60a5fa, #a855f7)',
                borderRadius: '9999px',
                transition: 'width 0.15s ease-out',
                boxShadow: '0 0 15px #60a5fa',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '0.68rem',
              color: '#64748b',
              fontFamily: 'monospace',
              letterSpacing: '0.18em',
            }}
          >
            <span>EARTH · ORBIT</span>
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SPIDEY MORPH
// ============================================================
function SpideyMouseMorph() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="spidey-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '300px',
        height: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: isHovered
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.45) 0%, rgba(59, 130, 246, 0.2) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          transition: 'all 0.5s ease',
          zIndex: 0,
        }}
      />
      <img
        src="/raflyganteng.png"
        alt="Muhamad Rafly"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          zIndex: 1,
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? 'scale(0.95)' : 'scale(1)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      />
      <img
        src="/spider-man.png"
        alt="Spider-Man Avatar"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          zIndex: 2,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1)' : 'scale(1.05)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      />
    </div>
  );
}

// ============================================================
// MAGNETIC BUTTON
// ============================================================
function MagneticButton({ children, style, as = 'a', ...props }) {
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setT({ x: x * 0.25, y: y * 0.25 });
  };

  const Comp = as;
  return (
    <Comp
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      style={{
        ...style,
        transform: `translate(${t.x}px, ${t.y}px)`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

// ============================================================
// TYPEWRITER
// ============================================================
function Typewriter({ text, speed = 60, delay = 800 }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    let id;
    const t = setTimeout(() => {
      id = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(id);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(t);
      if (id) clearInterval(id);
    };
  }, [text, speed, delay]);
  return (
    <>
      {shown}
      <span
        style={{
          display: 'inline-block',
          width: '3px',
          height: '1em',
          backgroundColor: '#60a5fa',
          marginLeft: '4px',
          animation: 'blink 1s steps(1) infinite',
          verticalAlign: 'middle',
        }}
      />
    </>
  );
}

// ============================================================
// COUNT UP
// ============================================================
function CountUp({ end, duration = 1500 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            setN(Math.floor(end * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{n}</span>;
}

// ============================================================
// SECTION DIVIDER
// ============================================================
function SectionDivider() {
  return (
    <div
      style={{
        height: '1px',
        maxWidth: '600px',
        margin: '20px auto',
        background: 'linear-gradient(to right, transparent, rgba(96,165,250,0.6), transparent)',
      }}
    />
  );
}

// ============================================================
// CUSTOM SPOTIFY PLAYER
// ============================================================
function CustomSpotifyPlayer() {
  // 🎵 Track 1 (Reminder) pakai gambar asli.
  // Track lainnya fallback ke gradient + emoji.
  const tracks = [
    {
      title: 'Reminder',
      artist: 'The Weeknd',
      duration: '3:42',
      image: '/reminder.jpg',  // 👈 GANTI kalau nama file beda
      cover: 'linear-gradient(135deg, #dc2626, #7f1d1d)',
      emoji: '🎤',
    },
    {
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      duration: '3:20',
      cover: 'linear-gradient(135deg, #f59e0b, #b45309)',
      emoji: '🌃',
    },
    {
      title: 'Save Your Tears',
      artist: 'The Weeknd',
      duration: '3:35',
      cover: 'linear-gradient(135deg, #06b6d4, #0e7490)',
      emoji: '💧',
    },
    {
      title: 'Starboy',
      artist: 'The Weeknd',
      duration: '3:50',
      cover: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      emoji: '⭐',
    },
  ];

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentTrack((t) => (t + 1) % tracks.length);
          return 0;
        }
        return prev + 0.5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying, tracks.length]);

  const track = tracks[currentTrack];

  const handleNext = () => {
    setCurrentTrack((t) => (t + 1) % tracks.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrack((t) => (t - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '20px',
        padding: '1.5px',
        background:
          'linear-gradient(135deg, rgba(96, 165, 250, 0.5), rgba(168, 85, 247, 0.3), rgba(96, 165, 250, 0.15))',
        boxShadow: '0 25px 60px -20px rgba(59, 130, 246, 0.6)',
      }}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: 'rgba(10, 15, 28, 0.98)',
          borderRadius: '19px',
          padding: '20px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', margin: 0 }}>
              Daily Rotation
            </h3>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 7px',
                borderRadius: '9999px',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontSize: '0.6rem',
                color: '#4ade80',
                fontWeight: '700',
                letterSpacing: '0.05em',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#4ade80',
                  boxShadow: '0 0 6px #4ade80',
                  animation: 'pulseGlow 1.5s ease-in-out infinite',
                }}
              />
              LIVE
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
            A curated collection of tracks that keep me in the zone.
          </p>
        </div>

        {/* ===== NOW PLAYING ===== */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(168, 85, 247, 0.05))',
            border: '1px solid rgba(96, 165, 250, 0.2)',
            borderRadius: '14px',
            padding: '14px',
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            marginBottom: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* COVER ART — pakai image kalau ada, fallback ke gradient + emoji */}
          <div
            style={{
              position: 'relative',
              width: '72px',
              height: '72px',
              flexShrink: 0,
              borderRadius: '10px',
              background: track.cover,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 8px 24px -8px rgba(96, 165, 250, 0.6)',
              overflow: 'hidden',
              border: '1px solid rgba(96, 165, 250, 0.3)',
            }}
          >
            {/* Emoji fallback di belakang */}
            <span
              style={{
                position: 'absolute',
                zIndex: 0,
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))',
              }}
            >
              {track.emoji}
            </span>

            {/* Gambar di atas emoji (kalau ada) */}
            {track.image && (
              <img
                src={track.image}
                alt={track.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1,
                }}
                onError={(e) => {
                  // Kalau gambar gagal load → fallback ke emoji
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}

            {isPlaying && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '10px',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  animation: 'pulseGlow 1.5s ease-in-out infinite',
                  zIndex: 2,
                }}
              />
            )}
          </div>

          {/* Info + progress */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: '0.62rem',
                color: '#60a5fa',
                margin: 0,
                marginBottom: '2px',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: '700',
              }}
            >
              {isPlaying ? '▶ Now Playing' : '⏸ Paused'}
            </p>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: '800',
                color: '#fff',
                margin: 0,
                marginBottom: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {track.title}
            </h4>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, marginBottom: '8px' }}>
              {track.artist}
            </p>

            <div
              style={{
                width: '100%',
                height: '3px',
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderRadius: '9999px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, #3b82f6, #60a5fa, #a855f7)',
                  borderRadius: '9999px',
                  transition: 'width 0.2s linear',
                  boxShadow: '0 0 8px #60a5fa',
                }}
              />
            </div>
          </div>
        </div>

        {/* ===== CONTROLS ===== */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '16px',
          }}
        >
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              fontSize: '1rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            title="Shuffle"
          >
            🔀
          </button>
          <button
            onClick={handlePrev}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#e2e8f0',
              cursor: 'pointer',
              padding: '6px',
              fontSize: '1.3rem',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Previous"
          >
            ⏮
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1, #a855f7)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              boxShadow: '0 8px 24px -8px rgba(96, 165, 250, 0.8)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={handleNext}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#e2e8f0',
              cursor: 'pointer',
              padding: '6px',
              fontSize: '1.3rem',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Next"
          >
            ⏭
          </button>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              fontSize: '1rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            title="Repeat"
          >
            🔁
          </button>
        </div>

        {/* ===== UP NEXT ===== */}
        <div>
          <p
            style={{
              fontSize: '0.62rem',
              color: '#64748b',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: '8px',
              fontWeight: '700',
            }}
          >
            ── Up Next
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tracks.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentTrack(idx);
                  setProgress(0);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  background: idx === currentTrack ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (idx !== currentTrack) {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (idx !== currentTrack) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span
                  style={{
                    width: '20px',
                    fontSize: '0.72rem',
                    color: idx === currentTrack ? '#60a5fa' : '#64748b',
                    fontWeight: '700',
                    fontFamily: "'JetBrains Mono', monospace",
                    flexShrink: 0,
                    textAlign: 'center',
                  }}
                >
                  {idx === currentTrack && isPlaying ? '♪' : String(idx + 1).padStart(2, '0')}
                </span>
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      color: idx === currentTrack ? '#60a5fa' : '#e2e8f0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t.title}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t.artist}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#64748b',
                    fontFamily: "'JetBrains Mono', monospace",
                    flexShrink: 0,
                  }}
                >
                  {t.duration}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(96, 165, 250, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.62rem',
            color: '#64748b',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.1em',
          }}
        >
          <span>POWERED BY SPOTIFY</span>
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#1DB954',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ● OPEN SPOTIFY →
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CARD 3D
// ============================================================
function Card3D({ children, style = {}, glowColor = '96, 165, 250' }) {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateX = ((mouseY - height / 2) / (height / 2)) * -6;
    const rotateY = ((mouseX - width / 2) / (width / 2)) * 6;

    setRotate({ x: rotateX, y: rotateY });
    setGlow({ x: (mouseX / width) * 100, y: (mouseY / height) * 100, opacity: 1 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlow((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        perspective: '1000px',
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: '20px',
          padding: '1.5px',
          overflow: 'hidden',
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: isHovered
            ? 'transform 0.15s ease-out, box-shadow 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
          boxShadow: isHovered
            ? `0 20px 40px -15px rgba(${glowColor}, 0.55), 0 0 0 1px rgba(${glowColor}, 0.4)`
            : '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
          willChange: 'transform',
          background: 'rgba(15, 23, 42, 0.6)',
        }}
      >
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              inset: '-100%',
              background: `conic-gradient(from 0deg, transparent 0%, rgba(${glowColor}, 1) 15%, rgba(168, 85, 247, 1) 25%, transparent 40%, transparent 60%, rgba(${glowColor}, 1) 75%, rgba(168, 85, 247, 1) 85%, transparent 100%)`,
              animation: 'spinSlow 3s linear infinite',
              willChange: 'transform',
            }}
          />
        )}

        {!isHovered && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `rgba(${glowColor}, 0.28)`,
            }}
          />
        )}

        <div
          style={{
            position: 'relative',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderRadius: '19px',
            padding: '24px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `radial-gradient(circle 200px at ${glow.x}% ${glow.y}%, rgba(${glowColor}, 0.18), transparent 80%)`,
              opacity: glow.opacity,
              transition: 'opacity 0.3s ease',
              zIndex: 1,
            }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ABOUT SECTION
// ============================================================
function AboutSection() {
  return (
    <section
      id="about"
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        padding: '120px 24px 80px 24px',
        maxWidth: '1100px',
        margin: '0 auto',
        background: 'transparent',
      }}
    >
      <SectionDivider />
      <ScrollReveal>
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '48px',
            color: '#ffffff',
            textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          }}
        >
          About Me
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <div
          className="about-flex"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            marginBottom: '60px',
          }}
        >
          <SpideyMouseMorph />
          <div className="about-text" style={{ flex: '1 1 400px', minWidth: 0, maxWidth: '550px', textAlign: 'left' }}>
            <h3
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                fontWeight: '800',
                color: '#fff',
                marginBottom: '20px',
                lineHeight: '1.25',
                letterSpacing: '-0.01em',
              }}
            >
              Hi, I'm
              <br />
              <span
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(to right, #60a5fa, #a5b4fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginTop: '6px',
                  lineHeight: '1.2',
                }}
              >
                Muhamad Rafly
                <br />
                Ramadhani
              </span>
            </h3>
            <p
              style={{
                color: '#94a3b8',
                lineHeight: '1.8',
                fontSize: '0.95rem',
                marginBottom: '28px',
                maxWidth: '540px',
              }}
            >
              Sebagai mahasiswa Teknologi Informasi Universitas Bina Sarana Informatika, aku berfokus pada pengembangan teknologi web dan aplikasi yang tidak hanya fungsional, tetapi juga menghadirkan pengalaman digital yang menarik dan berdampak.
            </p>
            <div className="about-resume-wrap">
              <MagneticButton
                href="#resume"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  backgroundColor: '#1d4ed8',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 20px rgba(29, 78, 216, 0.4)',
                }}
              >
                <span>👁️</span> View Resume
              </MagneticButton>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            marginBottom: '40px',
            textAlign: 'left',
          }}
        >
          <Card3D glowColor="96, 165, 250">
            <h4
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: '#60a5fa' }}>❖</span> Education
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                { icon: '🎓', title: 'Universitas Bina Sarana Informatika', sub: 'Teknologi Informasi • GPA 3.43' },
                { icon: '🏫', title: 'SMK Teknik Komputer & Jaringan', sub: 'Teknik Komputer dan Jaringan' },
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(51, 65, 85, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      flexShrink: 0,
                    }}
                  >
                    {it.icon}
                  </div>
                  <div>
                    <h5 style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#fff', margin: 0 }}>{it.title}</h5>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0 0' }}>{it.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card3D>

          <Card3D glowColor="168, 85, 247">
            <h4
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: '#a855f7' }}>❖</span> Experience & Certification
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                { icon: '📡', title: 'MTCNA Certified', sub: 'MikroTik Certified Network Associate' },
                { icon: '💻', title: 'Magangku Developer', sub: 'Front-End & UI Design Lead' },
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(51, 65, 85, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      flexShrink: 0,
                    }}
                  >
                    {it.icon}
                  </div>
                  <div>
                    <h5 style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#fff', margin: 0 }}>{it.title}</h5>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0 0' }}>{it.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card3D>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={450}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
          {[
            { number: 2, label: 'PROJECTS', sub: 'Innovative solutions crafted', color: '96, 165, 250' },
            { number: 3, label: 'CERTIFICATES', sub: 'Skills validated', color: '168, 85, 247' },
            { number: 5, label: 'TECH STACK', sub: 'Tools mastered', color: '234, 179, 8' },
          ].map((stat, idx) => (
            <Card3D key={idx} glowColor={stat.color} style={{ textAlign: 'center' }}>
              <div
                className="stat-number"
                style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: `rgb(${stat.color})`,
                  lineHeight: '1',
                }}
              >
                <CountUp end={stat.number} />
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginTop: '8px',
                  letterSpacing: '0.08em',
                }}
              >
                {stat.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>{stat.sub}</div>
            </Card3D>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}

// ============================================================
// PORTFOLIO SECTION
// ============================================================
function PortfolioSection() {
  const [activeTab, setActiveTab] = useState('projects');

  const projects = [
    {
      title: 'VisionAssistant OCR Pro',
      desc: 'Aplikasi desktop computer vision & ekstraksi teks real-time berbasis Python, OpenCV, dan PyTesseract.',
      img: '🖼️',
      tech: ['Python', 'OpenCV', 'PyTesseract'],
    },
    {
      title: 'Absensi Gesture Tangan',
      desc: 'Sistem absensi otomatis menggunakan deteksi gesture tangan real-time berbasis Computer Vision dan Machine Learning.',
      img: '✋',
      tech: ['Python', 'OpenCV', 'MediaPipe'],
    },
  ];

  const certificates = [
    { title: 'MikroTik Certified Network Associate (MTCNA)', issuer: 'MikroTik', year: '2026' },
    { title: 'Sertifikasi Network Madya Berbasis Cisco', issuer: 'Cisco Networking Academy', year: '2025' },
    { title: 'TOEFL Prediction Test', issuer: 'English Proficiency Test', year: '2025' },
  ];

  const techStack = [
    { name: 'HTML5', color: '#e34f26' },
    { name: 'CSS3', color: '#1572b6' },
    { name: 'JavaScript', color: '#f7df1e' },
    { name: 'ReactJS', color: '#61dafb' },
    { name: 'Laravel', color: '#ff2d20' },
  ];

  return (
    <section
      id="portfolio"
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        padding: '100px 24px',
        maxWidth: '1100px',
        margin: '0 auto',
        textAlign: 'center',
        background: 'transparent',
      }}
    >
      <SectionDivider />
      <ScrollReveal>
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            marginBottom: '32px',
            color: '#ffffff',
            textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          }}
        >
          Portofolio
        </h2>

        <div
          className="portfolio-tabs"
          style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(51, 65, 85, 0.8)',
            borderRadius: '16px',
            padding: '6px',
            marginBottom: '40px',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { id: 'projects', label: 'Projects', icon: '💻' },
            { id: 'certificates', label: 'Certificates', icon: '📜' },
            { id: 'tech', label: 'Tech Stack', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: activeTab === tab.id ? '#1d4ed8' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        {activeTab === 'projects' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              textAlign: 'left',
            }}
          >
            {projects.map((item, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  padding: '1.5px',
                  background: `conic-gradient(
                    from var(--angle, 0deg),
                    rgba(96, 165, 250, 0) 0%,
                    rgba(96, 165, 250, 1) 15%,
                    rgba(168, 85, 247, 1) 25%,
                    rgba(96, 165, 250, 0.4) 40%,
                    rgba(96, 165, 250, 0) 50%,
                    rgba(96, 165, 250, 0) 60%,
                    rgba(168, 85, 247, 0.8) 75%,
                    rgba(96, 165, 250, 1) 85%,
                    rgba(96, 165, 250, 0) 100%
                  )`,
                  animation: 'rotateBorder 4s linear infinite',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                  boxShadow: '0 20px 50px -20px rgba(59, 130, 246, 0.5)',
                  cursor: 'pointer',
                  willChange: 'transform, box-shadow',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow =
                    '0 35px 70px -20px rgba(59, 130, 246, 0.9), 0 0 60px -20px rgba(168, 85, 247, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 50px -20px rgba(59, 130, 246, 0.5)';
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    backgroundColor: 'rgba(10, 15, 28, 0.98)',
                    borderRadius: '23px',
                    padding: '24px',
                    overflow: 'hidden',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage:
                        'linear-gradient(rgba(96, 165, 250, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(96, 165, 250, 0.06) 1px, transparent 1px)',
                      backgroundSize: '32px 32px',
                      maskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 70%)',
                      WebkitMaskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: '-30%',
                      right: '-30%',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(96, 165, 250, 0.35), transparent 70%)',
                      filter: 'blur(40px)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div
                    className="project-index"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '18px',
                      fontSize: '5rem',
                      fontWeight: '900',
                      lineHeight: 1,
                      background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.25), rgba(168, 85, 247, 0.08))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: 'monospace',
                      letterSpacing: '-0.05em',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '150px',
                      borderRadius: '18px',
                      background: 'radial-gradient(circle at 50% 30%, rgba(96, 165, 250, 0.18), rgba(15, 23, 42, 0.6) 70%)',
                      border: '1px solid rgba(96, 165, 250, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 20px -10px rgba(96, 165, 250, 0.4)',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(rgba(96, 165, 250, 0.5) 1px, transparent 1px)',
                        backgroundSize: '14px 14px',
                        opacity: 0.35,
                        maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        border: '1px dashed rgba(96, 165, 250, 0.4)',
                        animation: 'spinSlow 20s linear infinite',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                      }}
                    />
                    <span
                      className="project-emoji"
                      style={{
                        position: 'relative',
                        fontSize: '4.5rem',
                        lineHeight: 1,
                        filter: 'drop-shadow(0 0 30px rgba(96, 165, 250, 0.9)) drop-shadow(0 0 60px rgba(168, 85, 247, 0.5))',
                        animation: 'iconFloat 3s ease-in-out infinite',
                        zIndex: 2,
                      }}
                    >
                      {item.img}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                    {item.title}
                  </h3>

                  <div
                    style={{
                      width: '40px',
                      height: '2px',
                      background: 'linear-gradient(to right, #60a5fa, #a855f7, transparent)',
                      borderRadius: '2px',
                      marginBottom: '14px',
                      boxShadow: '0 0 10px rgba(96, 165, 250, 0.7)',
                    }}
                  />

                  <p style={{ color: '#94a3b8', fontSize: '0.83rem', lineHeight: '1.65', marginBottom: '18px' }}>
                    {item.desc}
                  </p>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {item.tech.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '5px 10px',
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(168, 85, 247, 0.08))',
                          borderRadius: '6px',
                          color: '#93c5fd',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          border: '1px solid rgba(96, 165, 250, 0.28)',
                          letterSpacing: '0.02em',
                          fontFamily: 'monospace',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: '#60a5fa',
                            boxShadow: '0 0 6px #60a5fa',
                          }}
                        />
                        {t}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      paddingTop: '14px',
                      borderTop: '1px solid rgba(96, 165, 250, 0.15)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: '#64748b',
                        fontFamily: 'monospace',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Project {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#60a5fa',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      View Detail
                      <span style={{ fontSize: '0.9rem' }}>→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              textAlign: 'left',
            }}
          >
            {certificates.map((cert, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  padding: '1.5px',
                  background: `linear-gradient(135deg, rgba(96, 165, 250, 0.6), rgba(168, 85, 247, 0.4), rgba(96, 165, 250, 0.15))`,
                  boxShadow: '0 20px 45px -20px rgba(59, 130, 246, 0.5)',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow =
                    '0 30px 60px -20px rgba(59, 130, 246, 0.8), 0 0 40px -15px rgba(168, 85, 247, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 45px -20px rgba(59, 130, 246, 0.5)';
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    backgroundColor: 'rgba(10, 15, 28, 0.98)',
                    borderRadius: '19px',
                    padding: '24px 24px 24px 32px',
                    overflow: 'hidden',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: '4px',
                      background: 'linear-gradient(to bottom, #60a5fa, #a855f7, #ec4899)',
                      boxShadow: '0 0 15px rgba(96, 165, 250, 0.8)',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'radial-gradient(rgba(96, 165, 250, 0.1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      opacity: 0.5,
                      maskImage: 'radial-gradient(circle at top right, black 20%, transparent 75%)',
                      WebkitMaskImage: 'radial-gradient(circle at top right, black 20%, transparent 75%)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: '-25%',
                      right: '-25%',
                      width: '180px',
                      height: '180px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(96, 165, 250, 0.3), transparent 70%)',
                      filter: 'blur(35px)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '18px',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.25), rgba(168, 85, 247, 0.15))',
                        border: '1px solid rgba(96, 165, 250, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.7rem',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px -8px rgba(96, 165, 250, 0.5)',
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.8))' }}>📜</span>
                    </div>

                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: 'rgba(96, 165, 250, 0.12)',
                        border: '1px solid rgba(96, 165, 250, 0.35)',
                        fontSize: '0.68rem',
                        color: '#93c5fd',
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        letterSpacing: '0.08em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: '#60a5fa',
                          boxShadow: '0 0 8px #60a5fa',
                        }}
                      />
                      {cert.year}
                    </div>
                  </div>

                  <h4
                    style={{
                      fontWeight: '800',
                      color: '#fff',
                      fontSize: '1rem',
                      lineHeight: '1.35',
                      marginBottom: '8px',
                      position: 'relative',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {cert.title}
                  </h4>

                  <div
                    style={{
                      width: '30px',
                      height: '2px',
                      background: 'linear-gradient(to right, #60a5fa, transparent)',
                      borderRadius: '2px',
                      marginBottom: '12px',
                      boxShadow: '0 0 8px rgba(96, 165, 250, 0.7)',
                    }}
                  />

                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      position: 'relative',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem' }}>🏛️</span>
                    <span style={{ fontWeight: '600', color: '#cbd5e1' }}>{cert.issuer}</span>
                  </p>

                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(96, 165, 250, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        color: '#64748b',
                        fontFamily: 'monospace',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Certificate {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: '#4ade80',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontFamily: 'monospace',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#4ade80',
                          boxShadow: '0 0 8px #4ade80',
                        }}
                      />
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tech' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '16px',
            }}
          >
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  backgroundColor: 'rgba(10, 15, 28, 0.98)',
                  border: `1px solid ${tech.color}40`,
                  borderRadius: '16px',
                  padding: '22px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  overflow: 'hidden',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  boxShadow: `0 10px 30px -15px ${tech.color}50`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  e.currentTarget.style.borderColor = tech.color;
                  e.currentTarget.style.boxShadow = `0 20px 40px -15px ${tech.color}90, 0 0 30px -10px ${tech.color}80`;
                  e.currentTarget.style.background = `linear-gradient(135deg, ${tech.color}10, rgba(10, 15, 28, 0.98))`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = `${tech.color}40`;
                  e.currentTarget.style.boxShadow = `0 10px 30px -15px ${tech.color}50`;
                  e.currentTarget.style.background = 'rgba(10, 15, 28, 0.98)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-30%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${tech.color}40, transparent 70%)`,
                    filter: 'blur(25px)',
                    pointerEvents: 'none',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    width: '10px',
                    height: '10px',
                    borderTop: `2px solid ${tech.color}80`,
                    borderLeft: `2px solid ${tech.color}80`,
                    borderRadius: '3px 0 0 0',
                    opacity: 0.7,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '10px',
                    height: '10px',
                    borderBottom: `2px solid ${tech.color}80`,
                    borderRight: `2px solid ${tech.color}80`,
                    borderRadius: '0 0 3px 0',
                    opacity: 0.7,
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${tech.color}30, ${tech.color}10)`,
                    border: `1px solid ${tech.color}60`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px -8px ${tech.color}70`,
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: '900',
                      color: tech.color,
                      fontFamily: 'monospace',
                      textShadow: `0 0 12px ${tech.color}`,
                      letterSpacing: '-0.05em',
                    }}
                  >
                    {tech.name.charAt(0)}
                  </span>

                  <div
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '18px',
                      border: `1px dashed ${tech.color}60`,
                      animation: 'spinSlow 15s linear infinite',
                    }}
                  />
                </div>

                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: '#e2e8f0',
                    textAlign: 'center',
                    letterSpacing: '0.01em',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {tech.name}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.6rem',
                    color: '#64748b',
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: tech.color,
                      boxShadow: `0 0 6px ${tech.color}`,
                    }}
                  />
                  ACTIVE
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}

// ============================================================
// CONTACT SECTION
// ============================================================
function ContactSection() {
  const [comments, setComments] = useState([
    { name: 'enter your name', text: 'bg ternyata kmu spiderman', time: '22h ago' },
    { name: 'well', text: 'tes', time: '1d ago' },
  ]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !text) return;
    setComments([{ name, text, time: 'Just now' }, ...comments]);
    setName('');
    setText('');
  };

  const inputStyle = {
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    padding: '12px',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: '100px 24px 60px 24px',
        maxWidth: '1100px',
        margin: '0 auto',
        background: 'transparent',
      }}
    >
      <SectionDivider />
      <ScrollReveal>
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '48px',
            color: '#ffffff',
            textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          }}
        >
          Hubungi Saya
        </h2>

        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                padding: '1.5px',
                background: `conic-gradient(
                  from var(--angle, 0deg),
                  rgba(96, 165, 250, 0) 0%,
                  rgba(96, 165, 250, 1) 20%,
                  rgba(168, 85, 247, 1) 30%,
                  rgba(96, 165, 250, 0) 50%,
                  rgba(96, 165, 250, 0) 70%,
                  rgba(96, 165, 250, 1) 80%,
                  rgba(168, 85, 247, 1) 90%,
                  rgba(96, 165, 250, 0) 100%
                )`,
                animation: 'rotateBorder 6s linear infinite',
                boxShadow: '0 20px 50px -20px rgba(59, 130, 246, 0.5)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  backgroundColor: 'rgba(10, 15, 28, 0.98)',
                  borderRadius: '19px',
                  padding: '28px',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    color: '#fff',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.2))',
                      border: '1px solid rgba(96, 165, 250, 0.4)',
                      fontSize: '1rem',
                    }}
                  >
                    ✉️
                  </span>
                  Hubungi
                </h3>
                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    marginBottom: '20px',
                    marginTop: '4px',
                  }}
                >
                  Ada yang mau didiskusikan? Langsung kirim pesan aja ya..
                </p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(59,130,246,0.7)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#1e293b';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email Anda"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(59,130,246,0.7)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#1e293b';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <textarea
                    rows={3}
                    placeholder="Pesan Anda"
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(59,130,246,0.7)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#1e293b';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <MagneticButton
                    as="button"
                    type="submit"
                    style={{
                      padding: '12px',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1, #a855f7)',
                      color: '#fff',
                      fontWeight: '700',
                      borderRadius: '10px',
                      border: 'none',
                      boxShadow: '0 8px 20px rgba(99, 102, 241, 0.5)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    🚀 Kirim Pesan
                  </MagneticButton>
                </form>
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                padding: '1.5px',
                background: `conic-gradient(
                  from var(--angle, 0deg),
                  rgba(96, 165, 250, 0) 0%,
                  rgba(96, 165, 250, 0.8) 20%,
                  rgba(168, 85, 247, 0.8) 30%,
                  rgba(96, 165, 250, 0) 50%,
                  rgba(96, 165, 250, 0) 70%,
                  rgba(96, 165, 250, 0.8) 80%,
                  rgba(168, 85, 247, 0.8) 90%,
                  rgba(96, 165, 250, 0) 100%
                )`,
                animation: 'rotateBorder 8s linear infinite',
                boxShadow: '0 20px 50px -20px rgba(59, 130, 246, 0.5)',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(10, 15, 28, 0.98)',
                  borderRadius: '19px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <h4
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '4px',
                  }}
                >
                  ✦ FIND ME
                </h4>
                <a
                  href="https://linkedin.com/in/usernamekamu"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#93c5fd',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    padding: '10px 14px',
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(96, 165, 250, 0.25)',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.18)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>💼</span> Let's Connect (LinkedIn)
                </a>
                <a
                  href="https://instagram.com/usernamekamu"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#e2e8f0',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    padding: '10px 14px',
                    background: 'rgba(236, 72, 153, 0.06)',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(236, 72, 153, 0.15)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(236, 72, 153, 0.06)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>📷</span> Instagram
                </a>
                <a
                  href="https://github.com/usernamekamu"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#e2e8f0',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>💻</span> GitHub
                </a>
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              padding: '1.5px',
              background: `conic-gradient(
                from var(--angle, 0deg),
                rgba(96, 165, 250, 0) 0%,
                rgba(96, 165, 250, 1) 20%,
                rgba(168, 85, 247, 1) 30%,
                rgba(96, 165, 250, 0) 50%,
                rgba(96, 165, 250, 0) 70%,
                rgba(96, 165, 250, 1) 80%,
                rgba(168, 85, 247, 1) 90%,
                rgba(96, 165, 250, 0) 100%
              )`,
              animation: 'rotateBorder 5s linear infinite',
              boxShadow: '0 20px 50px -20px rgba(59, 130, 246, 0.5)',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(10, 15, 28, 0.98)',
                borderRadius: '19px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  color: '#fff',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.2))',
                    border: '1px solid rgba(96, 165, 250, 0.4)',
                    fontSize: '1rem',
                  }}
                >
                  💬
                </span>
                Komentar ({comments.length})
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Masukkan nama kamu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ ...inputStyle, width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <textarea
                  rows={2}
                  placeholder="Tulis komentar kamu di sini..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{ ...inputStyle, width: '100%', padding: '10px', marginBottom: '10px', resize: 'none' }}
                />
                <button
                  onClick={handleSubmit}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1, #a855f7)',
                    color: '#fff',
                    fontWeight: '700',
                    borderRadius: '10px',
                    border: 'none',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
                    letterSpacing: '0.02em',
                  }}
                >
                  ✦ Kirim Komentar
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  overflowY: 'auto',
                  maxHeight: '320px',
                  paddingRight: '4px',
                }}
              >
                {comments.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(168, 85, 247, 0.04))',
                      border: '1px solid rgba(96, 165, 250, 0.2)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        background: 'linear-gradient(to bottom, #60a5fa, #a855f7)',
                        boxShadow: '0 0 10px rgba(96, 165, 250, 0.6)',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontWeight: 'bold',
                          color: '#93c5fd',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            color: '#fff',
                            fontWeight: '800',
                            flexShrink: 0,
                          }}
                        >
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                        {c.name}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{c.time}</span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '6px 0 0 0', paddingLeft: '28px' }}>
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <footer style={{ marginTop: '80px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} Muhamad Rafly Ramadhani. Built with React & Tailwind CSS.
      </footer>
    </section>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    if (!isLoading) setTimeout(() => setHeroMounted(true), 100);
  }, [isLoading]);

  if (isLoading) {
    return (
      <>
        <GlobalStyles />
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      </>
    );
  }

  return (
    <main
      style={{
        backgroundColor: '#030712',
        background: '#030712',
        backgroundImage: 'none',
        minHeight: '100vh',
        color: '#ffffff',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflowX: 'hidden',
        width: '100%',
      }}
    >
      <GlobalStyles />
      <ScrollProgress />
      <StarfieldBackground />

      <nav
        className="navbar-mobile"
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid #1e293b',
          borderRadius: '9999px',
          padding: '10px 24px',
          display: 'flex',
          gap: '24px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          opacity: heroMounted ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
          maxWidth: '90vw',
          flexWrap: 'nowrap',
        }}
      >
        {['Home', 'About', 'Portfolio', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              color: '#e2e8f0',
              fontSize: '0.875rem',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#60a5fa';
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#e2e8f0';
            }}
          >
            {item}
          </a>
        ))}
      </nav>

      <section
        id="home"
        className="hero-section"
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 60px 24px',
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          background: 'transparent',
          backgroundImage: 'none',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        }}
      >
        <div
          className="hero-flex"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px',
            width: '100%',
          }}
        >
          <div className="hero-left" style={{ flex: '1 1 500px', minWidth: 0, textAlign: 'left' }}>
            <div
              className="hero-badge-wrap"
              style={{
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '9999px',
                  color: '#60a5fa',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  marginBottom: '16px',
                }}
              >
                IT Edu Student
              </span>
            </div>

            <h1
              className="hero-title"
              style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: '800',
                lineHeight: '1.15',
                marginBottom: '20px',
                letterSpacing: '-0.02em',
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted ? 'translateY(0)' : 'translateY(25px)',
                transition: 'opacity 0.8s ease 0.35s, transform 0.8s ease 0.35s',
              }}
            >
              Turning Ideas <br />
              <span
                style={{
                  background: 'linear-gradient(to right, #60a5fa, #a5b4fc, #c084fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <Typewriter text="Into Reality" speed={80} delay={heroMounted ? 800 : 99999} />
              </span>
            </h1>

            <p
              className="hero-subtitle"
              style={{
                color: '#94a3b8',
                fontSize: '1rem',
                lineHeight: '1.7',
                maxWidth: '500px',
                marginBottom: '28px',
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted ? 'translateY(0)' : 'translateY(25px)',
                transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s',
              }}
            >
              Dimulai dari rasa penasaran, berkembang menjadi passion. Aku membangun pengalaman digital yang tidak hanya terlihat bagus, tapi juga terasa bermakna bagi penggunanya.
            </p>

            <div
              className="hero-cta"
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease 0.65s, transform 0.8s ease 0.65s',
              }}
            >
              <MagneticButton
                href="#portfolio"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1d4ed8',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(29, 78, 216, 0.4)',
                  display: 'inline-block',
                }}
              >
                Project -&gt;
              </MagneticButton>
              <MagneticButton
                href="#contact"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  color: '#cbd5e1',
                  borderRadius: '10px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Contact Me
              </MagneticButton>
            </div>
          </div>

          <div
            className="hero-right"
            style={{
              flex: '1 1 380px',
              maxWidth: '440px',
              width: '100%',
              opacity: heroMounted ? 1 : 0,
              transform: heroMounted ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transition: 'opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s',
            }}
          >
            <CustomSpotifyPlayer />
          </div>
        </div>
      </section>

      <AboutSection />
      <PortfolioSection />
      <ContactSection />
    </main>
  );
}