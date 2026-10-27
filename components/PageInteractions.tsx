"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Arrow } from "./Brand";
import { faqs } from "@/data/faqs";

const examples = [
  {
    label: "Review",
    request:
      "Review this week's accessible transactions and flag items needing my attention. Do not change records.",
    result:
      "A review summary that groups the available items, identifies exceptions, and states what still needs a bookkeeper's judgment.",
    note: "Authorized information → a reviewable summary",
  },
  {
    label: "Research",
    request:
      "Find businesses matching these criteria and prepare a prospect brief with sources for me to check.",
    result:
      "A structured list from publicly available information, with sources, uncertainties, and next questions for your team.",
    note: "Public sources → findings your team can verify",
  },
  {
    label: "Report",
    request:
      "Prepare a weekly report from the information I provide and call out missing figures.",
    result:
      "A structured draft with the reporting period, source information, exceptions, and gaps that need review.",
    note: "Your business context → a clearer overview",
  },
  {
    label: "Status",
    request:
      "Help me understand the device status and the last result for this task.",
    result:
      "Review the heartbeat, queue state, and task result for the configured business workflow.",
    note: "Your request → operational visibility",
  },
];

export function WorkflowExample() {
  const [active, setActive] = useState(0);
  return (
    <div className="conversation-demo">
      <div className="demo-top">
        <span className="eyebrow">TELEGRAM / ILLUSTRATIVE EXAMPLE</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div
        className="demo-tabs"
        role="group"
        aria-label="Choose a workflow example"
      >
        {examples.map((item, i) => (
          <button
            type="button"
            key={item.label}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="demo-conversation" aria-live="polite">
        <div className="demo-message owner">
          <span>BUSINESS OWNER</span>
          <p>{examples[active].request}</p>
        </div>
        <div className="demo-message">
          <span>EXAMPLE OUTPUT</span>
          <p>{examples[active].result}</p>
        </div>
      </div>
      <div className="demo-bottom">{examples[active].note}</div>
    </div>
  );
}

export function HelpSearch({
  articles,
}: {
  articles: {
    category: string;
    title: string;
    summary: string;
    href: string;
  }[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const categories = [
    "All topics",
    ...new Set(articles.map((article) => article.category)),
  ];
  const result = articles.filter(
    (article) =>
      (category === "All topics" || article.category === category) &&
      `${article.title} ${article.summary} ${article.category}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="help-browser">
      <label className="search-label" htmlFor="guide-search">
        Find a guide
      </label>
      <div className="search-field">
        <input
          id="guide-search"
          type="search"
          placeholder="Try pairing, permissions, or a delayed task…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span aria-hidden="true">↗</span>
      </div>
      <div
        className="topic-filters"
        role="group"
        aria-label="Filter help topics"
      >
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="search-count" aria-live="polite">
        {result.length} {result.length === 1 ? "guide" : "guides"}
        {query ? ` matching “${query}”` : " to help you move forward"}
      </p>
      <div className="help-results">
        {result.map((article) => (
          <Link key={article.href} href={article.href} className="guide-card">
            <span className="eyebrow">{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <Arrow />
          </Link>
        ))}
      </div>
      {!result.length && (
        <div className="empty-results">
          <h3>No guide matches yet.</h3>
          <p>Try a shorter phrase or browse all topics.</p>
          <button
            type="button"
            className="outline-button"
            onClick={() => {
              setQuery("");
              setCategory("All topics");
            }}
          >
            Show all guides <Arrow />
          </button>
        </div>
      )}
    </div>
  );
}

export function FAQList() {
  const [category, setCategory] = useState("All questions");
  return (
    <div className="faq-browser">
      <div className="topic-filters" role="group" aria-label="Filter questions">
        {["All questions", ...new Set(faqs.map((item) => item.category))].map(
          (item) => (
            <button
              type="button"
              key={item}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>
      <div className="faq-list">
        {faqs
          .filter(
            (item) =>
              category === "All questions" || category === item.category,
          )
          .map((item) => (
            <details key={item.question}>
              <summary>
                <span>{item.question}</span>
                <span className="faq-symbol" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
      </div>
    </div>
  );
}

export function InquiryForm({ privacy = false }: { privacy?: boolean }) {
  const [draft, setDraft] = useState<{ href: string; body: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const topic = String(form.get("topic"));
    const body = `Name: ${form.get("name")}\nReply email: ${form.get("email")}\nBusiness: ${form.get("business") || "Not specified"}\nTopic: ${topic}\n\n${form.get("message")}`;
    setDraft({
      href: `mailto:hello@wicclaw.ai?subject=${encodeURIComponent(`WICCLAW — ${topic}`)}&body=${encodeURIComponent(body)}`,
      body,
    });
    setCopied(false);
    setCopyError(false);
  }
  return (
    <form
      className="inquiry-form"
      onSubmit={prepare}
      onChange={() => {
        setDraft(null);
        setCopied(false);
        setCopyError(false);
      }}
    >
      <div className="form-title">
        <span className="eyebrow">
          {privacy ? "YOUR DATA QUESTION" : "START A CONVERSATION"}
        </span>
        <h2>{privacy ? "Tell us what you need." : "Describe the job."}</h2>
      </div>
      <div className="form-grid">
        <label>
          Your name
          <input name="name" autoComplete="name" maxLength={120} required />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={160}
            required
          />
        </label>
        <label>
          Business <span className="optional">(optional)</span>
          <input name="business" autoComplete="organization" maxLength={160} />
        </label>
        <label>
          {privacy ? "Request type" : "I’m interested in"}
          <select name="topic">
            {(privacy
              ? [
                  "Privacy question",
                  "Access to my information",
                  "Correct my information",
                  "Delete my information",
                ]
              : [
                  "WICCLAW Box pilot",
                  "WICCLAW Fleet deployment",
                  "Existing pilot support",
                  "Business partnership",
                  "Press enquiry",
                ]
            ).map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label className="full-width">
          {privacy
            ? "Describe your request"
            : "What task repeats, which tools are involved, and what result do you need?"}
          <textarea
            name="message"
            rows={5}
            maxLength={2500}
            required
            placeholder={
              privacy
                ? "Describe the information or enquiry your request relates to."
                : "Describe the current steps, how often the work happens, and what you would want to review."
            }
          />
        </label>
      </div>
      <p className="form-note">
        This form prepares an email draft. It is sent only when you send it
        from your email app. Please leave out passwords, verification codes,
        customer records, and financial details.
      </p>
      <button className="outline-button" type="submit">
        Prepare email <Arrow />
      </button>
      {draft && (
        <div className="draft-result" role="status">
          <h3>Your email draft is ready.</h3>
          <p>
            Open it in your email app, review it, and send it to
            hello@wicclaw.ai.
          </p>
          <div className="draft-actions">
            <a className="outline-button" href={draft.href}>
              Open email app <Arrow />
            </a>
            <button
              type="button"
              className="text-link"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(draft.body);
                  setCopied(true);
                  setCopyError(false);
                } catch {
                  setCopyError(true);
                }
              }}
            >
              {copied ? "Copied" : "Copy message"}
            </button>
          </div>
          {copyError && (
            <p>
              Copy is unavailable in this browser. Select the message below to
              copy it manually.
            </p>
          )}
          <details>
            <summary>Review your message</summary>
            <pre>{draft.body}</pre>
          </details>
        </div>
      )}
    </form>
  );
}
