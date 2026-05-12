'use client'

import { useEffect, useRef, useState } from 'react'

/* ─── Brand data ──────────────────────────────────────────────────── */
const orange = '#ff8800'
const pale = '#fce7cd'

const heroWords = [
  'CONNECT', 'PAIR', 'AUTOMATE', 'MONITOR',
  'REPORT', 'QUOTE', 'SCHEDULE', 'PROMOTE', 'CONTROL', 'SCALE',
]

const flow = [
  { title: 'Plug in',       text: 'Power the mini box and connect it to internet.' },
  { title: 'Scan QR',       text: 'Pair the device to the business owner on Telegram.' },
  { title: 'Give commands', text: 'Use Telegram to request quotes, promos, reports, or status.' },
  { title: 'Run safely',    text: 'Validation and permissions check every task before dispatch.' },
  { title: 'Track results', text: 'Heartbeat, queue state, and task results stay visible.' },
]

const productCards = [
  {
    name: 'WICMINI Core',
    price: 'Early access',
    components: [
      'Mini AI agent box',
      'Telegram bot pairing',
      'Heartbeat monitoring',
      'Device registry',
      'Queue polling',
      'Agent-first dispatch',
    ],
    info: 'The starter WicClaw deployment for one local business. Built for simple onboarding, status checks, and daily business workflows from Telegram.',
    cta: 'Request pilot',
    images: [
      '/images/wicmini-hero.png',
      '/images/wicmini-internals.png',
      '/images/wicmini-cooling.png',
    ],
  },
  {
    name: 'WICMINI Fleet',
    price: 'Multi-device',
    components: [
      'Multiple mini devices',
      'Master control server',
      'Business workflow routing',
      'Result tracking',
      'Fallback device queue',
      'Remote operations view',
    ],
    info: 'For running several business locations or multiple client deployments from one master control layer.',
    cta: 'Plan fleet',
    images: [
      '/images/wicmini-exploded.png',
      '/images/wicmini-layers.png',
      '/images/wicmini-hero.png',
    ],
  },
]

const quotes = [
  'Plug it in, scan once, and the business has an AI operator.',
  'Telegram is the dashboard. The mini is the worker. The server is the brain.',
  'Designed for local businesses that need outcomes, not another software login.',
  'Every command is checked before execution. Control stays visible.',
  'One mini per business. One control layer for the whole network.',
]

/* ─── Sub-components ──────────────────────────────────────────────── */
function Arrow() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path
        d="M16.4181 1.47272L13.7747 1.48207L13.7747 11.9065L2.4068 0.538636L0.538621 2.40681L11.9065 13.7747L1.47271 13.784L1.47271 16.4181H16.4181V1.47272Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/Logo-orange.png"
      alt="WicClaw"
      className={`wc-logo-img${light ? ' wc-logo-img--light' : ''}`}
    />
  )
}

function GridFrame({
  children,
  className = '',
  id,
}: {
  children?: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section className={`wc-grid-frame ${className}`} id={id}>
      {children}
    </section>
  )
}

function SectionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="wc-section-bar">
      <span className="wc-dot" />
      <span>{children}</span>
    </div>
  )
}

