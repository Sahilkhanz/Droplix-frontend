import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Login({ onAuthenticated }) {
  // ← Make sure this is here
  const scope = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cleanups = [];
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Ambient orb animations
      gsap.to(".orb-a", {
        y: -28,
        x: 20,
        duration: 4.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".orb-b", {
        y: 32,
        x: -16,
        duration: 5.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-dot-a", {
        y: -24,
        x: 12,
        scale: 1.14,
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-dot-b", {
        y: 20,
        x: -16,
        scale: 0.92,
        duration: 5.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-beam", {
        rotation: 10,
        x: 38,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Orb glow pulse
      gsap.to(".orb-a", {
        boxShadow: "0 0 36px rgba(79,168,255,0.55)",
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Hero sheen sweep
      gsap.fromTo(
        ".hero-sheen",
        { xPercent: -140, opacity: 0 },
        {
          xPercent: 180,
          opacity: 0.85,
          duration: 2.2,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 2.8,
        },
      );

      // Entrance timeline
      tl.from(".hero-badge", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(2)",
      })
        .from(
          ".hero-title-line",
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.85,
            stagger: 0.09,
            ease: "power4.out",
          },
          0.06,
        )
        .from(".hero-copy", { y: 28, opacity: 0, duration: 0.65 }, 0.28)
        .fromTo(
          ".hero-metric-card",
          {
            y: 48,
            rotateX: -22,
            opacity: 0,
            scale: 0.94,
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            scale: 1,
            duration: 0.72,
            stagger: 0.12,
            ease: "back.out(1.6)",
          },
          0.34,
        )
        .fromTo(
          ".feature-list-item",
          { clipPath: "inset(0 100% 0 0)", opacity: 0, x: -24 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            x: 0,
            duration: 0.54,
            stagger: 0.1,
            ease: "power3.out",
          },
          0.52,
        )
        .from(
          ".auth-panel",
          {
            x: 52,
            opacity: 0,
            rotateY: -12,
            duration: 0.88,
            ease: "power3.out",
          },
          0.1,
        )
        .from(
          ".auth-form > *",
          { y: 22, opacity: 0, duration: 0.48, stagger: 0.07 },
          0.36,
        );

      // Magnetic hover on metric cards
      const metricCards = gsap.utils.toArray(".hero-metric-card");
      metricCards.forEach((card) => {
        const xTo = gsap.quickTo(card, "x", {
          duration: 0.45,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(card, "y", {
          duration: 0.45,
          ease: "power3.out",
        });

        const onMove = (e) => {
          const rect = card.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          xTo((e.clientX - cx) * 0.18);
          yTo((e.clientY - cy) * 0.14);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      // Subtle tilt on feature items
      const featureItems = gsap.utils.toArray(".feature-list-item");
      featureItems.forEach((item) => {
        const enter = () =>
          gsap.to(item, { x: 10, duration: 0.32, ease: "power3.out" });
        const leave = () =>
          gsap.to(item, { x: 0, duration: 0.42, ease: "elastic.out(1, 0.5)" });
        item.addEventListener("mouseenter", enter);
        item.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          item.removeEventListener("mouseenter", enter);
          item.removeEventListener("mouseleave", leave);
        });
      });

      // Form field focus glow
      const inputs = gsap.utils.toArray(".auth-form input");
      inputs.forEach((input) => {
        const onFocus = () =>
          gsap.to(input, { scale: 1.012, duration: 0.22, ease: "power2.out" });
        const onBlur = () =>
          gsap.to(input, { scale: 1, duration: 0.22, ease: "power2.out" });
        input.addEventListener("focus", onFocus);
        input.addEventListener("blur", onBlur);
        cleanups.push(() => {
          input.removeEventListener("focus", onFocus);
          input.removeEventListener("blur", onBlur);
        });
      });
    }, scope);

    return () => {
      cleanups.forEach((c) => c());
      ctx.revert();
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      if (!BASE_URL) {
        throw new Error(
          "Missing VITE_API_URL. Check your environment variables.",
        );
      }

      console.log("Attempting login to:", `${BASE_URL}/api/auth/login`);

      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }

      console.log("Login successful, calling onAuthenticated with token");

      // Check if onAuthenticated is a function
      if (typeof onAuthenticated === "function") {
        onAuthenticated(data.token);
      } else {
        console.error("onAuthenticated is not a function", onAuthenticated);
        // Fallback - manually store token and reload
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      setStatus({
        type: "error",
        message:
          error.message || "Could not sign you in. Check your credentials.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell" ref={scope}>
      <style>{`
        .auth-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
          overflow-x: hidden;
        }

        .auth-hero {
          flex: 1;
          max-width: 600px;
          padding: 2rem;
          position: relative;
        }

        .auth-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 2rem;
          padding: 2.5rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .hero-ambient {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .hero-beam {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          background: radial-gradient(circle, rgba(79,168,255,0.15) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
        }

        .hero-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(79,168,255,0.6);
          border-radius: 50%;
          filter: blur(1px);
        }

        .hero-dot-a { top: 25%; left: 15%; }
        .hero-dot-b { bottom: 35%; right: 20%; }

        .hero-orbs {
          position: absolute;
          top: -20px;
          right: -20px;
        }

        .hero-orb {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          filter: blur(20px);
        }

        .orb-a {
          background: radial-gradient(circle, rgba(79,168,255,0.4), rgba(79,168,255,0.1));
          top: 0;
          right: 0;
        }

        .orb-b {
          background: radial-gradient(circle, rgba(147,51,234,0.3), rgba(147,51,234,0.05));
          bottom: -20px;
          left: -20px;
          width: 100px;
          height: 100px;
        }

        .hero-badge-wrap {
          position: relative;
          margin-bottom: 2rem;
        }

        .eyebrow {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #3b82f6;
          background: rgba(59,130,246,0.1);
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
        }

        .hero-badge {
          font-size: 1rem;
          background: rgba(59,130,246,0.15);
          backdrop-filter: blur(4px);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .hero-title-line {
          display: block;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .hero-sheen {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          pointer-events: none;
        }

        .hero-copy {
          font-size: 1.125rem;
          color: #475569;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .hero-metric-card {
          background: white;
          padding: 1rem;
          border-radius: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .hero-metric-card:hover {
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15);
        }

        .hero-metric-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .hero-metric-card strong {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1e293b;
        }

        .hero-metric-card span {
          font-size: 0.75rem;
          color: #64748b;
        }

        .hero-metric-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }

        .hero-metric-card:hover .hero-metric-bar {
          width: 100%;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-list-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 0;
          gap: 0.75rem;
          cursor: pointer;
          border-bottom: 1px solid #e2e8f0;
        }

        .feature-icon {
          font-size: 1.25rem;
        }

        .feature-text {
          flex: 1;
          color: #334155;
          font-size: 0.875rem;
        }

        .feature-arrow {
          color: #94a3b8;
          transition: transform 0.2s ease;
        }

        .feature-list-item:hover .feature-arrow {
          transform: translateX(4px);
          color: #3b82f6;
        }

        .panel-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .panel-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
          color: #1e293b;
        }

        .panel-header p {
          font-size: 0.875rem;
          color: #64748b;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-form label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
        }

        .auth-form input {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background: white;
        }

        .auth-form input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .form-message {
          font-size: 0.875rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          text-align: center;
        }

        .form-message.error {
          background: #fee2e2;
          color: #dc2626;
        }

        .form-message.success {
          background: #dcfce7;
          color: #16a34a;
        }

        .auth-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .primary-button {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .primary-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(59,130,246,0.4);
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ghost-button {
          background: transparent;
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ghost-button:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .auth-link-row {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
        }

        .auth-link-row a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-link-row a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .auth-shell {
            flex-direction: column;
            padding: 1rem;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .auth-panel {
            max-width: 100%;
          }
        }
      `}</style>

      <section className="auth-hero">
        <div className="hero-ambient" aria-hidden="true">
          <span className="hero-beam" />
          <span className="hero-dot hero-dot-a" />
          <span className="hero-dot hero-dot-b" />
        </div>
        <div className="hero-badge-wrap">
          <p className="eyebrow hero-badge">Droplix</p>
          <div className="hero-orbs" aria-hidden="true">
            <span className="hero-orb orb-a" />
            <span className="hero-orb orb-b" />
          </div>
        </div>
        <h1 className="hero-title">
          <span className="hero-sheen" aria-hidden="true" />
          <span className="hero-title-line">File management</span>
          <span className="hero-title-line">that feels like</span>
          <span className="hero-title-line">Google Drive</span>
        </h1>
        <p className="hero-copy">
          Upload, organize, and preview your files with a beautiful interface.
          Built for speed and designed to scale.
        </p>

        <div className="hero-metrics">
          <article className="hero-metric-card">
            <div className="hero-metric-icon">🚀</div>
            <strong>Fast Uploads</strong>
            <span>Drag & drop with progress feedback</span>
            <div className="hero-metric-bar" aria-hidden="true" />
          </article>
          <article className="hero-metric-card">
            <div className="hero-metric-icon">👁️</div>
            <strong>Instant Preview</strong>
            <span>Images & PDFs without download</span>
            <div className="hero-metric-bar" aria-hidden="true" />
          </article>
        </div>

        <ul className="feature-list">
          <li className="feature-list-item">
            <span className="feature-icon">📤</span>
            <span className="feature-text">
              Drag & drop file uploads with instant preview
            </span>
            <span className="feature-arrow">→</span>
          </li>
          <li className="feature-list-item">
            <span className="feature-icon">📁</span>
            <span className="feature-text">
              Organize files into folders like Google Drive
            </span>
            <span className="feature-arrow">→</span>
          </li>
          <li className="feature-list-item">
            <span className="feature-icon">🖼️</span>
            <span className="feature-text">
              Preview images and PDFs without downloading
            </span>
            <span className="feature-arrow">→</span>
          </li>
          <li className="feature-list-item">
            <span className="feature-icon">🔍</span>
            <span className="feature-text">
              Fast search and smart filtering
            </span>
            <span className="feature-arrow">→</span>
          </li>
          <li className="feature-list-item">
            <span className="feature-icon">⊞</span>
            <span className="feature-text">
              Grid or list view - your choice
            </span>
            <span className="feature-arrow">→</span>
          </li>
          <li className="feature-list-item">
            <span className="feature-icon">🔒</span>
            <span className="feature-text">
              Secure file storage ready for scale
            </span>
            <span className="feature-arrow">→</span>
          </li>
        </ul>
      </section>

      <section className="auth-panel">
        <div className="panel-header">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to Droplix</h2>
          <p>Access your files anywhere, anytime</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {status.message ? (
            <p className={`form-message ${status.type}`}>{status.message}</p>
          ) : null}

          <div className="auth-actions">
            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="auth-link-row">
          New to DriveClone? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
// import { useState } from "react";

// const BASE_URL = import.meta.env.VITE_API_URL;

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("token", data.token);
//         alert("Login successful ✅");
//       } else {
//         alert(data.message || "Login failed ❌");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div style={{ padding: "30px" }}>
//       <h2>Login</h2>

//       <input
//         type="email"
//         placeholder="Enter email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <br />
//       <br />

//       <input
//         type="password"
//         placeholder="Enter password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <br />
//       <br />

//       <button onClick={handleLogin}>Login</button>
//       <a href="/register">Go to Register</a>
//     </div>
//   );
// }
