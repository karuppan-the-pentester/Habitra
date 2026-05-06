/* Shared header, footer, logo — used across all pages */

const { useState, useEffect, useRef } = React;

// Animated Habitra logo: 7-week-dot ring forming an "H" cue
function HabitraLogo({ size = 32, animated = true }) {
  return (
    <div style={{
      width: size, height: size,
      position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: size * 0.24,
      background: "linear-gradient(135deg, #7aa5e8 0%, #5d8ad8 100%)",
      boxShadow: animated
        ? "0 4px 16px oklch(0.65 0.17 250 / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.18)"
        : "inset 0 1px 0 oklch(1 0 0 / 0.18)",
      overflow: "hidden",
    }}>
      {/* week-dot constellation forming an H */}
      <svg viewBox="0 0 32 32" width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        {/* left column of dots */}
        {[8, 14, 20, 24].map((y, i) => (
          <circle key={"l" + i} cx="10" cy={y} r="1.6" fill="white" opacity={0.35 + i * 0.18}>
            {animated && (
              <animate attributeName="opacity"
                values={`${0.35 + i * 0.18};1;${0.35 + i * 0.18}`}
                dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            )}
          </circle>
        ))}
        {/* right column */}
        {[8, 14, 20, 24].map((y, i) => (
          <circle key={"r" + i} cx="22" cy={y} r="1.6" fill="white" opacity={0.35 + i * 0.18}>
            {animated && (
              <animate attributeName="opacity"
                values={`${0.35 + i * 0.18};1;${0.35 + i * 0.18}`}
                dur="3.2s" begin={`${i * 0.4 + 0.2}s`} repeatCount="indefinite" />
            )}
          </circle>
        ))}
        {/* H crossbar */}
        <rect x="11" y="15.2" width="10" height="1.6" rx="0.8" fill="white" />
      </svg>
    </div>
  );
}

function NavBar({ active }) {
  const [open, setOpen] = useState(false);
  const items = [
    { href: "features.html", label: "Features", key: "features" },
    { href: "gallery.html", label: "Gallery", key: "gallery" },
    { href: "roadmap.html", label: "Roadmap", key: "roadmap" },
    { href: "faq.html", label: "FAQ & Contact", key: "faq" },
  ];

  function toggleTheme() {
    const isLight = document.documentElement.classList.toggle("light");
    localStorage.setItem("habitra_theme", isLight ? "light" : "dark");
    window.postMessage({ type: "habitra-theme-changed", light: isLight }, "*");
  }

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="index.html">
            <HabitraLogo size={32} />
            <span className="brand-name">Habitra</span>
          </a>
          <div className="nav-links">
            {items.map(it => (
              <a key={it.key}
                 className={`nav-link ${active === it.key ? "active" : ""}`}
                 href={it.href}>{it.label}</a>
            ))}
          </div>
          <div className="nav-cta">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
            <a className="btn primary" href="index.html#preview">
              Try demo
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
            <button className="mobile-menu-btn" onClick={() => setOpen(o => !o)} aria-label="Menu">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {open
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-drawer ${open ? "open" : ""}`}>
        {items.map(it => (
          <a key={it.key} href={it.href} className={active === it.key ? "active" : ""}>{it.label}</a>
        ))}
      </div>
    </>
  );
}

function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <HabitraLogo size={36} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: "var(--fg)" }}>Habitra</div>
                <div className="kicker">Habit tracker</div>
              </div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, maxWidth: "32ch", margin: 0 }}>
              Make a habit. We track it. A quiet, precise tracker that stays out of your way.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="features.html">Features</a></li>
              <li><a href="gallery.html">Gallery</a></li>
              <li><a href="roadmap.html">Roadmap</a></li>
              <li><a href="index.html#preview">Live demo</a></li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="faq.html#contact">Contact</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Self-host guide</a></li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li><a href="https://github.com/karuppan-the-pentester/habitra-web">GitHub</a></li>
              <li><a href="#">X / Twitter</a></li>
              <li><a href="#">Discord</a></li>
              <li><a href="mailto:hi@habitra.app">hi@habitra.app</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-copy">
          <span>© 2026 Habitra. All rights reserved.</span>
          <span>v0.9.0 · made with care</span>
        </div>
      </div>
    </footer>
  );
}

// Reveal-on-scroll observer
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

Object.assign(window, { HabitraLogo, NavBar, SiteFooter, useReveal });
