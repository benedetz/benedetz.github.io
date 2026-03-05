import { useState, useEffect, useRef } from "react";

// ── Palette & global styles injected via a <style> tag ──────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #F4F5F0;
      --surface:   #FFFFFF;
      --text:      #1E2022;
      --muted:     #6B7280;
      --accent:    #4ADE80;
      --accent-dk: #16A34A;
      --border:    #E2E8F0;
      --code-bg:   #0F1117;
      --code-text: #4ADE80;
      --nav-h:     60px;
    }
    .dark {
      --bg:        #0F1117;
      --surface:   #1A1D27;
      --text:      #E8EAE6;
      --muted:     #9CA3AF;
      --border:    #2A2D3A;
      --code-bg:   #0a0c10;
    }

    html { scroll-behavior: smooth; }
    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      transition: background 0.3s, color 0.3s;
      min-height: 100vh;
    }
    .mono { font-family: 'IBM Plex Mono', monospace; }

    /* Dot-grid background texture */
    .dot-bg {
      background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    /* Navbar */
    .navbar {
      position: fixed; top: 0; left: 0; right: 0;
      height: var(--nav-h);
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2.5rem;
      z-index: 100;
      backdrop-filter: blur(10px);
      transition: background 0.3s, border-color 0.3s;
    }
    .nav-logo {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 1rem; font-weight: 600;
      color: var(--text);
      cursor: pointer;
      display: flex; align-items: center; gap: 6px;
    }
    .nav-logo .cursor {
      display: inline-block; width: 9px; height: 16px;
      background: var(--accent);
      animation: blink 1.1s step-end infinite;
      border-radius: 1px;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    .nav-links { display: flex; align-items: center; gap: 0.25rem; }
    .nav-link {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.78rem; font-weight: 500;
      color: var(--muted);
      padding: 6px 14px; border-radius: 6px;
      cursor: pointer; border: none; background: none;
      transition: color 0.2s, background 0.2s;
      letter-spacing: 0.02em;
    }
    .nav-link:hover { color: var(--text); background: var(--border); }
    .nav-link.active { color: var(--accent-dk); background: rgba(74,222,128,0.1); }

    .dark-toggle {
      width: 38px; height: 22px;
      background: var(--border);
      border-radius: 100px; border: none; cursor: pointer;
      position: relative; transition: background 0.3s;
      margin-left: 1rem;
    }
    .dark-toggle.on { background: var(--accent-dk); }
    .dark-toggle::after {
      content: ''; position: absolute;
      top: 3px; left: 3px;
      width: 16px; height: 16px;
      border-radius: 50%; background: white;
      transition: transform 0.25s;
    }
    .dark-toggle.on::after { transform: translateX(16px); }

    /* Page wrapper */
    .page { padding-top: var(--nav-h); min-height: 100vh; }

    /* Fade-slide animation */
    .fade-in {
      animation: fadeSlideUp 0.45s cubic-bezier(.22,.68,0,1.2) both;
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-in-delay-1 { animation-delay: 0.1s; }
    .fade-in-delay-2 { animation-delay: 0.2s; }
    .fade-in-delay-3 { animation-delay: 0.3s; }
    .fade-in-delay-4 { animation-delay: 0.45s; }

    /* Hero */
    .hero {
      min-height: calc(100vh - var(--nav-h));
      display: flex; flex-direction: column;
      justify-content: center; align-items: flex-start;
      padding: 4rem 2.5rem;
      max-width: 860px; margin: 0 auto;
    }
    .hero-eyebrow {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.8rem; color: var(--accent-dk);
      letter-spacing: 0.12em; text-transform: uppercase;
      margin-bottom: 1.25rem;
      display: flex; align-items: center; gap: 8px;
    }
    .hero-eyebrow::before {
      content: ''; display: block;
      width: 24px; height: 1.5px; background: var(--accent);
    }
    .hero h1 {
      font-size: clamp(2.4rem, 6vw, 4rem);
      font-weight: 600; line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }
    .hero h1 .name { color: var(--accent-dk); }
    .typing-line {
      font-family: 'IBM Plex Mono', monospace;
      font-size: clamp(1rem, 2.5vw, 1.35rem);
      color: var(--muted);
      min-height: 2em;
      margin-bottom: 1.75rem;
    }
    .typing-cursor {
      display: inline-block; width: 2px; height: 1.1em;
      background: var(--accent); margin-left: 2px;
      vertical-align: middle;
      animation: blink 0.9s step-end infinite;
    }
    .hero-desc {
      font-size: 1.05rem; color: var(--muted);
      max-width: 520px; line-height: 1.7;
      margin-bottom: 2.5rem;
    }
    .btn-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-primary {
      background: var(--accent-dk); color: white;
      padding: 10px 24px; border-radius: 8px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.85rem; font-weight: 500;
      border: none; cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      letter-spacing: 0.03em;
    }
    .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn-secondary {
      background: transparent; color: var(--text);
      padding: 10px 24px; border-radius: 8px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.85rem; font-weight: 500;
      border: 1.5px solid var(--border); cursor: pointer;
      transition: border-color 0.2s, transform 0.15s, color 0.2s;
      letter-spacing: 0.03em;
    }
    .btn-secondary:hover { border-color: var(--accent); color: var(--accent-dk); transform: translateY(-1px); }

    /* Section */
    .section { max-width: 860px; margin: 0 auto; padding: 5rem 2.5rem; }
    .section-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.75rem; color: var(--accent-dk);
      letter-spacing: 0.14em; text-transform: uppercase;
      margin-bottom: 0.6rem;
      display: flex; align-items: center; gap: 8px;
    }
    .section-label::before { content:''; display:block; width:16px; height:1.5px; background:var(--accent); }
    .section h2 {
      font-size: 1.9rem; font-weight: 600;
      letter-spacing: -0.02em; margin-bottom: 2.5rem;
    }

    /* Project cards */
    .projects-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .project-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px; padding: 1.5rem;
      transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .project-card:hover {
      border-color: var(--accent);
      transform: translateY(-3px);
      box-shadow: 0 8px 32px rgba(74,222,128,0.08);
    }
    .project-tag {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.7rem; color: var(--accent-dk);
      background: rgba(74,222,128,0.1);
      padding: 2px 8px; border-radius: 4px;
      display: inline-block; margin-bottom: 0.75rem;
    }
    .project-card h3 { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.5rem; }
    .project-card p { font-size: 0.88rem; color: var(--muted); line-height: 1.6; margin-bottom: 1.25rem; }
    .project-links { display: flex; gap: 0.75rem; }
    .project-link {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.75rem; color: var(--muted);
      text-decoration: none; padding: 4px 10px;
      border: 1px solid var(--border); border-radius: 5px;
      transition: color 0.2s, border-color 0.2s;
      background: none; cursor: pointer;
    }
    .project-link:hover { color: var(--accent-dk); border-color: var(--accent); }
    .tech-stack { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1rem; }
    .tech-badge {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.68rem; color: var(--muted);
      border: 1px solid var(--border); border-radius: 4px;
      padding: 2px 7px;
    }

    /* About */
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
    @media (max-width: 640px) { .about-grid { grid-template-columns: 1fr; } }
    .about-text p { font-size: 0.97rem; color: var(--muted); line-height: 1.8; margin-bottom: 1rem; }
    .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
    .skill-item {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; padding: 0.65rem 0.9rem;
      display: flex; align-items: center; gap: 8px;
      font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem;
      transition: border-color 0.2s;
    }
    .skill-item:hover { border-color: var(--accent); }
    .skill-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

    /* Resume */
    .resume-section { margin-bottom: 2.5rem; }
    .resume-section h3 {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.8rem; color: var(--accent-dk);
      letter-spacing: 0.1em; text-transform: uppercase;
      margin-bottom: 1rem; padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }
    .resume-item { margin-bottom: 1.5rem; }
    .resume-item-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.25rem; }
    .resume-item-header h4 { font-size: 1rem; font-weight: 600; }
    .resume-date { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; color: var(--muted); }
    .resume-company { font-size: 0.88rem; color: var(--accent-dk); margin-bottom: 0.4rem; }
    .resume-item p { font-size: 0.88rem; color: var(--muted); line-height: 1.7; }

    /* Stats */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2.5rem; }
    .stat-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 1.5rem;
      text-align: center;
      transition: border-color 0.2s, transform 0.2s;
    }
    .stat-card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .stat-value {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 2.2rem; font-weight: 600;
      color: var(--accent-dk); display: block; margin-bottom: 0.25rem;
    }
    .stat-label { font-size: 0.82rem; color: var(--muted); }
    .lang-bar-row { margin-bottom: 0.85rem; }
    .lang-bar-label { display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; margin-bottom: 5px; }
    .lang-bar-track { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
    .lang-bar-fill { height: 100%; border-radius: 4px; background: var(--accent); transition: width 1s cubic-bezier(.22,.68,0,1.2); }

    /* Contact */
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
    @media (max-width: 640px) { .contact-grid { grid-template-columns: 1fr; } }
    .contact-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    .form-label { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; color: var(--muted); letter-spacing: 0.05em; }
    .form-input, .form-textarea {
      background: var(--surface); border: 1px solid var(--border);
      color: var(--text); border-radius: 8px;
      padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
      outline: none; transition: border-color 0.2s;
      width: 100%;
    }
    .form-input:focus, .form-textarea:focus { border-color: var(--accent); }
    .form-textarea { min-height: 130px; resize: vertical; }
    .social-links { display: flex; flex-direction: column; gap: 0.75rem; }
    .social-link {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border-radius: 10px;
      border: 1px solid var(--border); background: var(--surface);
      font-size: 0.9rem; cursor: pointer; transition: border-color 0.2s;
      text-decoration: none; color: var(--text);
    }
    .social-link:hover { border-color: var(--accent); }
    .social-icon { font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--accent-dk); width: 60px; }
    .status-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(74,222,128,0.12); color: var(--accent-dk);
      border: 1px solid rgba(74,222,128,0.3);
      border-radius: 100px; padding: 5px 14px;
      font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease infinite; }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }

    /* Footer */
    .footer {
      border-top: 1px solid var(--border);
      padding: 2rem 2.5rem;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 1rem;
    }
    .footer-mono { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; color: var(--muted); }

    /* Code block */
    .code-block {
      background: var(--code-bg); border-radius: 10px;
      padding: 1.25rem 1.5rem; margin: 1.5rem 0;
      font-family: 'IBM Plex Mono', monospace; font-size: 0.82rem;
      color: var(--code-text); line-height: 1.7; overflow-x: auto;
      border: 1px solid #1e2230;
    }
    .code-comment { color: #4a5568; }
    .code-key { color: #60a5fa; }
    .code-str { color: #4ADE80; }
  `}</style>
);

// ── Typing animation hook ────────────────────────────────────────────────────
function useTyping(phrases, speed = 60, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(i => i + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(i => i - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % phrases.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return display;
}

// ── Pages ────────────────────────────────────────────────────────────────────

function HomePage({ navigate }) {
  const typed = useTyping([
    "I build things for the web.",
    "I love clean, fast interfaces.",
    "I enjoy shipping impacful code.",
    "Using data for good.",
  ]);

  const featuredProjects = [
    { tag: "AI Data Project", name: "Leveraging AI for Improved Public Transit", desc: "Cleaned Lane Transit data and created an AI forecasting model to come up with insights for ridership and maintenance.", stack: ["Python", "SQL", "GCP"] },
    { tag: "Full Stack", name: "Products Inventory Project", desc: "A project for my 2025 internship where I created a scalable products dashboard for different teams projects.", stack: ["React", "C#", "MS SQL Server"] },
    { tag: "AI Full Stack", name: "NoteIt", desc: "An AI calendar application that could take a prompt and manipulate a calendar using the OpenAI API", stack: ["JavaScript", "HTML/CSS"] },
  ];

  return (
    <div className="page dot-bg">
      <div className="hero">
        <div className="hero-eyebrow fade-in">Hey, I'm</div>
        <h1 className="fade-in fade-in-delay-1">
          <span className="name">Zach Benedetti</span><br />Software Engineer
        </h1>
        <div className="typing-line fade-in fade-in-delay-2">
          {typed}<span className="typing-cursor" />
        </div>
        <p className="hero-desc fade-in fade-in-delay-3">
          I'm a full-stack engineer who cares about writing impactful code 
          to create a greater impact on the world. Based in Portland, OR.
        </p>
        <div className="btn-row fade-in fade-in-delay-4">
          <button className="btn-primary" onClick={() => navigate("projects")}>View my work</button>
          <button className="btn-secondary" onClick={() => navigate("contact")}>Get in touch</button>
        </div>
      </div>

      <div className="section">
        <div className="section-label fade-in">Featured Projects</div>
        <h2 className="fade-in">Things I've built</h2>
        <div className="projects-grid">
          {featuredProjects.map((p, i) => (
            <div className="project-card fade-in" key={p.name} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="project-tag">{p.tag}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="tech-stack">{p.stack.map(t => <span className="tech-badge" key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="code-block" style={{ maxWidth: 860, margin: "0 auto 4rem", marginLeft: "2.5rem", marginRight: "2.5rem" }}>
        <span className="code-comment">// my current stack</span>{"\n"}
        <span className="code-key">const</span> stack = {"{"}{"\n"}
        {"  "}<span className="code-key">frontend</span>: [<span className="code-str">"React"</span>, <span className="code-str">"JavaScript"</span>, <span className="code-str">"Tailwind"</span>],{"\n"}
        {"  "}<span className="code-key">backend</span>:  [<span className="code-str">"C#"</span>, <span className="code-str">"Python"</span>, <span className="code-str">"SQL"</span>],{"\n"}
        {"  "}<span className="code-key">tooling</span>:  [<span className="code-str">"Vite"</span>, <span className="code-str">"GCP"</span>, <span className="code-str">"GitHub"</span>],{"\n"}
        {"  "}<span className="code-key">currently</span>: <span className="code-str">"trying to evolve my career"</span>,{"\n"}
        {"}"}
      </div>

      <footer className="footer">
        <span className="footer-mono">zach.benedetti © 2026</span>
        <span className="footer-mono">built with React</span>
      </footer>
    </div>
  );
}

function ProjectsPage() {
  const projects = [
    { tag: "AI Data Project", name: "Leveraging AI for Improved Public Transit", desc: "Cleaned Lane Transit data and created an AI forecasting model to come up with insights for ridership and maintenance.", stack: ["Python", "SQL", "GCP"] },
    { tag: "Full Stack", name: "Products Inventory Project", desc: "A project for my 2025 internship where I created a scalable products dashboard for different teams projects.", stack: ["React", "C#", "MS SQL Server"] },
    { tag: "AI Full Stack", name: "NoteIt", desc: "An AI calendar application that could take a prompt and manipulate a calendar using the OpenAI API", stack: ["JavaScript", "HTML/CSS"] },
    { tag: "Website", name: "Personal Website", desc: "This Website!", stack: ["React", "Vite", "Tailwind CSS"] },
    { tag: "Database", name: "Gearloop Mock Database", desc: "A consignor retail based mock database with a client side front end used to interact with it.", stack: ["HTML/CSS", "SQL", "RESTful APIs"] },
  ];

  return (
    <div className="page">
      <div className="section">
        <div className="section-label fade-in">Work</div>
        <h2 className="fade-in">Projects</h2>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div className="project-card fade-in" key={p.name} style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="project-tag">{p.tag}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="tech-stack">{p.stack.map(t => <span className="tech-badge" key={t}>{t}</span>)}</div>
              <div className="project-links">
                <button className="project-link">↗ Demo</button>
                <button className="project-link">⌥ GitHub</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const skills = ["Python", "React", "C#", "SQL", "JavaScript", "HTML/CSS", "C/C++"];

  return (
    <div className="page">
      <div className="section">
        <div className="section-label fade-in">Me</div>
        <h2 className="fade-in">About</h2>
        <div className="about-grid">
          <div className="about-text fade-in">
            <p>Hey! I'm Zach — a software engineer based in Portland, OR with experience building web applications that people actually enjoy using.</p>
            <p>I started coding in college building tiny tools to automate things I found tedious, and somewhere along the way it turned into a career. I've worked at a mid-size workers compensation insurance company, a student led startup, and I'm starting an internship with a riflescope company this summer.</p>
            <p>Outside of work I am very active in different sports and activities and I like meeting new people.</p>
            <p style={{ marginTop: "1.5rem" }}>
              <button className="btn-primary" style={{ fontSize: "0.8rem", padding: "8px 18px" }}>Download Resume ↓</button>
            </p>
          </div>
          <div className="fade-in fade-in-delay-1">
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Tech I work with</p>
            <div className="skills-grid">
              {skills.map((s, i) => (
                <div className="skill-item fade-in" key={s} style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                  <span className="skill-dot" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumePage() {
  return (
    <div className="page">
      <div className="section">
        <div className="section-label fade-in">CV</div>
        <h2 className="fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          Resume
          <button className="btn-secondary" style={{ fontSize: "0.78rem", padding: "7px 16px" }}>Download PDF ↓</button>
        </h2>

        <div className="resume-section fade-in">
          <h3>Experience</h3>
          {[
            { title: "Data Engineer Intern", company: "Leupold + Stevens", date: "Jun. 2026 – Dec. 2026", desc: "Managing and aggregating manufacturing data to feed into an AI RAG tool for data insights." },
            { title: "Software Development Engineer Intern", company: "SAIF Corporation", date: "Apr. 2025 – Sep. 2025", desc: "Full-stack software engineer building React based applications and building RESTful APIs." },
            { title: "Student Software Engineer", company: "VCrypt Financial", date: "Feb. 2024 - Aug. 2024", desc: "Worked on a React.js based website as the lead web developer for a small student-led startup." },
          ].map(j => (
            <div className="resume-item" key={j.title}>
              <div className="resume-item-header">
                <h4>{j.title}</h4>
                <span className="resume-date">{j.date}</span>
              </div>
              <div className="resume-company">{j.company}</div>
              <p>{j.desc}</p>
            </div>
          ))}
        </div>

        <div className="resume-section fade-in fade-in-delay-1">
          <h3>Education</h3>
          <div className="resume-item">
            <div className="resume-item-header">
              <h4>B.S. Computer Science</h4>
              <span className="resume-date">2022 – 2026</span>
            </div>
            <div className="resume-company">Oregon State University</div>
          </div>
        </div>

        <div className="resume-section fade-in fade-in-delay-2">
          <h3>Skills</h3>
          <div className="tech-stack" style={{ marginTop: "0.5rem" }}>
            {["TypeScript", "JavaScript", "React", "Node.js", "Go", "Python", "PostgreSQL", "Redis", "Docker", "AWS", "GitHub Actions", "Figma"].map(s => (
              <span className="tech-badge" key={s}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 300); }, []);

  const langs = [
    { name: "React.js/JS", pct: 45 },
    { name: "C#",          pct: 22 },
    { name: "Python",      pct: 18 },
    { name: "CSS",         pct: 10 },
    { name: "SQL",         pct: 5  },
  ];

  const stats = [
    { value: "6",              label: "Years since first programming class" },
    { value: "4",              label: "Passion projects finished" },
    { value: "17",             label: "CS Classes Taken" },
    { value: "200+",           label: "Hours in VS Code" },
    { value: "June 13, 2026!", label: "Graduation Date" },
    { value: "1000+",          label: "Git Commits" },
  ];

  return (
    <div className="page">
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "5rem 2.5rem" }}>

        {/* Header */}
        <div className="section-label fade-in">Metrics</div>
        <h2 className="fade-in" style={{ fontSize: "1.9rem", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "3rem" }}>
          Stats & Dashboard
        </h2>

        {/* Stat cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "4rem"
        }}>
          {stats.map((s, i) => (
            <div
              className="stat-card fade-in"
              key={s.label}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Languages section */}
        <div className="section-label fade-in">Languages</div>
        <h3 className="fade-in" style={{
          fontSize: "1.2rem", fontWeight: 600,
          marginBottom: "2rem", marginTop: "0.4rem"
        }}>
          Top languages by usage
        </h3>

        {/* Bars — centered, max width, full bleed on mobile */}
        <div style={{ maxWidth: 560, width: "100%" }}>
          {langs.map((l, i) => (
            <div
              className="lang-bar-row fade-in"
              key={l.name}
              style={{ animationDelay: `${i * 0.1}s`, marginBottom: "1.25rem" }}
            >
              <div className="lang-bar-label" style={{ marginBottom: "7px" }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.85rem" }}>
                  {l.name}
                </span>
                <span style={{ color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.85rem" }}>
                  {l.pct}%
                </span>
              </div>
              <div className="lang-bar-track" style={{ height: 10, borderRadius: 6 }}>
                <div
                  className="lang-bar-fill"
                  style={{ width: loaded ? `${l.pct}%` : "0%", borderRadius: 6 }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="page">
      <div className="section">
        <div className="section-label fade-in">Say hi</div>
        <h2 className="fade-in">Contact</h2>
        <div className="status-badge fade-in">
          <span className="status-dot" /> Open to new opportunities
        </div>
        <div className="contact-grid">
          <div className="fade-in">
            {!sent ? (
              <div className="contact-form">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" placeholder="you@email.com" type="email" />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" placeholder="What's on your mind?" />
                </div>
                <button className="btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => setSent(true)}>Send message →</button>
              </div>
            ) : (
              <div style={{ padding: "2rem", background: "var(--surface)", border: "1px solid var(--accent)", borderRadius: 12 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--accent-dk)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>✓ Message sent!</div>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Thanks for reaching out. I'll get back to you within a day or two.</p>
              </div>
            )}
          </div>
          <div className="fade-in fade-in-delay-1">
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>Find me online</p>
            <div className="social-links">
              {[
                { icon: "GitHub", label: "github.com/benedetz", sub: "code & open source" },
                { icon: "LinkedIn", label: "linkedin.com/in/zach-benedetti-ln", sub: "professional" },
                { icon: "Email", label: "zsbenedetti@gmail.com", sub: "best for serious stuff" },
              ].map(s => (
                <div className="social-link" key={s.icon}>
                  <span className="social-icon">{s.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App shell ────────────────────────────────────────────────────────────────
const PAGES = ["home", "projects", "about", "resume", "stats", "contact"];
const PAGE_LABELS = { home: "~/", projects: "projects", about: "about", resume: "resume", stats: "stats", contact: "contact" };

export default function App() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const navigate = (p) => setPage(p);

  return (
    <>
      <GlobalStyles />
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate("home")}>
          zach.benedetti <span className="cursor" />
        </div>
        <div className="nav-links">
          {PAGES.filter(p => p !== "home").map(p => (
            <button key={p} className={`nav-link${page === p ? " active" : ""}`} onClick={() => navigate(p)}>
              {PAGE_LABELS[p]}
            </button>
          ))}
          <button
            className={`dark-toggle${dark ? " on" : ""}`}
            onClick={() => setDark(d => !d)}
            title="Toggle dark mode"
          />
        </div>
      </nav>

      {page === "home"     && <HomePage navigate={navigate} />}
      {page === "projects" && <ProjectsPage />}
      {page === "about"    && <AboutPage />}
      {page === "resume"   && <ResumePage />}
      {page === "stats"    && <StatsPage />}
      {page === "contact"  && <ContactPage />}
    </>
  );
}