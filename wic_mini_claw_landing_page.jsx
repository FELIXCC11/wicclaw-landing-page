import React from "react";

const MINI_BOX_SRC = "data:image/webp;base64,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";

const orange = "#ff8800";
const pale = "#fce7cd";

const heroWords = ["CONNECT", "PAIR", "AUTOMATE", "MONITOR", "REPORT", "QUOTE", "SCHEDULE", "PROMOTE", "CONTROL", "SCALE"];

const flow = [
  { title: "Plug in", text: "Power the mini box and connect it to internet." },
  { title: "Scan QR", text: "Pair the device to the business owner on Telegram." },
  { title: "Give commands", text: "Use Telegram to request quotes, promos, reports, or status." },
  { title: "Run safely", text: "Validation and permissions check every task before dispatch." },
  { title: "Track results", text: "Heartbeat, queue state, and task results stay visible." },
];

const productCards = [
  {
    name: "WICMINI Core",
    price: "Early access",
    components: ["Mini AI agent box", "Telegram bot pairing", "Heartbeat monitoring", "Device registry", "Queue polling", "Agent-first dispatch"],
    info: "The starter WicClaw deployment for one local business. Built for simple onboarding, status checks, and daily business workflows from Telegram.",
    cta: "Request pilot",
  },
  {
    name: "WICMINI Fleet",
    price: "Multi-device",
    components: ["Multiple mini devices", "Master control server", "Business workflow routing", "Result tracking", "Fallback device queue", "Remote operations view"],
    info: "For running several business locations or multiple client deployments from one master control layer.",
    cta: "Plan fleet",
  },
];

const quotes = [
  "Plug it in, scan once, and the business has an AI operator.",
  "Telegram is the dashboard. The mini is the worker. The server is the brain.",
  "Designed for local businesses that need outcomes, not another software login.",
  "Every command is checked before execution. Control stays visible.",
  "One mini per business. One control layer for the whole network.",
];

function runContentTests() {
  console.assert(MINI_BOX_SRC.startsWith("data:image/webp;base64,"), "Mini box image must be embedded as a data URL.");
  console.assert(flow.length === 5, "Expected five flow steps.");
  console.assert(productCards.length >= 2, "Expected at least two WicMini product cards.");
  console.assert(productCards.every((card) => card.components.length >= 5), "Each product card needs five or more capability bullets.");
  console.assert(heroWords.includes("AUTOMATE") && heroWords.includes("CONTROL"), "Hero marquee must explain the WicClaw value.");
}

if (typeof window !== "undefined") {
  runContentTests();
}

function Arrow() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M16.4181 1.47272L13.7747 1.48207L13.7747 11.9065L2.4068 0.538636L0.538621 2.40681L11.9065 13.7747L1.47271 13.784L1.47271 16.4181H16.4181V1.47272Z" fill="currentColor" />
    </svg>
  );
}

function Logo({ light = false }) {
  return (
    <div className="wc-logo" aria-label="WicClaw">
      <span className="wc-mark" style={{ backgroundColor: light ? "#fff" : orange }} />
      <span style={{ color: light ? "#fff" : orange }}>WIC</span>
      <span style={{ color: light ? "#fff" : "#121212" }}>CLAW</span>
    </div>
  );
}

function GridFrame({ children, className = "" }) {
  return <section className={`wc-grid-frame ${className}`}>{children}</section>;
}

function SectionBar({ children }) {
  return (
    <div className="wc-section-bar">
      <span className="wc-dot" />
      <span>{children}</span>
    </div>
  );
}

