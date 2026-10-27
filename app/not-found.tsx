import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found frame">
      <span className="eyebrow">404 / A SMALL DETOUR</span>
      <h1>
        This page
        <br />
        <span>is off the grid.</span>
      </h1>
      <p>Find the WICCLAW Box product pages, explore a guide, or head back home.</p>
      <div>
        <Link className="outline-button" href="/">
          Back to WICCLAW ↗
        </Link>
        <Link className="text-link" href="/help">
          Visit the help center
        </Link>
      </div>
    </section>
  );
}
