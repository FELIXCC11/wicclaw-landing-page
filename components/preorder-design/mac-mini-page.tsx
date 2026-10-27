"use client";

/* Source imagery uses original responsive crops. */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronRight, Menu, X, Play, ShoppingBag, Search } from "./icons";
import assets from "./assets.json";
import smallAssets from "./assets-small.json";
import "./mac-mini.css";
import { HighlightGallery } from "./highlight-gallery";
import { DesignScene } from "./design-scene";
import { BuyingGallery, EnvironmentSection } from "./buying-sections";

type AssetName = keyof typeof assets;
const assetPath = (filename: string) => filename.startsWith("/") ? filename : `/sites/apple/${filename}`;
const asset = (name: AssetName) => assetPath(assets[name]);
const wicMiniHero = asset("hero_endframe");
function WicMiniHeroImage({ eager = false }: { eager?: boolean }) {
  return <picture className="hero-product">
    <source media="(max-width: 734px)" srcSet={assetPath(smallAssets.hero_endframe)} />
    <source media="(max-width: 1068px)" srcSet="/site/wicclaw/hero_endframe__d9kro8y76v42_medwc.png" />
    <img src={wicMiniHero} alt="Silver WICCLAW Box hardware illustration" loading={eager ? "eager" : "lazy"} />
  </picture>;
}
function Photo({ name, alt = "", className = "", eager = false }: { name: AssetName; alt?: string; className?: string; eager?: boolean }) {
  const small = smallAssets[name as keyof typeof smallAssets];
  const medium = {
    ai_agentic: "/site/wicclaw/Agentic-AI.png",
    ai_apps: "/site/wicclaw/Your-App.png",
    ai_tools: "/site/wicclaw/Yourcontrol.png",
    design_pb: "/site/wicclaw/design_pb__cxvqbmm5dfcm_mediumwc.png",
  }[name as "ai_agentic" | "ai_apps" | "ai_tools" | "design_pb"];
  if (medium && small) return <picture className={className}>
    <source media="(max-width: 734px)" srcSet={assetPath(small)} />
    <source media="(max-width: 1068px)" srcSet={medium} />
    <img src={asset(name)} alt={alt} loading={eager ? "eager" : "lazy"} />
  </picture>;
  return <img className={className} src={asset(name)} srcSet={small ? `${assetPath(small)} 734w, ${asset(name)} 1440w` : undefined} sizes="(max-width: 734px) 350px, 1440px" alt={alt} loading={eager ? "eager" : "lazy"} />;
}
function Intro({ eyebrow, title, children, className = "" }: { eyebrow?: string; title: ReactNode; children?: ReactNode; className?: string }) {
  return <header className={`section-intro reveal ${className}`}>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{children && <p className="intro-copy">{children}</p>}</header>;
}
const performanceTabs = [
  { label: "Accounting", key: "productivity", title: "Your books. Less busywork.", text: "Review transactions, identify missing receipts, organize expenses, and prepare financial summaries with supported accounting software." },
  { label: "Communication", key: "creativity", title: "Your inbox. Under control.", text: "Find important emails, prepare replies, and organize documents while keeping business conversations moving." },
  { label: "Sales", key: "stem", title: "Every opportunity. In motion.", text: "Organize customer information, prepare personalized follow-ups, and keep supported sales records up to date." },
  { label: "Operations", key: "gaming", title: "The little things. Taken care of.", text: "Track deadlines, organize projects, and bring the moving parts of your business together in configured workflows." },
  { label: "Reports", key: "coding", title: "Answers, without the busywork.", text: "Turn business information into useful insights, prepare reports, and spot important trends without hours of spreadsheet work." },
];
const aiTabs = [
  { label: "Agentic AI", image: "ai_agentic", title: "Your AI employee. Ready to work.", text: "Give WICCLAW a task, and let it handle the steps. From reviewing transactions to preparing reports, it is designed to do more than answer questions." },
  { label: "Your Apps", image: "ai_apps", title: "All your tools. Working together.", text: "Bring supported accounting, email, spreadsheet, and business applications into one intelligent workflow without changing the software you already use." },
  { label: "Your Control", image: "ai_tools", title: "You’re always in control.", text: "See what WICCLAW is doing, review its work, and approve sensitive actions before they happen. Intelligence that works with you." },
] as const;
const phoneTabs = [
  { label: "Telegram control", image: "mac_iphone_mirroring", text: "Send tasks and review results through Telegram, the current interface for supported WICCLAW workflows." },
  { label: "Connected tools", image: "mac_iphone_airdrop", text: "Bring approved tools into one configured workflow. Keep your files, services, and business context connected with the permissions you choose." },
  { label: "Work across devices", image: "mac_iphone_clipboard", text: "Start a task from your phone and review the result at your desk. A unified WICCLAW application is planned." },
] as const;
function Tabs({ labels, value, onChange, label }: { labels: readonly string[]; value: number; onChange: (i: number) => void; label: string }) {
  return <div className="tabs" role="tablist" aria-label={label}>{labels.map((text, i) => <button key={text} role="tab" aria-selected={value === i} onClick={() => onChange(i)} onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const next = (i + (e.key === "ArrowRight" ? 1 : -1) + labels.length) % labels.length; onChange(next); (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus(); } }}>{text}</button>)}</div>;
}