function ProductCard({ card }) {
  return (
    <div className="wc-product-card" data-testid="product-card">
      <div className="wc-product-image-block">
        <div className="wc-product-title">{card.name}</div>
        <div className="wc-image-stage">
          <img src={MINI_BOX_SRC} alt={`${card.name} mini box`} />
          <div className="wc-play">▶</div>
        </div>
        <div className="wc-thumbs">
          <span className="active" />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="wc-components-block">
        <div className="wc-column-title">Components</div>
        <ul>
          {card.components.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="wc-price">{card.price}</div>
      </div>

      <div className="wc-info-block">
        <div className="wc-column-title filled">Info</div>
        <p>{card.info}</p>
        <button type="button" className="wc-soft-button">
          <span>{card.cta}</span>
          <Arrow />
        </button>
        <a href="#contact" className="wc-link-row">
          <span>See deployment flow</span>
          <Arrow />
        </a>
      </div>
    </div>
  );
}

export default function WicMiniClawLandingPage() {
  return (
    <main className="wc-page">
      <style>{`
        :root { --wc-orange: ${orange}; --wc-pale: ${pale}; --wc-gray: #777; --wc-black: #111; }
        * { box-sizing: border-box; }
        .wc-page { min-height: 100vh; background: #fff; color: var(--wc-black); font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: -0.02em; }
        .wc-pixel { font-family: "Courier New", ui-monospace, monospace; font-weight: 900; letter-spacing: -0.06em; text-transform: uppercase; }
        .wc-nav { position: fixed; z-index: 50; top: 0; left: 0; width: 100%; height: 8vh; min-height: 58px; display: grid; grid-template-columns: 8.9vw 1fr 8.9vw; background: #fff; border-bottom: 1px solid var(--wc-pale); }
        .wc-nav-side, .wc-nav-main, .wc-nav-end { border-right: 1px solid var(--wc-pale); display: flex; align-items: center; justify-content: center; }
        .wc-nav-main { display: grid; grid-template-columns: 1fr 1fr 1fr; }
        .wc-menu-icon { width: 24px; height: 14px; position: relative; }
        .wc-menu-icon::before, .wc-menu-icon::after { content: ""; position: absolute; left: 0; right: 0; height: 2px; background: var(--wc-orange); }
        .wc-menu-icon::before { top: 2px; } .wc-menu-icon::after { bottom: 2px; }
        .wc-nav-links { display: flex; justify-content: flex-end; gap: 2vw; padding-right: 2vw; color: var(--wc-orange); font-size: clamp(10px, 0.78vw, 14px); }
        .wc-nav-links a, .wc-link-row { color: var(--wc-orange); text-decoration: none; }
        .wc-logo { display: inline-flex; align-items: center; justify-content: center; gap: 0.18em; font-family: Arial Black, Impact, sans-serif; font-size: clamp(18px, 2.1vw, 34px); line-height: 1; letter-spacing: -0.12em; }
        .wc-mark { width: 0.8em; height: 0.8em; display: inline-block; box-shadow: inset 0 0 0 0.22em #fff; border: 0.18em solid currentColor; color: var(--wc-orange); }
        .wc-grid-frame { position: relative; border-bottom: 1px solid var(--wc-pale); min-height: 12vw; padding-left: 7.55vw; padding-right: 7.55vw; }
        .wc-grid-frame::before { content: ""; position: absolute; inset: 0 7.55vw; pointer-events: none; background-image: linear-gradient(to right, var(--wc-pale) 1px, transparent 1px), linear-gradient(to bottom, var(--wc-pale) 1px, transparent 1px); background-size: 33.333% 100%, 100% 100%; background-position: 0 0; opacity: 0.95; }
        .wc-grid-frame > * { position: relative; z-index: 1; }
        .wc-hero-spacer { height: 15vw; min-height: 120px; }
        .wc-hero-title-row { min-height: 4.2vw; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 0; }
        .wc-hero-title { color: var(--wc-orange); font-size: clamp(30px, 3.7vw, 72px); line-height: 0.95; font-family: Arial Black, Impact, sans-serif; letter-spacing: -0.08em; }
        .wc-marquee { overflow: hidden; background: var(--wc-orange); color: white; white-space: nowrap; }
        .wc-marquee-track { display: flex; width: max-content; animation: wc-marquee 32s linear infinite; }
        .wc-marquee span { display: inline-block; padding: 0 0.35vw; font-size: clamp(30px, 4vw, 76px); line-height: 1; }
        @keyframes wc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .wc-intro { min-height: 23vw; padding-top: 4vw; }
        .wc-kicker { color: var(--wc-orange); font-size: clamp(13px, 1.35vw, 24px); line-height: 1.25; max-width: 44vw; }
        .wc-actions { display: flex; gap: 4vw; align-items: center; margin-top: 3.8vw; }
        .wc-outline-button, .wc-soft-button { border: 1px solid var(--wc-orange); color: var(--wc-orange); background: #fff; display: inline-flex; align-items: center; justify-content: space-between; gap: 2vw; padding: 0.85vw 1.6vw; font-family: inherit; font-size: clamp(12px, 1vw, 16px); cursor: pointer; transition: 0.25s ease; text-decoration: none; }
        .wc-outline-button:hover, .wc-soft-button:hover { background: var(--wc-orange); color: #fff; }
        .wc-text-link { color: var(--wc-orange); text-decoration: underline; text-underline-offset: 3px; font-size: clamp(12px, 1vw, 16px); }
        .wc-manifesto { min-height: 56.25vw; display: flex; align-items: center; }
        .wc-circle { position: absolute; right: 9vw; top: 50%; transform: translateY(-50%); width: 48vw; height: 48vw; border: 1px solid var(--wc-pale); border-radius: 999px; z-index: 0; }
        .wc-manifesto p { max-width: 58vw; font-size: clamp(24px, 1.95vw, 42px); line-height: 1.36; color: #777; }
        .wc-orange-word { color: var(--wc-orange); font-weight: 900; }
        .wc-signature { position: absolute; left: 55vw; bottom: 5vw; color: #777; }
        .wc-product-hero { min-height: 54vw; overflow: hidden; display: flex; align-items: center; justify-content: flex-end; }
        .wc-product-hero img { width: min(72vw, 1100px); height: auto; object-fit: contain; transform: translateX(8vw); filter: drop-shadow(0 24px 40px rgba(0,0,0,0.12)); }
        .wc-floating-note { position: absolute; left: 7.55vw; top: 8vw; color: var(--wc-orange); width: 20vw; border-left: 4px solid var(--wc-orange); padding-left: 1.3vw; font-size: clamp(14px, 1.05vw, 18px); line-height: 1.55; }
        .wc-section-bar { height: 3vw; min-height: 42px; width: 30%; display: flex; align-items: center; gap: 1vw; background: var(--wc-orange); color: #fff; padding: 0 2vw; font-size: clamp(12px, 1vw, 16px); }
        .wc-dot { display: block; width: 0.38vw; height: 0.38vw; min-width: 6px; min-height: 6px; background: #fff; }
        .wc-heading-row { min-height: 15vw; display: grid; grid-template-columns: 2fr 1fr; gap: 2vw; align-items: start; padding-top: 2vw; }
        .wc-heading-row h2 { margin: 0; color: var(--wc-orange); font-family: Arial Black, Impact, sans-serif; font-size: clamp(34px, 3.5vw, 72px); line-height: 0.95; letter-spacing: -0.08em; }
        .wc-heading-row p { margin: 0; color: #777; font-size: clamp(13px, 1vw, 17px); line-height: 1.65; }
        .wc-flow { display: grid; grid-template-columns: repeat(5, 1fr); border-top: 1px solid var(--wc-pale); border-bottom: 1px solid var(--wc-pale); }
        .wc-flow-step { min-height: 16vw; padding: 1.4vw; border-right: 1px solid var(--wc-pale); display: flex; flex-direction: column; justify-content: space-between; }
        .wc-flow-step:last-child { border-right: 0; }
        .wc-flow-step strong { color: var(--wc-orange); font-size: clamp(18px, 1.5vw, 30px); text-transform: uppercase; font-family: "Courier New", monospace; letter-spacing: -0.06em; }
        .wc-flow-step p { color: #777; line-height: 1.55; font-size: clamp(12px, 0.85vw, 16px); }
        .wc-number { color: var(--wc-orange); font-size: clamp(26px, 3vw, 58px); font-family: Arial Black, Impact, sans-serif; }
        .wc-products-wrap { background: #fff; }
        .wc-product-card { margin: 0 7.55vw; display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid var(--wc-pale); }
        .wc-product-image-block, .wc-components-block, .wc-info-block { border-left: 1px solid var(--wc-pale); border-right: 1px solid var(--wc-pale); min-height: 28vw; display: flex; flex-direction: column; }
        .wc-product-title, .wc-column-title { height: 3vw; min-height: 42px; display: flex; align-items: center; padding: 0 1vw; font-family: "Courier New", monospace; font-weight: 900; color: #fff; background: var(--wc-orange); font-size: clamp(17px, 1.55vw, 28px); letter-spacing: -0.08em; }
        .wc-column-title { color: var(--wc-orange); background: #fff; border-bottom: 1px solid var(--wc-pale); }
        .wc-column-title.filled { color: #fff; background: var(--wc-orange); }
        .wc-image-stage { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; background: #fff; padding: 1.5vw; }
        .wc-image-stage img { width: 92%; height: auto; object-fit: contain; }
        .wc-play { position: absolute; left: 1vw; bottom: 1vw; color: var(--wc-orange); font-size: clamp(18px, 1.4vw, 30px); }
        .wc-thumbs { height: 3vw; min-height: 42px; border-top: 1px solid var(--wc-pale); display: flex; align-items: center; gap: 0.7vw; padding: 0 1vw; }
        .wc-thumbs span { width: 0.55vw; height: 0.55vw; min-width: 8px; min-height: 8px; border: 1px solid var(--wc-pale); display: block; }
        .wc-thumbs span.active { background: var(--wc-orange); border-color: var(--wc-orange); }
        .wc-components-block ul { margin: 0; padding: 1.3vw 1.6vw; flex: 1; color: var(--wc-orange); font-size: clamp(12px, 0.9vw, 16px); line-height: 1.65; }
        .wc-components-block li { margin-bottom: 0.35vw; }
        .wc-price { height: 3vw; min-height: 46px; border-top: 1px solid var(--wc-pale); color: var(--wc-orange); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: clamp(18px, 1.6vw, 30px); }
        .wc-info-block p { flex: 1; display: flex; align-items: center; color: var(--wc-orange); padding: 1.3vw; line-height: 1.7; font-size: clamp(12px, 0.9vw, 16px); }
        .wc-soft-button { width: 100%; height: 3vw; min-height: 46px; border-left: 0; border-right: 0; border-bottom: 0; background: rgba(255,136,0,0.14); }
        .wc-link-row { height: 3vw; min-height: 46px; display: flex; align-items: center; justify-content: space-between; padding: 0 1vw; border-top: 1px solid var(--wc-pale); font-size: clamp(12px, 0.82vw, 14px); }
        .wc-quotes { overflow: hidden; border-top: 1px solid var(--wc-pale); border-bottom: 1px solid var(--wc-pale); padding: 2vw 0; }
        .wc-quote-track { display: flex; gap: 1vw; width: max-content; animation: wc-marquee 48s linear infinite; }
        .wc-quote-card { width: 18vw; min-width: 220px; height: 12vw; min-height: 150px; flex-shrink: 0; border: 1px solid var(--wc-pale); display: flex; flex-direction: column; justify-content: space-between; background: #fff; }
        .wc-quote-card p { margin: 0; padding: 1vw; color: var(--wc-orange); line-height: 1.5; }
        .wc-quote-card footer { border-top: 1px solid var(--wc-pale); color: #777; height: 3vw; min-height: 42px; display: flex; align-items: center; padding: 0 1vw; }
        .wc-contact { margin: 0 7.55vw; border: 1px solid rgba(255,136,0,0.35); }
        .wc-contact a { display: flex; min-height: 13vw; align-items: center; justify-content: center; text-decoration: none; color: var(--wc-orange); font-family: Arial Black, Impact, sans-serif; font-size: clamp(48px, 6vw, 120px); letter-spacing: -0.08em; transition: 0.25s ease; }
        .wc-contact a:hover { background: var(--wc-orange); color: #fff; }
        .wc-footer { background: var(--wc-orange); color: #fff; padding: 3vw 7.55vw; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2vw; font-size: clamp(12px, 0.8vw, 14px); line-height: 1.8; }
        .wc-footer a { color: #fff; text-decoration: none; }
        @media (max-width: 900px) {
          .wc-nav { grid-template-columns: 20% 60% 20%; height: 7vh; }
          .wc-nav-main { grid-template-columns: 1fr; }
          .wc-nav-links { display: none; }
          .wc-hero-spacer { height: 15vh; }
          .wc-grid-frame { padding-left: 6vw; padding-right: 6vw; }
          .wc-grid-frame::before { inset: 0; background-size: 20% 100%, 100% 25%; }
          .wc-hero-title-row { display: block; padding-top: 7vh; min-height: 52vh; }
          .wc-hero-title { font-size: 12vw; margin-bottom: 6vw; }
          .wc-marquee span { font-size: 10vw; padding: 0 1vw; }
          .wc-kicker { max-width: none; font-size: 4vw; }
          .wc-actions { flex-direction: column; align-items: stretch; gap: 3vw; }
          .wc-outline-button { padding: 3vw 5vw; }
          .wc-manifesto { min-height: auto; padding: 16vw 6vw; }
          .wc-circle { display: none; }
          .wc-manifesto p { max-width: none; font-size: 5vw; }
          .wc-signature { position: static; margin-top: 8vw; }
          .wc-product-hero { min-height: 82vw; justify-content: center; }
          .wc-product-hero img { width: 110vw; transform: none; }
          .wc-floating-note { position: static; width: auto; margin: 10vw 0 0; font-size: 3.6vw; }
          .wc-section-bar { width: 80%; height: 10vw; padding: 0 5vw; }
          .wc-heading-row { display: block; min-height: auto; padding: 8vw 0; }
          .wc-heading-row h2 { font-size: 8vw; margin-bottom: 5vw; }
          .wc-heading-row p { font-size: 3.7vw; }
          .wc-flow { grid-template-columns: 1fr; }
          .wc-flow-step { min-height: auto; padding: 5vw; border-right: 0; border-bottom: 1px solid var(--wc-pale); }
          .wc-product-card { margin: 0; grid-template-columns: 1fr; }
          .wc-product-image-block, .wc-components-block, .wc-info-block { min-height: auto; border-left: 0; border-right: 0; }
          .wc-product-title, .wc-column-title { height: 12vw; padding: 0 5vw; font-size: 5vw; }
          .wc-image-stage { min-height: 62vw; }
          .wc-thumbs, .wc-price, .wc-soft-button, .wc-link-row { height: 11vw; padding: 0 4vw; }
          .wc-components-block ul, .wc-info-block p { padding: 5vw 6vw; font-size: 3.3vw; }
          .wc-contact { margin: 0; }
          .wc-contact a { min-height: 26vw; font-size: 12vw; }
          .wc-footer { grid-template-columns: 1fr; padding: 8vw 6vw; }
        }
      `}</style>

      <nav className="wc-nav">
        <div className="wc-nav-side" title="Menu"><span className="wc-menu-icon" /></div>
        <div className="wc-nav-main">
          <div />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", borderLeft: `1px solid ${pale}`, borderRight: `1px solid ${pale}` }}>
            <Logo />
          </div>
          <div className="wc-nav-links">
            <a href="#flow">How it works</a>
            <a href="#products">Pilots</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="wc-nav-end" style={{ color: orange, fontSize: "12px" }}>AI OS</div>
      </nav>

      <GridFrame className="wc-hero-spacer" />

      <GridFrame className="wc-hero-title-row">
        <h1 className="wc-hero-title">AI mini boxes,<br />built for</h1>
        <div className="wc-marquee wc-pixel" aria-label="WicClaw capabilities">
          <div className="wc-marquee-track">
            {[...heroWords, ...heroWords, ...heroWords].map((word, index) => <span key={`${word}-${index}`}>{word},</span>)}
          </div>
        </div>
      </GridFrame>

      <GridFrame className="wc-intro">
        <p className="wc-kicker">_Plug-and-play AI support for local businesses, controlled through Telegram, powered by a mini device and a master WicClaw control layer.</p>
        <div className="wc-actions">
          <a className="wc-outline-button" href="#contact"><span>Try WicMini Pilot</span><Arrow /></a>
          <a className="wc-text-link" href="#products">See deployments</a>
        </div>
      </GridFrame>

      <GridFrame className="wc-manifesto">
        <div className="wc-circle" />
        <div>
          <p>
            We do not believe in generic AI dashboards. Each WicMini is designed and <span className="wc-orange-word wc-pixel">paired</span> as a <span className="wc-orange-word wc-pixel">business agent</span>, giving owners simple control, reliable automation, and visible execution from Telegram.
          </p>
          <p style={{ marginTop: "3vw" }}>Do not install another tool. <span className="wc-orange-word wc-pixel">Plug it in.</span></p>
        </div>
        <div className="wc-signature"><span style={{ color: orange }}>_</span> WicClaw System</div>
      </GridFrame>

      <GridFrame className="wc-product-hero">
        <div className="wc-floating-note">The PC becomes the mini box: small hardware, always online, remotely monitored, ready for one business or a fleet.</div>
        <img src={MINI_BOX_SRC} alt="Black WicMini AI agent box" />
      </GridFrame>

      <GridFrame><SectionBar>WicMini system</SectionBar></GridFrame>
      <GridFrame className="wc-heading-row">
        <h2>Business automation, without the software burden.</h2>
        <p><strong>WicClaw</strong> combines Telegram control, device heartbeat, queue polling, permissions, and Agent first dispatch. The site concept stays product-first like the reference: grid, orange bars, technical product cards, and direct CTAs.</p>
      </GridFrame>

      <section id="flow" className="wc-flow">
        {flow.map((item, index) => (
          <div className="wc-flow-step" key={item.title}>
            <div className="wc-number">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      <GridFrame><SectionBar>Deployment options</SectionBar></GridFrame>
      <GridFrame className="wc-heading-row">
        <h2>WicMini pilots: ready to place in the field.</h2>
        <p>Product cards are rebuilt from the reference structure: image, components, info, CTA, and detail row. The content is changed from gaming PCs to WicClaw mini deployments.</p>
      </GridFrame>

      <section id="products" className="wc-products-wrap">
        {productCards.map((card) => <ProductCard key={card.name} card={card} />)}
      </section>

      <GridFrame><SectionBar>Field notes</SectionBar></GridFrame>
      <section className="wc-quotes" aria-label="WicClaw notes">
        <div className="wc-quote-track">
          {[...quotes, ...quotes, ...quotes].map((quote, index) => (
            <div className="wc-quote-card" key={`${quote}-${index}`}>
              <p>“{quote}”</p>
              <footer>WicMini concept</footer>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="wc-contact">
        <a href="mailto:hello@wicclaw.ai">Contact us</a>
      </section>

      <footer className="wc-footer">
        <div>
          <Logo light />
          <p style={{ marginTop: "1.5vw" }}>One mini. One business. One control layer.</p>
        </div>
        <div>
          <strong>Contact</strong><br />
          hello@wicclaw.ai<br />
          Telegram-first onboarding
        </div>
        <div>
          <strong>System</strong><br />
          Plug in<br />
          Scan QR<br />
          AI works
        </div>
      </footer>
    </main>
  );
}
