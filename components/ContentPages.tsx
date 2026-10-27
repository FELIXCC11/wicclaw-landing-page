import Link from "next/link";
import Image from "next/image";
import { Arrow } from "./Brand";
import { pages, pageBySlug, type ContentPage } from "@/data/pages";
import { guides, guideCategories, guidePath, type Guide } from "@/data/guides";
import {
  FAQList,
  HelpSearch,
  InquiryForm,
  WorkflowExample,
} from "./PageInteractions";

export function PageIntro({
  category,
  title,
  accent,
  description,
}: {
  category: string;
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <section className="page-intro grid-section">
      <div className="frame">
        <div className="page-breadcrumb">
          <Link href="/">WICCLAW</Link>
          <span>/</span>
          <span>{category.replace("WICCLAW / ", "")}</span>
        </div>
        <div className="page-title-grid">
          <h1>
            {title}
            <br />
            <span>{accent}</span>
          </h1>
          <div className="intro-summary">
            <p>{description}</p>
            <span className="eyebrow">SMALL HARDWARE. REAL POSSIBILITIES.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SystemVisual({ type }: { type: ContentPage["visual"] }) {
  if (type === "chat") return <WorkflowExample />;
  if (type === "fleet")
    return (
      <div className="system-visual">
        <div className="visual-label eyebrow">FLEET / SYSTEM OVERVIEW</div>
        <div className="fleet-root">
          WICCLAW<span>Shared control layer</span>
        </div>
        <div className="fleet-branches">
          {["BUSINESS 01", "BUSINESS 02", "BUSINESS 03"].map((item) => (
            <div key={item}>
              <span className="pixel-device" aria-hidden="true">
                ▤
              </span>
              <strong>{item}</strong>
              <span>Registered WICCLAW Box</span>
            </div>
          ))}
        </div>
        <p className="visual-footnote">
          Device identity + workflow routing + results
        </p>
      </div>
    );
  if (type === "control")
    return (
      <div className="system-visual">
        <div className="visual-label eyebrow">
          BUSINESS OWNER / WORKFLOW BOUNDARIES
        </div>
        <h2 className="visual-heading">
          Your work.
          <br />
          <span>Your rules.</span>
        </h2>
        <div className="control-lines">
          {[
            ["01", "The business", "Owner + device"],
            ["02", "The request", "Context + output"],
            ["03", "The boundary", "Validation + permissions"],
            ["04", "The result", "Review + next step"],
          ].map(([number, label, detail]) => (
            <div key={number}>
              <span>{number}</span>
              <strong>{label}</strong>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="system-visual">
      <div className="visual-label eyebrow">WICCLAW / THE PATH OF A TASK</div>
      <div className="task-path">
        {[
          ["01", "Message", "Business context"],
          ["02", "Validate", "Permission check"],
          ["03", "Dispatch", "Configured workflow"],
          ["04", "Review", "Task result"],
        ].map(([number, label, detail]) => (
          <div key={number}>
            <span className="eyebrow">{number}</span>
            <h3>{label}</h3>
            <p>{detail}</p>
            <Arrow />
          </div>
        ))}
      </div>
      <p className="visual-footnote">
        Telegram → control layer → WICCLAW Box → your result
      </p>
    </div>
  );
}

function RelatedPages({ slugs }: { slugs: string[] }) {
  const special: Record<string, [string, string]> = {
    contact: ["Request information", "Describe the process, tools, and result you need."],
    "pre-order": ["Pre-order WICCLAW Box", "Review the price and order terms."],
    help: ["Help center", "Practical guides for setup and everyday work."],
    "data-request": [
      "Data requests",
      "Prepare a privacy question for the team.",
    ],
  };
  return (
    <section className="related-section frame">
      <div className="related-heading">
        <span className="eyebrow">KEEP EXPLORING</span>
        <span>There’s more to the mini.</span>
      </div>
      <div className="link-grid">
        {slugs.map((slug) => {
          const page = pageBySlug(slug);
          const title = page
            ? `${page.title} ${page.accent}`
            : special[slug]?.[0] || slug;
          return (
            <Link key={slug} href={`/${slug}`} className="editorial-card">
              <span className="eyebrow">{page?.category || "WICCLAW"}</span>
              <h3>{title}</h3>
              <p>{page?.description || special[slug]?.[1]}</p>
              <Arrow />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ProductStory({ page }: { page: ContentPage }) {
  return (
    <>
      <PageIntro {...page} />
      {page.visual && (
        <section
          className={`page-feature frame ${page.visual === "hardware" ? "hardware-feature" : ""}`}
        >
          {page.visual === "hardware" ? (
            <>
              <div className="feature-caption">
                <span className="eyebrow">WICCLAW BOX / PRODUCT EXPLORATION</span>
                <p>
                  A computer for the agent.
                  <br />
                  <span>Configured for your work.</span>
                </p>
                <Link href="/pre-order" className="outline-button">
                  Review Core pre-order <Arrow />
                </Link>
              </div>
              <div className="feature-image">
                <Image
                  src={`/images/wicmini-${page.image || "hero"}.png`}
                  alt="WICCLAW Box compact business AI device"
                  width={900}
                  height={700}
                  sizes="(max-width: 700px) 88vw, 55vw"
                  priority
                  unoptimized
                />
              </div>
            </>
          ) : (
            <SystemVisual type={page.visual} />
          )}
        </section>
      )}
      {page.slug === "products" && (
        <section
          className="deployment-choices frame"
          aria-label="Compare deployments"
        >
          {[
            ["Core", "One business. A focused beginning.", "/wicmini", "01"],
            ["Fleet", "Several locations. A shared view.", "/fleet", "02"],
          ].map(([name, text, href, number]) => (
            <Link href={href} key={name}>
              <span className="eyebrow">{number} / DEPLOYMENT</span>
              <h2>
                WICCLAW Box <span>{name}</span>
              </h2>
              <p>{text}</p>
              <span className="choice-link">
                Explore {name}
                <Arrow />
              </span>
            </Link>
          ))}
        </section>
      )}
      <div className="story-sections frame">
        {page.sections.map((section, i) => (
          <section
            className="story-section"
            key={section.title}
            id={`section-${i + 1}`}
          >
            <span className="section-index">
              {String(i + 1).padStart(2, "0")} /
            </span>
            <h2>{section.title}</h2>
            <div>
              <p>{section.text}</p>
              {section.points && (
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
      {page.slug === "platform" && (
        <section className="platform-directory frame">
          <span className="eyebrow">EXPLORE THE PLATFORM</span>
          {pages
            .filter((item) => page.related.includes(item.slug))
            .map((item, i) => (
              <Link href={`/${item.slug}`} key={item.slug}>
                <span className="section-index">0{i + 1}</span>
                <div>
                  <h3>{item.category.split(" / ")[1]}</h3>
                  <p>{item.description}</p>
                </div>
                <Arrow />
              </Link>
            ))}
        </section>
      )}
      <RelatedPages slugs={page.related} />
      <PageCTA />
    </>
  );
}

export function PageCTA() {
  return (
    <section className="page-cta frame">
      <span className="eyebrow">YOUR BUSINESS / YOUR NEXT MOVE</span>
      <Link href="/pre-order">
        <span>Start with a job you can check.</span>
        <Arrow />
      </Link>
    </section>
  );
}

export function HelpPage() {
  return (
    <>
      <PageIntro
        category="Help center"
        title="Get your first"
        accent="useful result."
        description="Begin with the current WICCLAW Box and Telegram setup, one defined workflow, and a result you can review. These guides explain what to check when a task needs information, access, or a decision. App-specific setup guidance will follow when the WICCLAW application is available."
      />
      <section className="help-start frame">
        <span className="eyebrow">NEW TO WICCLAW? START HERE.</span>
        <div className="link-grid">
          {guides.slice(0, 3).map((item, i) => (
            <Link
              className="editorial-card"
              href={guidePath(item)}
              key={item.slug}
            >
              <span className="section-index">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>
      <section className="frame">
        <HelpSearch
          articles={guides.map((item) => ({
            title: item.title,
            category: item.category,
            summary: item.summary,
            href: guidePath(item),
          }))}
        />
      </section>
      <div className="help-contact frame">
        <h2>Still need a hand?</h2>
        <p>
          Tell us your device name, what you tried, and where you got stuck.
        </p>
        <Link href="/contact" className="outline-button">
          Contact the team <Arrow />
        </Link>
      </div>
    </>
  );
}

export function GuidePage({ guide }: { guide: Guide }) {
  const siblings = guides
    .filter(
      (item) => item.category === guide.category && item.slug !== guide.slug,
    )
    .slice(0, 3);
  const minutes = Math.max(
    1,
    Math.ceil(
      guide.sections
        .map((section) => section.text)
        .join(" ")
        .split(/\s+/).length / 180,
    ),
  );
  return (
    <div className="guide-layout frame">
      <aside className="guide-sidebar">
        <Link href="/help" className="back-link">
          ← All help guides
        </Link>
        {guideCategories.map((category) => (
          <details key={category} open={category === guide.category}>
            <summary>{category}</summary>
            <nav aria-label={category}>
              {guides
                .filter((item) => item.category === category)
                .map((item) => (
                  <Link
                    href={guidePath(item)}
                    key={item.slug}
                    aria-current={item.slug === guide.slug ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                ))}
            </nav>
          </details>
        ))}
      </aside>
      <article className="guide-article">
        <div className="guide-kicker eyebrow">
          {guide.category} <span>/ {minutes} MIN READ</span>
        </div>
        <h1>{guide.title}</h1>
        <p className="guide-summary">{guide.summary}</p>
        <nav className="article-contents" aria-label="On this page">
          <span className="eyebrow">IN THIS GUIDE</span>
          {guide.sections.map((section, i) => (
            <a key={section.title} href={`#section-${i + 1}`}>
              {String(i + 1).padStart(2, "0")} — {section.title}
            </a>
          ))}
        </nav>
        {guide.sections.map((section, i) => (
          <section
            className="guide-section"
            id={`section-${i + 1}`}
            key={section.title}
          >
            <span className="section-index">0{i + 1}</span>
            <div>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </section>
        ))}
        <div className="guide-end">
          <h3>Need help with your setup?</h3>
          <p>
            Your onboarding instructions define the exact steps for your pilot.
          </p>
          <Link href="/contact">
            Talk to the team <Arrow />
          </Link>
        </div>
        {siblings.length > 0 && (
          <nav className="related-guides" aria-label="Related guides">
            <span className="eyebrow">NEXT TO READ</span>
            {siblings.map((item) => (
              <Link href={guidePath(item)} key={item.slug}>
                {item.title}
                <Arrow />
              </Link>
            ))}
          </nav>
        )}
      </article>
    </div>
  );
}

export function FAQPage() {
  return (
    <>
      <PageIntro
        category="FAQ"
        title="Before you buy."
        accent="Know how it works."
        description="Clear answers about the dedicated computer, agent capabilities, application access, ongoing costs, privacy, and where a person remains in control."
      />
      <section className="frame">
        <FAQList />
      </section>
      <RelatedPages slugs={["help", "products", "contact"]} />
    </>
  );
}

export function ContactPage({ privacy = false }: { privacy?: boolean }) {
  return (
    <>
      <PageIntro
        category={privacy ? "Privacy / Data requests" : "WICCLAW / Contact"}
        title={privacy ? "Your information." : "Tell us the work"}
        accent={privacy ? "Your question." : "you want to hand off."}
        description={
          privacy
            ? "Prepare a request about information associated with your enquiry or pilot. The team can explain the applicable process."
            : "Describe the process that takes your team's time, the applications it uses, how often it happens, and the result you would want to review."
        }
      />
      <section className="contact-layout frame">
        <aside>
          <span className="eyebrow">A DIRECT LINE</span>
          <a className="contact-email" href="mailto:hello@wicclaw.ai">
            hello@wicclaw.ai <Arrow />
          </a>
          <p>
            {privacy
              ? "Describe the enquiry or pilot your request concerns. Do not include identity documents or private credentials in the initial message."
              : "We can discuss whether a current configuration fits or the work needs a custom skill or integration. Keep customer records and credentials out of the first message."}
          </p>
          <div className="contact-help">
            <span className="eyebrow">BEFORE YOU WRITE</span>
            <Link href={privacy ? "/privacy" : "/help"}>
              {privacy
                ? "Read the privacy information"
                : "Browse the help center"}{" "}
              ↗
            </Link>
            <Link href={privacy ? "/terms" : "/faq"}>
              {privacy ? "Pilot documentation" : "Read common questions"} ↗
            </Link>
          </div>
        </aside>
        <InquiryForm privacy={privacy} />
      </section>
    </>
  );
}
