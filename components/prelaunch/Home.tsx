import Link from "next/link";
export default function PrelaunchHome() {
  return <section className="launch-hero">
    <p className="launch-eyebrow">THE NEXT CHAPTER OF WORK</p>
    <h1>AI That Doesn&apos;t Just Think.<br />It Works.</h1>
    <div className="launch-hero-detail"><div><p className="launch-intro">Meet your autonomous AI workforce.</p><p>WICCLAW connects to your tools, handles repetitive tasks, and turns instructions into real work.</p></div>
      <div className="launch-actions"><Link className="launch-button" href="/request-demo">REQUEST A DEMO <span aria-hidden="true">↗</span></Link><Link className="launch-button launch-secondary" href="/pre-order">PRE-ORDER — $49 <span aria-hidden="true">↗</span></Link></div>
    </div>
  </section>;
}
