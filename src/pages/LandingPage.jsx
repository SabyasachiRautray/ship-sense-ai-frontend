import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "⏱",
    title: "72-Hour SLA Prediction",
    desc: "Predicts shipment delays 48–72 hours before SLA breach using AI reasoning.",
  },
  {
    icon: "📡",
    title: "Live Signal Fusion",
    desc: "Combines weather, traffic, and breaking news signals for real-time delay prediction.",
  },
  {
    icon: "🧠",
    title: "AI Reasoning Engine",
    desc: "Powered by NVIDIA Llama models to analyze multiple disruption signals simultaneously.",
  },
  {
    icon: "🚛",
    title: "Multi-Mode Logistics",
    desc: "Supports road, air, and sea transportation for flexible rerouting recommendations.",
  },
  {
    icon: "🗺",
    title: "Route Intelligence",
    desc: "Visual maps highlight risky routes and recommend safer alternatives.",
  },
  {
    icon: "📊",
    title: "Risk Dashboard",
    desc: "Monitor shipments, risk scores, and alerts in one unified dashboard.",
  },
  {
    icon: "⚡",
    title: "Disruption Simulation",
    desc: "Simulate strikes, weather disruptions, or traffic incidents instantly.",
  },
  {
    icon: "🔐",
    title: "Secure Access",
    desc: "JWT authentication with role-based access for admins and logistics users.",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold }
    );

    if (ref.current) obs.observe(ref.current);

    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
 

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

 const navigate = useNavigate()
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const [featRef, featVisible] = useInView();
  const [aboutRef, aboutVisible] = useInView();

  return (
    <div
      style={{
        fontFamily: "'DM Sans', system-ui",
        color: "#111827",
        background: "#fff",
      }}
    >
      <style>{`

      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono&display=swap');

      .btn-primary{
      background:#111827;
      color:white;
      padding:10px 22px;
      border-radius:8px;
      border:none;
      font-weight:600;
      cursor:pointer;
      }

      .btn-primary:hover{
      background:#1f2937;
      }

      .btn-ghost{
      border:1px solid #e5e7eb;
      padding:10px 22px;
      border-radius:8px;
      background:white;
      cursor:pointer;
      }

      .feature-card{
      border:1px solid #f3f4f6;
      border-radius:12px;
      padding:1.5rem;
      transition:all .2s;
      }

      .feature-card:hover{
      border-color:#d1d5db;
      box-shadow:0 6px 18px rgba(0,0,0,.06);
      }

      .fade{
      opacity:0;
      transform:translateY(25px);
      transition:all .6s ease;
      }

      .fade.visible{
      opacity:1;
      transform:translateY(0);
      }

      `}</style>

      {/* NAVBAR */}

      <header
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 3rem",
          background: scrollY > 10 ? "rgba(255,255,255,.9)" : "transparent",
          backdropFilter: "blur(10px)",
          borderBottom: scrollY > 10 ? "1px solid #eee" : "none",
          zIndex: 50,
        }}
      >
        <div style={{ fontWeight: 700 }}>
          🚢 ShipSense<span style={{ color: "#2563eb" }}>AI</span>
        </div>

        <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
          <button onClick={() => scrollTo("features")}>Features</button>
          <button onClick={() => scrollTo("about")}>About</button>

          <button className="btn-ghost" onClick={() => navigate("/login")}>
  Login
</button>
          <button className="btn-primary" onClick={() => navigate("/login")}>Sign Up</button>
        </div>
      </header>

      {/* HERO */}

      <section
        style={{
          paddingTop: "9rem",
          paddingBottom: "6rem",
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 12,
            marginBottom: 20,
            color: "#2563eb",
            fontFamily: "DM Mono",
          }}
        >
          INNOVATE X 5.0 — NATIONAL HACKATHON
        </div>

        <h1
          style={{
            fontSize: "3.2rem",
            lineHeight: 1.2,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          AI Early Warning System
          <br />
          <span style={{ color: "#2563eb" }}>for Shipment Delays</span>
        </h1>

        <p style={{ color: "#6b7280", marginBottom: 35 }}>
          ShipSense AI predicts logistics disruptions before they happen by
          analyzing weather, traffic, and news signals. Logistics teams get
          early warnings and actionable recommendations to prevent SLA
          violations.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => navigate("/login")}>
  Start Monitoring
</button>
          <button className="btn-ghost" onClick={() => scrollTo("features")}>
            See Features
          </button>
        </div>
      </section>

      {/* FEATURES */}

      <section id="features" style={{ padding: "5rem 3rem" }}>
        <div style={{ maxWidth: 1100, margin: "auto" }}>
          <div
            ref={featRef}
            className={`fade ${featVisible ? "visible" : ""}`}
            style={{ marginBottom: "3rem" }}
          >
            <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
              Key Features
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
              gap: "1rem",
            }}
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div style={{ fontSize: 24 }}>{f.icon}</div>
                <h3 style={{ marginTop: 10 }}>{f.title}</h3>
                <p style={{ color: "#6b7280", fontSize: 14 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}

      <section
        id="about"
        style={{ padding: "5rem 3rem", background: "#f9fafb" }}
      >
        <div
          ref={aboutRef}
          className={`fade ${aboutVisible ? "visible" : ""}`}
          style={{ maxWidth: 750, margin: "auto", textAlign: "center" }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 20 }}>
            About the Project
          </h2>

          <p style={{ color: "#6b7280", lineHeight: 1.7 }}>
            ShipSense AI was developed as part of the INNOVATE X 5.0 national
            hackathon. Logistics companies handle thousands of shipments every
            day, and unexpected disruptions such as weather events, traffic
            congestion, and operational issues often cause delivery delays.
          </p>

          <p style={{ color: "#6b7280", marginTop: 20 }}>
            Our system analyzes multiple data signals and predicts which
            shipments are at risk of missing their SLA 48–72 hours in advance.
            It also recommends proactive actions such as rerouting shipments,
            assigning alternative carriers, or notifying customers early.
          </p>
        </div>
      </section>

      {/* CTA */}

      <section style={{ padding: "4rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: 20 }}>
          Prevent shipment delays before they happen
        </h2>

       
      </section>

      {/* FOOTER */}

      <footer
        style={{
          borderTop: "1px solid #eee",
          padding: "2rem 3rem",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div>
          🚢 ShipSense<span style={{ color: "#2563eb" }}>AI</span>
        </div>

        <div style={{ color: "#6b7280", fontSize: 14 }}>
          Built for INNOVATE X 5.0 Hackathon
        </div>
      </footer>
    </div>
  );
}