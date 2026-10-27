"use client";
import { useEffect, useState } from "react";
const bootMessages = [
  "WICCLAW / SYSTEM INITIALIZATION",
  "Loading interface assets...",
  "Preparing device workspace...",
  "Loading Telegram workflow interface...",
  "Preparing device monitoring views...",
  "Loading deployment options...",
  "Rendering product environment...",
  "Checking interface readiness...",
  "WICCLAW interface ready.",
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let disposed = false;
    let ready = false;
    let frame = 0;
    let exitTimer: ReturnType<typeof setTimeout>;
    const start = performance.now();
    const logo = new Image();
    logo.src = "/Logo-orange.png";
    Promise.allSettled([document.fonts.ready, logo.decode()]).then(() => {
      ready = true;
    });
    const tick = (now: number) => {
      if (disposed) return;
      const elapsed = now - start;
      const value = Math.min(
        ready || elapsed > 4500 ? 100 : 92,
        Math.floor(elapsed / (reduced ? 1 : 20)),
      );
      setProgress(value);
      if (value === 100) {
        setLeaving(true);
        exitTimer = setTimeout(onComplete, reduced ? 0 : 550);
      } else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);
  return (
    <div
      className={`preloader ${leaving ? "is-leaving" : ""}`}
      role="status"
      aria-label="Loading WICCLAW"
    >
      <div className="boot-log" aria-hidden="true">
        {bootMessages.slice(0, Math.ceil(progress / 12)).map((line, i) => (
          <div key={line}>
            <span>{String(i).padStart(2, "0")}</span> {line}
          </div>
        ))}
      </div>
      <div className="loader-center">
        <div className="loader-emblem" aria-hidden="true">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <g className="claw-left">
              <path d="M10 15h15v30h15v15H25v15H10V60H0V30h10z" />
            </g>
            <g className="claw-right">
              <path d="M75 15h15v15h10v30H90v15H75V60H60V45h15z" />
            </g>
            <path d="M40 60h20v15H40zM25 75h50v15H25z" />
          </svg>
        </div>
        <span className="loader-name">WICCLAW</span>
        <div className="loader-track">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="loader-caption">
          <span>INITIALIZING</span>
          <span>{String(progress).padStart(3, "0")}%</span>
        </div>
      </div>
      <button type="button" className="loader-skip" onClick={onComplete}>
        Skip intro ↗
      </button>
    </div>
  );
}