function ProductCard({ card }: { card: (typeof productCards)[0] }) {
  const [active, setActive] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)

  const switchImage = async (i: number) => {
    if (i === active) return
    const { gsap } = await import('gsap')
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        opacity: 0, scale: 1.04, duration: 0.22, ease: 'power2.in',
        onComplete: () => {
          setActive(i)
          gsap.fromTo(
            imgRef.current,
            { opacity: 0, scale: 0.97 },
            { opacity: 1, scale: 1, duration: 0.38, ease: 'power3.out' },
          )
        },
      })
    } else {
      setActive(i)
    }
  }

  return (
    <div className="wc-product-card">
      {/* Image column */}
      <div className="wc-product-image-block">
        <div className="wc-product-title">{card.name}</div>
        <div className="wc-image-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={card.images[active]}
            alt={`${card.name} — view ${active + 1}`}
            loading="lazy"
          />
        </div>
        <div className="wc-thumbs">
          {card.images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`wc-thumb-btn ${i === active ? 'active' : ''}`}
              onClick={() => switchImage(i)}
              aria-label={`View ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Components column */}
      <div className="wc-components-block">
        <div className="wc-column-title">Components</div>
        <ul>
          {card.components.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="wc-price">{card.price}</div>
      </div>

      {/* Info column */}
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
  )
}

/* Split hero title into individually animatable words */
function HeroTitle() {
  const lines = ['AI mini boxes,', 'built for']
  return (
    <h1 className="wc-hero-title wc-display" aria-label="AI mini boxes, built for">
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {line.split(' ').map((word, wi) => (
            <span key={wi} className="wc-word-wrap">
              <span className="wc-hero-word">{word}</span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

/* ─── Main page component ─────────────────────────────────────────── */
export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctxRef = useRef<any>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null
    let removeMouseMove: (() => void) | null = null

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      /* Lenis smooth scroll */
      const LenisClass = (await import('lenis')).default
      lenis = new LenisClass({ lerp: 0.08, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time: number) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      /* Scroll progress bar */
      const progressEl = document.querySelector<HTMLElement>('.wc-progress')
      if (progressEl) {
        gsap.to(progressEl, {
          width: '100%',
          ease: 'none',
          scrollTrigger: { start: 'top top', end: 'max', scrub: 0 },
        })
      }

      /* Custom cursor */
      const cursor = document.querySelector<HTMLElement>('.wc-cursor')
      const ring = document.querySelector<HTMLElement>('.wc-cursor-ring')
      if (cursor && ring) {
        const onMove = (e: MouseEvent) => {
          gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.12, ease: 'power2.out' })
          gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.4, ease: 'power3.out' })
        }
        const onEnterLink = () => {
          cursor.classList.add('is-hovering')
          ring.classList.add('is-hovering')
        }
        const onLeaveLink = () => {
          cursor.classList.remove('is-hovering')
          ring.classList.remove('is-hovering')
        }
        window.addEventListener('mousemove', onMove)
        document.querySelectorAll('a, button').forEach((el) => {
          el.addEventListener('mouseenter', onEnterLink)
          el.addEventListener('mouseleave', onLeaveLink)
        })
        removeMouseMove = () => {
          window.removeEventListener('mousemove', onMove)
          document.querySelectorAll('a, button').forEach((el) => {
            el.removeEventListener('mouseenter', onEnterLink)
            el.removeEventListener('mouseleave', onLeaveLink)
          })
        }
      }

      if (!containerRef.current) return

      /* All GSAP animations inside a context for clean teardown */
      ctxRef.current = gsap.context(() => {
        /* ── Load sequence ────────────────────────────────────── */
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.from('.wc-nav', { y: -70, duration: 0.8 }, 0)
          .from(
            '.wc-hero-word',
            { y: '110%', stagger: 0.09, duration: 1, ease: 'power4.out' },
            0.35,
          )
          .from('.wc-marquee', { opacity: 0, duration: 0.5 }, 0.95)
          .from('.wc-kicker', { opacity: 0, y: 22, duration: 0.7 }, 1.1)
          .from(
            '.wc-actions > *',
            { opacity: 0, y: 14, stagger: 0.12, duration: 0.6 },
            1.3,
          )

        /* ── Section bars – slide from left ───────────────────── */
        gsap.utils.toArray<HTMLElement>('.wc-section-bar').forEach((el) => {
          gsap.from(el, {
            x: -80,
            opacity: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          })
        })

        /* ── Heading rows ─────────────────────────────────────── */
        gsap.utils.toArray<HTMLElement>('.wc-heading-row').forEach((row) => {
          const h2 = row.querySelector('h2')
          const p = row.querySelector('p')
          if (h2) {
            gsap.from(h2, {
              opacity: 0,
              y: 36,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: row, start: 'top 82%' },
            })
          }
          if (p) {
            gsap.from(p, {
              opacity: 0,
              y: 20,
              duration: 0.7,
              delay: 0.15,
              ease: 'power3.out',
              scrollTrigger: { trigger: row, start: 'top 82%' },
            })
          }
        })

        /* ── Manifesto ────────────────────────────────────────── */
        gsap.from('.wc-circle', {
          scale: 0,
          duration: 1.6,
          ease: 'power3.out',
          transformOrigin: 'center center',
          scrollTrigger: { trigger: '.wc-manifesto', start: 'top 72%' },
        })

        gsap.utils.toArray<HTMLElement>('.wc-manifesto p').forEach((p, i) => {
          gsap.from(p, {
            opacity: 0,
            y: 30,
            duration: 0.9,
            delay: i * 0.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.wc-manifesto', start: 'top 70%' },
          })
        })

        gsap.from('.wc-signature', {
          opacity: 0,
          x: -20,
          duration: 0.7,
          scrollTrigger: { trigger: '.wc-signature', start: 'top 90%' },
        })

        /* ── Product hero – parallax ──────────────────────────── */
        gsap.to('.wc-product-hero-img', {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: '.wc-product-hero',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })

        gsap.to('.wc-product-hero-video', {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: '.wc-product-hero',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })

        gsap.from('.wc-floating-note', {
          opacity: 0,
          x: -30,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.wc-product-hero', start: 'top 70%' },
        })

        /* ── Flow steps – stagger from bottom ────────────────── */
        gsap.from(gsap.utils.toArray<HTMLElement>('.wc-flow-step'), {
          y: 70,
          opacity: 0,
          stagger: 0.13,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.wc-flow', start: 'top 78%' },
        })

        /* ── Product cards – clip-path wipe from bottom ───────── */
        gsap.utils.toArray<HTMLElement>('.wc-product-card').forEach((card) => {
          gsap.fromTo(
            card,
            { clipPath: 'inset(100% 0 0 0)' },
            {
              clipPath: 'inset(0% 0 0 0)',
              duration: 1.3,
              ease: 'power4.out',
              scrollTrigger: { trigger: card, start: 'top 82%' },
            },
          )
        })

        /* ── Quotes bar ───────────────────────────────────────── */
        gsap.from('.wc-quotes', {
          opacity: 0,
          duration: 0.7,
          scrollTrigger: { trigger: '.wc-quotes', start: 'top 88%' },
        })

        /* ── Contact ──────────────────────────────────────────── */
        gsap.from('.wc-contact', {
          opacity: 0,
          y: 40,
          scale: 0.97,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.wc-contact', start: 'top 85%' },
        })

        /* ── Footer ───────────────────────────────────────────── */
        gsap.from('.wc-footer', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.wc-footer', start: 'top 92%' },
        })
      }, containerRef.current)
    }

    init()

    return () => {
      removeMouseMove?.()
      ctxRef.current?.revert()
      lenis?.destroy()
    }
  }, [])

  /* ─── Markup ────────────────────────────────────────────────────── */
  return (
    <div ref={containerRef} className="wc-page">
      {/* Cursor */}
      <div className="wc-cursor" aria-hidden="true" />
      <div className="wc-cursor-ring" aria-hidden="true" />

      {/* Scroll progress */}
      <div className="wc-progress" aria-hidden="true" />

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="wc-nav" aria-label="Main navigation">
        <div className="wc-nav-side" title="Menu" role="button" aria-label="Open menu">
          <span className="wc-menu-icon" aria-hidden="true" />
        </div>
        <div className="wc-nav-main">
          <div />
          <div className="wc-nav-center">
            <Logo />
          </div>
          <div className="wc-nav-links">
            <a href="#flow">How it works</a>
            <a href="#products">Pilots</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div
          className="wc-nav-end"
          style={{ color: orange, fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}
        >
          AI OS
        </div>
      </nav>

      {/* ── Hero spacer ─────────────────────────────────────────── */}
      <GridFrame className="wc-hero-spacer" />

      {/* ── Hero title + marquee ─────────────────────────────────── */}
      <GridFrame className="wc-hero-title-row">
        <HeroTitle />
        <div className="wc-marquee wc-pixel" aria-label="WicClaw capabilities">
          <div className="wc-marquee-track">
            {[...heroWords, ...heroWords, ...heroWords].map((word, i) => (
              <span key={`${word}-${i}`}>{word},</span>
            ))}
          </div>
        </div>
      </GridFrame>

      {/* ── Intro ───────────────────────────────────────────────── */}
      <GridFrame className="wc-intro">
        <p className="wc-kicker">
          _Plug-and-play AI support for local businesses, controlled through Telegram, powered by a
          mini device and a master WicClaw control layer.
        </p>
        <div className="wc-actions">
          <a className="wc-outline-button" href="#contact">
            <span>Try WicMini Pilot</span>
            <Arrow />
          </a>
          <a className="wc-text-link" href="#products">
            See deployments
          </a>
        </div>
      </GridFrame>

      {/* ── Manifesto ───────────────────────────────────────────── */}
      <GridFrame className="wc-manifesto">
        <div className="wc-circle" aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p>
            We do not believe in generic AI dashboards. Each WicMini is designed and{' '}
            <span className="wc-orange-word wc-pixel">paired</span> as a{' '}
            <span className="wc-orange-word wc-pixel">business agent</span>, giving owners simple
            control, reliable automation, and visible execution from Telegram.
          </p>
          <p style={{ marginTop: '3vw' }}>
            Do not install another tool.{' '}
            <span className="wc-orange-word wc-pixel">Plug it in.</span>
          </p>
        </div>
        <div className="wc-signature">
          <span style={{ color: orange }}>_</span> WicClaw System
        </div>
      </GridFrame>

      {/* ── Product hero ────────────────────────────────────────── */}
      <GridFrame className="wc-product-hero">
        <div className="wc-floating-note">
          The PC becomes the mini box: small hardware, always online, remotely monitored, ready for
          one business or a fleet.
        </div>
        <div className="wc-product-hero-media">
          {/* Background video (place /public/videos/wicmini-demo.mp4) */}
          <video
            className="wc-product-hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/wicmini-layers.png"
            aria-hidden="true"
          >
            <source src="/videos/wicmini-demo.mp4" type="video/mp4" />
          </video>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/wicmini-hero.png"
            alt="WicMini AI agent box — compact, always-on hardware"
            className="wc-product-hero-img"
            width={900}
            height={700}
          />
        </div>
      </GridFrame>

      {/* ── How it works ────────────────────────────────────────── */}
      <GridFrame>
        <SectionBar>WicMini system</SectionBar>
      </GridFrame>
      <GridFrame className="wc-heading-row">
        <h2>Business automation, without the software burden.</h2>
        <p>
          <strong>WicClaw</strong> combines Telegram control, device heartbeat, queue polling,
          permissions, and Agent-first dispatch — so the business owner does nothing technical
          after day one.
        </p>
      </GridFrame>

      <section id="flow" className="wc-flow" aria-label="How WicMini works">
        {flow.map((item, index) => (
          <div className="wc-flow-step" key={item.title}>
            <div className="wc-number wc-display">{String(index + 1).padStart(2, '0')}</div>
            <div>
              <strong className="wc-pixel">{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Products ────────────────────────────────────────────── */}
      <GridFrame>
        <SectionBar>Deployment options</SectionBar>
      </GridFrame>
      <GridFrame className="wc-heading-row">
        <h2>WicMini pilots: ready to place in the field.</h2>
        <p>
          Each deployment is pre-configured for Telegram control, heartbeat monitoring, and
          Agent-first task dispatch. Choose Core for one business, Fleet for a network.
        </p>
      </GridFrame>

      <section id="products" className="wc-products-wrap" aria-label="WicMini products">
        {productCards.map((card) => (
          <ProductCard key={card.name} card={card} />
        ))}
      </section>

      {/* ── Quotes ──────────────────────────────────────────────── */}
      <GridFrame>
        <SectionBar>Field notes</SectionBar>
      </GridFrame>
      <section className="wc-quotes" aria-label="WicClaw field notes">
        <div className="wc-quote-track" aria-hidden="true">
          {[...quotes, ...quotes, ...quotes].map((quote, index) => (
            <div className="wc-quote-card" key={`${quote}-${index}`}>
              <p>&ldquo;{quote}&rdquo;</p>
              <footer>WicMini concept</footer>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────── */}
      <div style={{ padding: '3vw 0', borderBottom: `1px solid ${pale}` }}>
        <section id="contact" className="wc-contact">
          <a href="mailto:hello@wicclaw.ai">Contact us</a>
        </section>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="wc-footer" role="contentinfo">
        <div>
          <Logo light />
          <p style={{ marginTop: '1.5vw', opacity: 0.8 }}>
            One mini. One business. One control layer.
          </p>
        </div>
        <div>
          <strong>Contact</strong>
          <br />
          <a href="mailto:hello@wicclaw.ai">hello@wicclaw.ai</a>
          <br />
          Telegram-first onboarding
        </div>
        <div>
          <strong>System</strong>
          <br />
          Plug in
          <br />
          Scan QR
          <br />
          AI works
        </div>
      </footer>
      <div className="wc-footer-bottom">
        <span>© {new Date().getFullYear()} WicClaw. All rights reserved.</span>
        <span>Built for local business.</span>
      </div>
    </div>
  )
}
