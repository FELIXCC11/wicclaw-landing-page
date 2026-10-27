const views = [
  { src: "rear-port.png", alt: "WICCLAW Box rear view" },
  { src: "Right.png", alt: "Business accounting workspace" },
  { src: "side.png", alt: "WICCLAW Box side view" },
  { src: "top.png", alt: "WICCLAW Box top view" },
];

export function DesignScene() {
  return <section className="design-section design-static section-pad" id="design" aria-label="WICCLAW AI agent work desktop">
    <header className="section-intro">
      <p className="eyebrow">Your AI agent work desktop</p>
      <h2>A place for AI.<br /><span className="teal">More time for you.</span></h2>
      <p className="intro-copy">WICCLAW Box gives your AI agent a dedicated desktop for supported business workflows. Connect the tools you use, delegate everyday tasks, and review the results.</p>
    </header>
    <div className="design-static-grid content-width">
      {views.map(view => (
        // These supplied product images are served unchanged, like the other showcase media.
        // eslint-disable-next-line @next/next/no-img-element
        <img key={view.src} src={`/site/wicclaw/${view.src}`} alt={view.alt} loading="lazy" />
      ))}
    </div>
  </section>;
}
