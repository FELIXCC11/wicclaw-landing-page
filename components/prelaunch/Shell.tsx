import Link from "next/link";
import "./prelaunch.css";

export default function PrelaunchShell({ children }: { children: React.ReactNode }) {
  return <div className="launch">
    <a className="launch-skip" href="#launch-main">Skip to content</a>
    <header className="launch-header">
      <Link href="/" aria-label="WICCLAW home" className="launch-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Logo-orange.png" width="156" height="52" alt="WICCLAW" />
      </Link>
      <nav aria-label="Main navigation"><Link href="/request-demo">Request a Demo</Link><Link href="/pre-order">Pre-Order <span aria-hidden="true">↗</span></Link></nav>
    </header>
    <div className="launch-scene" aria-hidden="true"><iframe title="Decorative ASCII mountain landscape" src="/prelaunch/landscape.html" tabIndex={-1} /></div>
    <main id="launch-main">{children}</main>
    <footer className="launch-footer"><span>QUIET INTELLIGENCE. REAL EXECUTION.</span><Link href="/privacy">Privacy</Link></footer>
  </div>;
}
