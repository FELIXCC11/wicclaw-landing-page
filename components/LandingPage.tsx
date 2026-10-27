"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Arrow } from "./Brand";

const products = [
  {
    name: "WICCLAW Box",
    label: "A dedicated AI computer for a focused first workflow.",
    price: "$799 hardware",
    cta: "Explore WICCLAW Box",
    features: [
      "Dedicated WICCLAW Box computer",
      "Telegram interaction",
      "Configured agent workflow",
      "Supported tools and skills",
      "Reviewable task outputs",
      "Business-specific setup",
    ],
    info: "Start with one task your team can evaluate, such as a report from approved sources or a review of an accessible queue. Your written offer identifies the device, enabled skill, connections, setup, approvals, and ongoing charges.",
    images: ["hero", "internals", "cooling"],
  },
  {
    name: "WICCLAW Fleet",
    label: "Dedicated devices for operations that need separation.",
    price: "Scoped deployment",
    cta: "Plan your fleet",
    features: [
      "Multiple mini devices",
      "Business and location mapping",
      "Workflow routing to be scoped",
      "Result ownership to be defined",
      "Recovery behavior to be confirmed",
      "Operational support to be agreed",
    ],
    info: "A Fleet proposal maps each device to the business, location, workload, and people it serves. The plan specifies routing, result ownership, access boundaries, recovery, and support before those features are promised.",
    images: ["exploded", "layers", "hero"],
  },
];
const steps = [
  [
    "Plug in",
    "Connect WICCLAW Box to power and the internet, then follow the supplied setup instructions.",
  ],
  [
    "Scan QR",
    "Pair the designated Telegram account with the correct business and device.",
  ],
  [
    "Authorize the work",
    "Choose one defined workflow and authorize only the service access it needs.",
  ],
  [
    "Give it a task",
    "Describe the job in ordinary language. The agent uses configured tools for supported steps.",
  ],
  [
    "Review the result",
    "Review what completed, what could not proceed, and what needs your decision.",
  ],
];
const notes = [
  [
    "01 / CONNECTION",
    "The agent has a computer separate from your laptop.",
  ],
  [
    "02 / SIMPLICITY",
    "Give supported tasks in natural language through today's paired interface.",
  ],
  [
    "03 / PURPOSE",
    "Start with a result you can verify. Expand after the first workflow proves useful.",
  ],
  [
    "04 / CONTROL",
    "Connections and approval points are defined for each workflow.",
  ],
  [
    "05 / SCALE",
    "Add skills or devices when a real business need justifies them.",
  ],
];
function Product({ product }: { product: (typeof products)[number] }) {
  const [active, setActive] = useState(0);
  return (
    <article className="product reveal">
      <div className="product-visual">
        <h3 className="product-heading">{product.name}</h3>
        <div className="product-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={active}
            src={`/images/wicmini-${product.images[active]}.png`}
            alt={`${product.name}, ${product.images[active]} view`}
            width="700"
            height="700"
            loading="lazy"
          />
        </div>
        <div className="gallery-controls">
          <button
            type="button"
            onClick={() => setActive((active + 1) % product.images.length)}
            aria-label={`Next image of ${product.name}`}
          >
            ▶
          </button>
          {product.images.map((name, index) => (
            <button
              key={name}
              type="button"
              aria-label={`${product.name}: ${name} view`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span />
            </button>
          ))}
          <span className="gallery-count">0{active + 1} / 03</span>
        </div>
      </div>
      <div className="product-features">
        <h4 className="column-heading">Components</h4>
        <ul>
          {product.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <div className="product-price">
          {product.price}
          <span>{product.label}</span>
        </div>
      </div>
      <div className="product-info">
        <h4 className="product-heading">Info</h4>
        <p>{product.info}</p>
        <Link
          className="product-cta"
          href={product.name.includes("Core") ? "/pre-order" : "/contact"}
        >
          {product.cta}
          <Arrow />
        </Link>
        <Link className="product-more" href="/how-it-works">
          See how it works
          <Arrow />
        </Link>
      </div>
    </article>
  );
}

export default function LandingPage() {
  const [playing, setPlaying] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const page = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // A media request can fail before React hydrates and attaches onError.
    if (video.current?.error) setVideoFailed(true);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotionPaused(true);
      video.current?.pause();
      setPlaying(false);
    }
  }, []);
  const toggleVideo = () => {
    if (!video.current) return;
    if (video.current.paused)
      video.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    else {
      video.current.pause();
      setPlaying(false);
    }
  };

  return (
    <div ref={page} className={motionPaused ? "motion-paused" : ""}>
      <section id="top" className="hero grid-section">
        <div className="hero-space frame" />
        <div className="hero-title-line">
          <div className="hero-title-inner frame">
            <h1 aria-label="Your business. With more time.">
              Your business. With
            </h1>
            <div className="marquee" aria-label="More time for your business">
              <div className="marquee-track" aria-hidden="true">
                {[0, 1].map((i) => (
                  <span key={i}>MORE TIME FOR YOUR BUSINESS, </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="hero-body frame">
          <p className="hero-description">
            _Meet WICCLAW. A compact AI-powered device designed to take everyday work off your hands.
            <br />From bookkeeping and emails to reports and business operations, it works across supported applications under the permissions you choose.
          </p>
          <div className="hero-actions">
            <Link className="outline-button" href="/pre-order">
              Explore WICCLAW Box
              <Arrow />
            </Link>
            <Link className="text-link" href="/products">
              See how it works
            </Link>
          </div>
          <div className="hero-bottom">
            <span className="eyebrow">SMALL HARDWARE. REAL POSSIBILITIES.</span>
            <a href="#about" aria-label="Discover WICCLAW">
              <Arrow down />
            </a>
          </div>
        </div>
      </section>
      <section id="about" className="manifesto frame">
        <div className="manifesto-copy reveal">
          <p>
            _An answer is useful. <span>Completed steps</span> are more useful.
            With the right skill and permission, WICCLAW can gather information,
            work with a supported application, prepare an output, and report what
            happened. If a sign-in, missing detail, or important decision blocks
            the task, it should ask rather than guess.
          </p>
          <p>
            Start with one job you can review. <span>Build from there.</span>
          </p>
          <div className="signature">_ The WICCLAW system</div>
        </div>
        <div className="manifesto-mark" aria-hidden="true">
          w<span>_</span>
        </div>
      </section>
      <section
        className="product-story grid-section"
        aria-label="Meet the WICCLAW Box"
      >
        <div className="story-heading frame reveal">
          <span className="eyebrow">01 / THE HARDWARE</span>
          <h2>
            A dedicated place for
            <br />
            <span>the work you delegate.</span>
          </h2>
        </div>
        <div className="cinema">
          {!videoFailed ? (
            <video
              ref={video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src="/videos/wicmini-demo.mp4"
              poster="/images/wicmini-hero.png"
              aria-label="WICCLAW Box product animation"
              onError={() => setVideoFailed(true)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/wicmini-hero.png"
              alt="WICCLAW Box compact AI agent box"
            />
          )}
          <div className="cinema-note">
            <span className="eyebrow">WICCLAW BOX / BUSINESS AI APPLIANCE</span>
            <p>
              A separate workspace for the agent.
              <br />
              Configured around your business.
              <br />
              Available while powered and connected.
            </p>
          </div>
          {!videoFailed && (
            <button
              type="button"
              className="video-toggle"
              onClick={toggleVideo}
              aria-label={
                playing ? "Pause product video" : "Play product video"
              }
            >
              {playing ? "Ⅱ Pause" : "▶ Play"}
            </button>
          )}
        </div>
        <div className="hardware-caption frame">
          <span>WICCLAW BOX — YOUR AI EMPLOYEE’S DEDICATED COMPUTER.</span>
          <span>Local tools and connected services depend on your configuration.</span>
        </div>
      </section>
      <section id="flow" className="section-block grid-section">
        <div className="frame">
          <div className="section-tab">
            The WICCLAW Box system<span>02</span>
          </div>
          <div className="section-intro reveal">
            <h2>
              From instruction
              <br />
              to reviewed result.
            </h2>
            <p>
              Pair the right owner, authorize only the services a defined job
              needs, and describe the outcome. Review what the agent completed,
              what stopped, and what still needs your decision.
            </p>
          </div>
          <div className="steps">
            {steps.map(([title, description], i) => (
              <article className="step reveal" key={title}>
                <span className="step-number">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <span className="step-plus" aria-hidden="true">
                  +
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="products" className="section-block grid-section">
        <div className="frame">
          <div className="section-tab">
            Find your WICCLAW Box<span>03</span>
          </div>
          <div className="section-intro reveal">
            <h2>
              Start with
              <br />
              a useful job.
            </h2>
            <p>
              Choose work your team already understands. Core begins with a
              focused, reviewable workflow; broader integrations, skills, and
              multi-device deployments are scoped separately.
            </p>
          </div>
          <div className="products">
            {products.map((product) => (
              <Product key={product.name} product={product} />
            ))}
          </div>
        </div>
      </section>
      <section className="frame home-explore">
        <div className="section-intro">
          <h2>
            Understand
            <br />
            how it works.
          </h2>
          <p>
            See what runs on WICCLAW Box, how an instruction becomes supported work,
            and where people remain in control.
          </p>
        </div>
        <div className="link-grid">
          {[
            [
              "/hardware",
              "01 / HARDWARE",
              "Meet WICCLAW Box",
              "Understand the computer and what still depends on internet services.",
            ],
            [
              "/platform",
              "02 / PLATFORM",
              "Inside the system",
              "Follow a task from instruction through configured tools to a reviewable result.",
            ],
            [
              "/help",
              "03 / GUIDES",
              "Make your first move",
              "Choose a first job and learn what to check when work pauses.",
            ],
          ].map(([href, label, title, text]) => (
            <Link className="editorial-card" href={href} key={href}>
              <span className="eyebrow">{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>
      <section className="notes-section frame" aria-label="WICCLAW principles">
        <div className="notes-heading">
          <span className="eyebrow">BUILT AROUND THE WAY YOU WORK</span>
          <button
            type="button"
            onClick={() => setMotionPaused(!motionPaused)}
            aria-pressed={motionPaused}
          >
            {motionPaused ? "Resume motion ▶" : "Pause motion Ⅱ"}
          </button>
        </div>
        <div className="notes-window">
          <div className="notes-track">
            {[0, 1].map((copy) => (
              <div
                className="notes-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {notes.map(([title, text]) => (
                  <article className="note" key={title}>
                    <p>{text}</p>
                    <footer>
                      <span>↗</span>
                      {title}
                    </footer>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" className="contact frame reveal">
        <Link href="/pre-order">
          <span>What work would you hand off first?</span>
          <Arrow />
        </Link>
        <div className="contact-meta">
          <span>Tell us the recurring task, tools, and result you would need to trust.</span>
          <a href="mailto:hello@wicclaw.ai">hello@wicclaw.ai ↗</a>
        </div>
      </section>
    </div>
  );
}