export function MacMiniPage() {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(true);
  const [performance, setPerformance] = useState(0);
  const [ai, setAi] = useState(0);
  const [phone, setPhone] = useState(0);
  const [upgrade, setUpgrade] = useState(0);
  const [modal, setModal] = useState<"film" | "specs" | null>(null);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const heroVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) heroVideo.current?.pause();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    let ticking = false;
    const update = () => {
      setSticky(window.scrollY > 700);
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);
  useEffect(() => {
    if (modal) { dialog.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { dialog.current?.close(); document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [modal]);
  const preorder = () => { router.push("/shop/buy-wicclaw"); };

  return <div className="apple-page">
    <Link className="skip-link" href="#main">Skip to content</Link>
    <nav className="global-nav" aria-label="Global navigation">
      <Link href="/" className="wordmark" aria-label="WICCLAW home">wicclaw<span>®</span></Link>
      <div className={`nav-links ${menu ? "open" : ""}`}>
        {[["Overview", "#main"], ["Design", "#design"], ["Applications", "#performance"], ["AI", "#ai"], ["Your workspace", "#macos"], ["Accessories", "#accessories"]].map(([label, href]) => <Link key={label} href={href} onClick={() => setMenu(false)}>{label}</Link>)}
      </div>
      <div className="nav-actions"><button aria-label="Search this page" onClick={() => setSearch(!search)}><Search size={17} /></button><button aria-label="Open bag" onClick={() => { router.push("/shop/bag"); }}><ShoppingBag size={17} /></button><button className="mobile-toggle" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu(!menu)}>{menu ? <X size={20} /> : <Menu size={20} />}</button></div>
    </nav>
    {search && <form className="search-panel" onSubmit={e => { e.preventDefault(); const normalized = query.toLowerCase().replace("applications", "performance"); const section = ["design","performance","ai","macos","accessories"].find(key => normalized.includes(key)); if (section) { document.getElementById(section)?.scrollIntoView({behavior:"smooth"}); setSearch(false); } }}><label htmlFor="page-search">Find a section</label><input id="page-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Design, applications, AI, workspace, accessories" autoFocus /><button type="submit">Search <ChevronRight size={18} /></button></form>}
    <nav className={`local-nav ${sticky ? "visible" : ""}`} aria-label="Product navigation"><Link href="#">WICCLAW Box</Link><div><Link href="#main">Overview</Link><button onClick={() => setModal("specs")}>Tech Specs</button><Link href="#compare">Compare</Link><button className="buy-button small" onClick={preorder}>Preorder</button></div></nav>
    <main id="main">
      <section className="hero">
        <div className="education-ribbon">Meet WICCLAW Box, a compact AI-powered business appliance. <Link href="/shop/buy-wicclaw">Explore <ChevronRight size={12} /></Link></div>
        <div className={`hero-content ${introPlaying ? "intro-playing" : ""}`}>
          <h1>Your business. With more time.</h1><WicMiniHeroImage eager />
          <p className="hero-subtitle">Meet WICCLAW. <span>A compact AI-powered device designed to take everyday work off your hands, from bookkeeping and emails to reports and business operations.</span></p><button className="buy-button" onClick={preorder}>Preorder</button><p className="hero-price"><span>$799 hardware price. </span><span>Reserve for $20 toward the balance.</span></p>
        </div>
        {introPlaying && <video className="hero-entry" ref={heroVideo} src="/site/wicclaw/hf_20261024_051414_3950d08f-8ed2-4549-a0e9-ca75493928e1.mp4" poster={wicMiniHero} autoPlay muted playsInline preload="auto" onEnded={() => setIntroPlaying(false)} onError={() => setIntroPlaying(false)} aria-label="WICCLAW Box opening animation" />}
        <button className="hero-replay" onClick={() => setIntroPlaying(!introPlaying)}>{introPlaying ? "Skip animation" : "Replay"} <Play size={11} /></button>
      </section>
      <HighlightGallery onFilm={() => setModal("film")} />
      <DesignScene />
      <section className="lifestyle"><Photo name="performance_hero_1" alt="Illustrative desktop workspace; display and accessories are not specified as included" /></section>
      <section className="performance-section section-pad" id="performance">
        <Intro eyebrow="Applications" title={<>Made for the <span className="purple">way you work.</span></>}>From accounting and customer relationships to everyday operations, WICCLAW brings intelligent assistance to supported applications your business already relies on.</Intro>
        <div className="display-row reveal">{["left", "middle", "right"].map(position => <div className="display-composite" key={position}><Photo name="performance_hw_display_mac_mini" alt="Illustrative desktop display hardware" /><Photo className="display-screen" name={`performance_screen_${position}` as AssetName} alt="Illustrative desktop workspace screen" /></div>)}</div><p className="caption">Illustrative workspace imagery; displays and software are separate.</p>
        <div className="chip-comparison content-width reveal"><div><span className="spec-badge" aria-hidden="true"><img src="/site/wicclaw/AMD Ryzen 7 and 7735HS Chips 2.png" alt="" /></span><h3>AMD Ryzen 7 7735HS</h3><p className="teal">WICCLAW Box processor</p></div><div><span className="spec-badge" aria-hidden="true"><img src="/site/wicclaw/AMD Ryzen 7 and 7735HS Chips 3.png" alt="" /></span><h3>AMD Radeon 680M</h3><p className="purple">Integrated graphics</p></div></div>
        <div className="performance-gallery content-width"><div className="photo-pair" role="tabpanel" aria-label={performanceTabs[performance].label}><Photo key={`${performance}-1`} name={`performance_${performanceTabs[performance].key}_1` as AssetName} alt={`Illustrative ${performanceTabs[performance].label.toLowerCase()} workspace`} /><Photo key={`${performance}-2`} name={`performance_${performanceTabs[performance].key}_2` as AssetName} alt="Illustrative desktop application screen" /></div><Tabs labels={performanceTabs.map(x => x.label)} value={performance} onChange={setPerformance} label="Business application examples" /><p className="tab-copy"><strong>{performanceTabs[performance].title}</strong><br />{performanceTabs[performance].text}</p></div>
      </section>
      <section className="ai-section section-pad" id="ai">
        <Intro eyebrow="AI" title={<>Built for business. <span className="coral">Powered by intelligence.</span></>}>From managing your books to organizing emails, preparing reports, and keeping daily operations moving, WICCLAW brings AI into the supported tools your business already uses. One compact device, designed to make everyday work simpler.</Intro>
        <div className="ai-gallery content-width"><Photo key={ai} name={aiTabs[ai].image} alt={`Illustrative ${aiTabs[ai].label.toLowerCase()} workspace`} /><Tabs labels={aiTabs.map(x => x.label)} value={ai} onChange={setAi} label="WICCLAW AI showcase" /><p className="tab-copy"><strong>{aiTabs[ai].title}</strong><br />{aiTabs[ai].text}</p></div>
        <Intro className="intelligence-intro" title={<><span className="rainbow">WICCLAW workflows.</span><br />Configured for work.<br />Controlled by you.</>}>Use Telegram to send tasks to a supported, configured workflow and review results. Start with a task that fits your business. A unified WICCLAW application is planned, and any included setup or services must be specified in your written offer.</Intro>
        <p className="center"><Link className="text-link" href="/platform">Explore supported WICCLAW workflows <ChevronRight size={14} /></Link></p>
        <div className="intelligence-grid content-width">
          <article className="intelligence-card full reveal"><Photo name="siri" alt="Illustrative assistant interface, not the current WICCLAW app" /><p><strong>Start with one workflow.</strong> Use a supported, configured task on your WICCLAW Box. Connect only the tools and services your business approves.</p></article>
          <article className="intelligence-card reveal"><Photo name="shortcut" alt="Illustrative workflow automation interface" /><p><strong>Describe the task.</strong> Provide the context your configured workflow needs, then review its output.</p></article>
          <article className="intelligence-card reveal"><Photo name="visual" alt="Illustrative task review interface" /><p><strong>Keep work in view.</strong> Set permissions and review important actions. Available features depend on the workflow in your written offer.</p></article>
        </div>
        <div className="privacy content-width reveal"><Photo name="icon_privacy_apple_intelligence" /><h2>Great powers come<br />with great responsibility.</h2><p>Choose which tools your AI worker can access and review important actions. WICCLAW runs configured agent tools on a dedicated computer; AI models may be hosted by external providers. Your permissions and the services you connect determine how each workflow uses data.</p></div>
      </section>
      <section className="macos-section" id="macos"><Photo name="macos" alt="Illustrative desktop workspace; WICCLAW Box runs Windows 11 Pro" /><div className="macos-copy content-width"><div><p className="eyebrow">Windows 11 Pro</p><h2>Make room for<br /><span className="blue">your work.</span></h2></div><div><p>WICCLAW Box runs Windows 11 Pro. Use compatible desktop and browser apps, keep files on the 1TB NVMe SSD, and connect a compatible 4K UHD display. Displays, software, and connected services are separate unless your written offer says otherwise.</p><Link className="text-link" href="/hardware">Explore WICCLAW Box details <ChevronRight size={14} /></Link></div></div></section>
      <section className="phone-section section-pad" id="iphone"><Intro className="left-intro" eyebrow="WICCLAW + your devices" title={<>Work at your desk.<br /><span className="coral">Check in anywhere.</span></>}>WICCLAW Box stays at your workspace. For supported configurations, Telegram lets you send tasks to a WICCLAW workflow and review results from your phone. The unified WICCLAW application is planned, not included with the hardware preorder.</Intro><div className="content-width phone-gallery"><Photo key={phone} name={phoneTabs[phone].image} alt={`Illustrative ${phoneTabs[phone].label.toLowerCase()} interface`} /><Tabs labels={phoneTabs.map(x => x.label)} value={phone} onChange={setPhone} label="Connected workflows" /><p className="tab-copy">{phoneTabs[phone].text}</p></div></section>
      <section className="accessories-section section-pad" id="accessories"><Intro eyebrow="Accessories" title={<>Complete your <span className="purple">workspace.</span></>}>Connect a compatible 4K UHD display and the input devices that suit your work. Final port compatibility and any accessories included with WICCLAW Box will be confirmed in the hardware details and written offer. Items pictured here are illustrative.</Intro><p className="center"><Link href="/hardware" className="text-link">Review WICCLAW Box hardware details <ChevronRight size={14} /></Link></p><Photo name="accessories" alt="Illustrative display and accessories; not confirmed as included with WICCLAW Box" /></section>
      <section className="upgrade-section section-pad"><Intro title={<>Choose the WICCLAW Box<br />that fits your plans.</>} /><p className="center">Review the current and upcoming configurations:</p><Tabs labels={["WICCLAW Box", "Upcoming WICCLAW Box"]} value={upgrade} onChange={setUpgrade} label="WICCLAW Box configuration details" /><p className="center upgrade-subtitle">{upgrade ? "Upcoming model: pricing and specifications are not yet announced." : "WICCLAW Box: the current $799 hardware preorder."}</p><div className="upgrade-grid content-width"><article><h3>Processor</h3><p className="spec-value">{upgrade ? "To be confirmed" : "AMD Ryzen 7 7735HS"}</p></article><article><h3>Graphics</h3><p className="spec-value">{upgrade ? "To be confirmed" : "Radeon 680M"}</p></article><article><h3>Memory</h3><p className="spec-value">{upgrade ? "To be confirmed" : "16GB LPDDR5"}</p></article><article><h3>Storage and system</h3><p className="spec-value">{upgrade ? "To be confirmed" : "1TB NVMe SSD · Windows 11 Pro"}</p></article></div><div className="trade-in content-width"><h3>Have questions about the current configuration or a future model?</h3><Link className="text-link" href="/contact">Talk to WICCLAW <ChevronRight size={14} /></Link></div></section>
      <BuyingGallery />
      <section className="compare-section section-pad" id="compare"><div className="wide section-heading"><h2>Which WICCLAW Box is right for you?</h2><Link className="text-link" href="/shop/buy-wicclaw">Review WICCLAW Box <ChevronRight size={14} /></Link></div><div className="compare-grid content-width"><article><img src="/site/wicclaw/design_pb__cxvqbmm5dfcm_largewc.png" alt="Illustrative WICCLAW Box hardware view" /><span className="new-label">Current preorder</span><h3>WICCLAW Box</h3><p>Ryzen 7 7735HS · Radeon 680M</p><span className="silver-swatch" /><p>16GB LPDDR5 · 1TB NVMe SSD · Windows 11 Pro</p><p className="price">$799 for 16GB · $20 reservation</p><button className="buy-button" onClick={preorder}>Preorder Core</button><hr /><h4>4K UHD support</h4><p>Wi-Fi included. 24GB LPDDR5 option coming soon; price pending.</p></article><article><div className="compare-placeholder" aria-hidden="true">WICCLAW Box</div><span className="new-label">Coming later</span><h3>Upcoming WICCLAW Box</h3><p>Future hardware configuration</p><p>Specifications and release timing to be confirmed.</p><p className="price">Price pending · Full payment unavailable</p><Link className="buy-button" href="/contact">Ask for updates</Link><hr /><h4>Details to follow</h4><p>Review the published specifications and terms when available.</p></article></div></section>
      <EnvironmentSection />
      <section className="values-section section-pad"><div className="wide"><h2>Our values lead the way.</h2><div className="values-grid">{[["icon_carbon_neutral","Thoughtful by design.","A compact workspace, chosen tools, and clear information about the hardware you use.","/hardware"],["icon_privacy","Your work. Your permissions.","Choose approved tools and review important actions. Understand how connected services use your data.","/privacy"],["icon_accessibility","Built around real people.","Practical workflows, clear guidance, and support for the way your business works.","/help"]].map(([icon,title,text,href]) => <article key={icon}><Photo name={icon as AssetName} /><h3>{title}</h3><p>{text}</p><Link className="text-link" href={href}>Learn more <ChevronRight size={14} /></Link></article>)}</div></div></section>
      <section className="closing-preorder section-pad"><Intro title={<>Less busywork.<br /><span className="teal">More business.</span></>} /><WicMiniHeroImage /><button className="buy-button" onClick={preorder}>Review WICCLAW Box preorder</button></section>
    </main>
    <footer className="site-footer"><div className="wide"><Link className="wordmark" href="/">wicclaw<span>®</span></Link><div className="footer-links"><div><h3>Explore</h3><Link href="#design">Design</Link><Link href="#performance">Applications</Link><Link href="#ai">AI</Link><Link href="#accessories">Accessories</Link></div><div><h3>WICCLAW Box</h3><Link href="/products">Explore configurations</Link><Link href="#compare">Compare WICCLAW Box models</Link><Link href="/platform">Your workspace</Link><Link href="/help">WICCLAW Support</Link></div><div><h3>WICCLAW</h3><button onClick={preorder}>Preorder WICCLAW Box</button><button onClick={() => setModal("specs")}>Core specifications</button><Link href="#highlights">Highlights</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} WICCLAW.</span><Link href="/">WICCLAW home ↗</Link><Link href="#main">Back to top ↑</Link></div></div></footer>
    <dialog ref={dialog} className={`product-dialog ${modal === "film" ? "film-dialog" : ""}`} onCancel={() => setModal(null)} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}><button className="dialog-close" aria-label="Close dialog" onClick={() => setModal(null)}><X /></button>
      {modal === "film" && <><h2>Meet WICCLAW Box.</h2><video src="/site/wicclaw/hf_20261024_051414_3950d08f-8ed2-4549-a0e9-ca75493928e1.mp4" poster={wicMiniHero} controls autoPlay playsInline /><p>WICCLAW Box — the opening film.</p></>}
      {modal === "specs" && <><p className="eyebrow">WICCLAW Box specifications</p><h2>A compact PC for work.</h2><Photo name="design_pb" alt="Illustrative WICCLAW Box hardware view" /><dl><dt>Processor</dt><dd>AMD Ryzen 7 7735HS</dd><dt>Graphics</dt><dd>AMD Radeon 680M</dd><dt>Memory</dt><dd>16GB LPDDR5 standard; 24GB LPDDR5 option coming soon, price pending</dd><dt>Storage</dt><dd>1TB NVMe SSD</dd><dt>Operating system</dt><dd>Windows 11 Pro</dd><dt>Connectivity</dt><dd>Wi-Fi; standard and port layout to be confirmed</dd><dt>Display</dt><dd>4K UHD support with a compatible display</dd><dt>Delivery</dt><dd>Preorder for future delivery; timing to be confirmed</dd></dl><Link href="/hardware" className="text-link">View WICCLAW Box hardware details ↗</Link></>}

    </dialog>
  </div>;
}

