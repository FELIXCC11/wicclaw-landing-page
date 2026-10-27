"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "./icons";
import assets from "./assets.json";
import smallAssets from "./assets-small.json";

const slides = [
  { image: "highlights_mx_endframe", label: "AI desktop", text: "Your AI agent work desktop.\nReady for everyday business tasks." },
  { image: "highlights_apple_intelligence", label: "Workflows", text: "Delegate supported business workflows.\nReview the results. Stay in control." },
  { image: "highlights_design", label: "Design", text: "A compact desk setup.\nFinal port layout and dimensions to be confirmed." },
  { image: "highlights_memory", label: "Storage", text: "16GB LPDDR5 memory. 1TB NVMe SSD. Wi-Fi and 4K UHD display support." },
] as const;
const assetPath = (filename: string) => filename.startsWith("/") ? filename : `/sites/apple/${filename}`;

export function HighlightGallery({ onFilm }: { onFilm: () => void }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const timerBar = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  const programmed = useRef(false);
  const highlightVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = highlightVideo.current;
    if (!video) return;
    if (active === 0 && playing && visible) void video.play().catch(() => {});
    else video.pause();
  }, [active, playing, visible]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Default to a still gallery when the visitor requests reduced motion.
      requestAnimationFrame(() => setPlaying(false));
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    programmed.current = true;
    const card = element.children[active] as HTMLElement;
    const inset = parseFloat(getComputedStyle(element).paddingLeft);
    element.scrollTo({ left: card.offsetLeft - element.offsetLeft - inset, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    progress.current = 0;
    const reset = window.setTimeout(() => { programmed.current = false; }, 800);
    return () => clearTimeout(reset);
  }, [active]);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(now - previous, 100);
      previous = now;
      if (playing && visible && !document.hidden) {
        progress.current += elapsed / 7000;
        if (progress.current >= 1) {
          progress.current = 0;
          setActive(index => (index + 1) % slides.length);
        }
      }
      if (timerBar.current) timerBar.current.style.transform = `scaleX(${progress.current})`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, visible]);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const settle = () => {
      if (programmed.current) return;
      const card = element.children[0] as HTMLElement;
      const gap = parseFloat(getComputedStyle(element).gap);
      setActive(Math.min(3, Math.max(0, Math.round(element.scrollLeft / (card.offsetWidth + gap)))));
    };
    element.addEventListener("scrollend", settle);
    return () => element.removeEventListener("scrollend", settle);
  }, []);

  return <section className="highlights-section" id="highlights" ref={section} aria-label="WICCLAW Box highlights">
    <div className="wide section-heading"><h2>Get the highlights.</h2><button className="text-link" onClick={onFilm}>Watch the film <Play size={16} /></button></div>
    <div className="highlights-track" ref={track} onPointerDown={() => { programmed.current = false; setPlaying(false); }} tabIndex={0} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); setActive(index => (index + (event.key === "ArrowRight" ? 1 : 3)) % 4); } }}>
      {slides.map((slide, index) => <article key={slide.image} className={`highlight-card highlight-${index}`} aria-label={slide.label}>
        {index === 0 ? <video ref={highlightVideo} src="/site/wicclaw/highlights-mx-xlargewc.mp4" poster="/site/wicclaw/top.png" muted loop playsInline preload="metadata" aria-label="WICCLAW AI agent work desktop" /> : <picture>
          {index === 1 && <source media="(max-width:420px)" srcSet="/site/wicclaw/highlights_apple_intelligence__dr9hgt196xme_xsmall.png" />}
          <source media="(max-width:734px)" srcSet={assetPath(smallAssets[slide.image])} />
          {index === 1 && <source media="(max-width:1068px)" srcSet="/site/wicclaw/highlights_apple_intelligence__dr9hgt196xme_largewc.png" />}
          {index === 1 && <source media="(min-width:1800px)" srcSet="/site/wicclaw/highlights_apple_intelligence__dr9hgt196xme_xlargewc.png" />}
          <img src={assetPath(assets[slide.image])} alt={`Illustrative ${slide.label.toLowerCase()} imagery`} />
        </picture>}
        <h3>{slide.text}</h3>
      </article>)}
    </div>
    <div className="gallery-controls" aria-label="Highlights playback">
      <button className="round-control" aria-label={playing ? "Pause highlights" : "Play highlights"} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={21} /> : <Play size={21} />}</button>
      <div className="dots">{slides.map((slide, index) => <button key={slide.label} aria-label={`Show ${slide.label.toLowerCase()} highlight`} aria-pressed={active === index} className={active === index ? "active" : ""} onClick={() => setActive(index)}>{active === index && <span ref={timerBar} />}</button>)}</div>
    </div>
  </section>;
}
