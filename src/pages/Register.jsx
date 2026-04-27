import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Register({ onAuthenticated }) {
  const scope = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".register-panel", {
        x: 52,
        opacity: 0,
        rotateY: -12,
        duration: 0.88,
        ease: "power3.out",
      });
      gsap.from(".register-form > *", {
        y: 22,
        opacity: 0,
        duration: 0.48,
        stagger: 0.07,
      });
      gsap.from(".register-hero", {
        x: -52,
        opacity: 0,
        duration: 0.88,
        ease: "power3.out",
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      if (!BASE_URL) {
        throw new Error("Missing VITE_API_URL");
      }

      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name: name || email.split("@")[0],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setStatus({
        type: "success",
        message: "Account created successfully! Redirecting to login...",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-shell" ref={scope}>
      <style>{`
        .register-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
        }

        .register-hero {
          flex: 1;
          max-width: 500px;
          padding: 2rem;
          color: white;
        }

        .register-panel {
          background: white;
          border-radius: 2rem;
          padding: 2.5rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .register-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .register-subtitle {
          font-size: 1.125rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .feature-grid {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          backdrop-filter: blur(10px);
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

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .register-form label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
        }

        .register-form input {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .register-form input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
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

        .register-actions {
          margin-top: 0.5rem;
        }

        .primary-button {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .primary-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-link-row {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
        }

        .auth-link-row a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .register-shell {
            flex-direction: column;
          }
          
          .register-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <section className="register-hero">
        <h1 className="register-title">Join Droplix</h1>
        <p className="register-subtitle">
          Start managing your files like never before
        </p>
        <div className="feature-grid">
          <div className="feature-item">
            <span>📤</span>
            <span>Unlimited uploads</span>
          </div>
          <div className="feature-item">
            <span>🔒</span>
            <span>Secure storage</span>
          </div>
          <div className="feature-item">
            <span>⚡</span>
            <span>Lightning fast</span>
          </div>
        </div>
      </section>

      <section className="register-panel">
        <div className="panel-header">
          <p className="eyebrow" style={{ color: "#667eea" }}>
            Get started
          </p>
          <h2>Create your account</h2>
          <p>Join thousands of happy users</p>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          <label>
            Name (optional)
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          {status.message ? (
            <p className={`form-message ${status.type}`}>{status.message}</p>
          ) : null}

          <div className="register-actions">
            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="auth-link-row">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
// import { useState } from "react";

// const BASE_URL = import.meta.env.VITE_API_URL;

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = async () => {
//     const res = await fetch(`${BASE_URL}/api/auth/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Registered successfully ✅");
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>

//       <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//       <br />
//       <br />

//       <input
//         placeholder="Password"
//         type="password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <br />
//       <br />

//       <button onClick={handleRegister}>Register</button>
//     </div>
//   );
// }
