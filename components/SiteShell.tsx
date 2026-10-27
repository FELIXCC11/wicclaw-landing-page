"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow, Logo } from "./Brand";
import Preloader from "./Preloader";

const groups = [
  {
    title: "PRODUCTS",
    links: [
      ["WICCLAW Box overview", "/products"],
      ["The hardware", "/hardware"],
      ["WICCLAW Box", "/wicmini"],
      ["WICCLAW Fleet", "/fleet"],
      ["Pre-order WICCLAW Box", "/pre-order"],
      ["Telegram control", "/app"],
    ],
  },
  {
    title: "PLATFORM",
    links: [
      ["The system", "/platform"],
      ["Task runtime", "/runtime"],
      ["Task dispatch", "/gateway"],
      ["Pairing & permissions", "/permissions"],
      ["Device identity", "/identity"],
      ["Usage & pilot costs", "/usage"],
    ],
  },
  {
    title: "EXPLORE",
    links: [
      ["How it works", "/how-it-works"],
      ["Use cases", "/use-cases"],
      ["Getting started", "/get-started"],
      ["Help center", "/help"],
      ["FAQ", "/faq"],
    ],
  },
  {
    title: "WICCLAW",
    links: [
      ["Contact", "/contact"],
      ["Order help", "/order"],
      ["Service support", "/status"],
      ["What’s new", "/changelog"],
      ["Privacy policy", "/privacy"],
      ["Terms of sale", "/terms"],
      ["Shipping", "/shipping"],
      ["Cancellation & refunds", "/refunds"],
    ],
  },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(() => !(pathname.startsWith("/pre-order") || pathname.startsWith("/shop") || pathname.startsWith("/admin/preorders")));
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const complete = useCallback(() => setLoading(false), []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (loading || open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [loading, open]);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const links = panel.current?.querySelectorAll<HTMLAnchorElement>("a");
    links?.[0]?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key !== "Tab" || !links?.length) return;
      const first = links[0],
        last = links[links.length - 1];
      if (
        (e.shiftKey && document.activeElement === first) ||
        (!e.shiftKey && document.activeElement === last)
      ) {
        e.preventDefault();
        button.current?.focus();
      } else if (document.activeElement === button.current) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);
  useEffect(() => {
    if (
      loading ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06 },
    );
    main.current?.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("will-reveal");
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [loading, pathname]);

  if (pathname === "/pre-order" || pathname.startsWith("/shop")) return <>{children}</>;

  return (
    <>
      {loading && <Preloader onComplete={complete} />}
      <div
        className={`site ${loading ? "is-loading" : "is-ready"}`}
        inert={loading}
      >
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="header">
          <Link href="/" className="power-link" aria-label="WICCLAW home">
            <svg
              viewBox="0 0 28 28"
              width="28"
              height="28"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2h24v24H2zM8 10v11h12V10M14 6v10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </Link>
          <div className="header-inner">
            <button
              ref={button}
              className={`menu-toggle ${open ? "is-open" : ""}`}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(!open)}
            >
              <span />
              <span />
            </button>
            <Link href="/" className="header-logo" aria-label="WICCLAW home">
              <Logo />
            </Link>
            <nav className="desktop-nav" aria-label="Main navigation">
              {[
                ["Products", "/products"],
                ["Platform", "/platform"],
                ["Help", "/help"],
                ["Pre-order ↗", "/pre-order"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href.split("?")[0] ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="header-end" />
        </header>
        {open && (
          <div
            ref={panel}
            className="menu-panel mega-menu"
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="menu-heading">
              <span className="eyebrow">WICCLAW / EXPLORE THE SYSTEM</span>
              <p>
                A dedicated computer.
                <br />
                <span>Configured for real work.</span>
              </p>
            </div>
            <div className="menu-groups">
              {groups.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <span className="eyebrow">{group.title}</span>
                  {group.links.map(([label, href]) => (
                    <Link
                      href={href}
                      key={href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === href ? "page" : undefined}
                    >
                      {label}
                      <span>↗</span>
                    </Link>
                  ))}
                </nav>
              ))}
            </div>
          </div>
        )}
        <main ref={main} id="main" tabIndex={-1} inert={open}>
          {children}
        </main>
        <footer className="site-footer frame" inert={open}>
          <div className="footer-intro">
            <Link href="/" aria-label="WICCLAW home">
              <Logo />
            </Link>
            <p>
              A computer for the agent.
              <br />
              A workflow for your business.
            </p>
            <Link href="/pre-order" className="footer-talk">
              Pre-order <Arrow />
            </Link>
          </div>
          <div className="footer-groups">
            {groups.map((group) => (
              <nav
                key={group.title}
                aria-label={`Footer ${group.title.toLowerCase()}`}
              >
                <span className="eyebrow">{group.title}</span>
                {group.links.map(([label, href]) => (
                  <Link href={href} key={href}>
                    {label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} WICCLAW. All rights reserved.</span>
            <span>Built for local business.</span>
            <Link href="/data-request">Data requests ↗</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
