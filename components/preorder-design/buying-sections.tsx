"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "./icons";
import assets from "./assets.json";

const assetPath = (filename: string) => filename.startsWith("/") ? filename : `/sites/apple/${filename}`;

const benefits = [
  { icon: "icon_applecard", title: "Start small.\nReserve for $20.", text: "Review the terms, then reserve WICCLAW Box when ordering opens.", detail: "A $20 WICCLAW Box reservation is credited toward the $799 hardware price, leaving a $779 hardware balance per unit. The balance is requested separately and is never charged automatically. A reservation is for future delivery, not immediate shipment." },
  { icon: "icon_tradein", title: "Your next\nwork computer.", text: "A compact Windows 11 Pro PC for the work you do every day.", detail: "WICCLAW Box combines an AMD Ryzen 7 7735HS processor, Radeon 680M integrated graphics, 16GB LPDDR5 memory, and a 1TB NVMe SSD. WICCLAW workflows and setup are separate unless included in your written offer." },
  { icon: "icon_edu", title: "Learn it.\nMake it yours.", text: "Explore practical workflows and get started at your own pace.", detail: "Visit the WICCLAW getting-started guides to learn how a supported workflow connects to your existing tools. Start with one task and expand as your needs grow." },
  { icon: "icon_customize", title: "Choose your\nWICCLAW Box.", text: "Review the current Core configuration and your purchase option.", detail: "The $799 WICCLAW Box preorder is for the standard 16GB LPDDR5 configuration, with a $20 reservation option. A 24GB LPDDR5 option is coming soon and remains unpriced. The separate upcoming WICCLAW Box model is also unpriced. Check the exact configuration in the order review." },
  { icon: "icon_delivery", title: "Delivery,\nmade clear.", text: "Review shipping and tax before you confirm a purchase.", detail: "A preorder is for future delivery. Final delivery dates have not been published. Available destinations, carrier charges, and applicable tax must be shown in the purchase flow before payment." },
  { icon: "icon_personal", title: "A thoughtful\nfirst setup.", text: "Start with supported tools and a workflow that fits your business.", detail: "WICCLAW supports configured workflows controlled through Telegram today. Setup and support included in a paid offer will be described in its written terms." },
  { icon: "icon_specialist", title: "Questions?\nLet’s talk.", text: "Get help choosing your workflow, hardware, and next steps.", detail: "The WICCLAW team can help you understand the current capabilities, planned features, and what your first workflow needs. Visit Contact or Help from the main site." },
  { icon: "icon_applestore", title: "One workspace.\nMore possibilities.", text: "Connect approved tools and build on a setup you understand.", detail: "Connect the services your workflow needs, set permissions, and review important actions. Additional software, AI usage, third-party services, and support may have separate costs." },
] as const;

function DetailDialog({ detail, close }: { detail: { title: string; detail: string } | null; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!detail) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.showModal();
    return () => { document.body.style.overflow = previous; };
  }, [detail]);
  if (!detail) return null;
  return <dialog ref={ref} className="product-dialog detail-dialog" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }} aria-label={detail.title.replaceAll("\n", " ")}><button className="dialog-close" onClick={close} aria-label="Close details"><X /></button><p className="eyebrow">WICCLAW</p><h2>{detail.title}</h2><p>{detail.detail}</p><Link className="text-link" href="/shop/buy-wicclaw">Explore WICCLAW Box <ChevronRight size={16} /></Link></dialog>;
}

export function BuyingGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [detail, setDetail] = useState<(typeof benefits)[number] | null>(null);
  const move = (direction: number) => {
    const track = ref.current;
    if (!track) return;
    const card = track.children[0] as HTMLElement;
    const step = card.offsetWidth + parseFloat(getComputedStyle(track).gap);
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  };
  return <section className="buy-reasons section-pad" id="why-wicclaw"><div className="wide section-heading"><h2>One device.<br />More possibilities.</h2><Link className="text-link" href="/shop/buy-wicclaw">Explore WICCLAW Box <ChevronRight size={16} /></Link></div>
    <div className="reasons-track" ref={ref} tabIndex={0} aria-label="Benefits of buying WICCLAW Box" onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }} onScroll={event => { const el = event.currentTarget; setPosition(el.scrollLeft); setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 3); }}>
      {benefits.map(item => <article key={item.icon}><img src={assetPath(assets[item.icon])} alt="" /><h3>{item.title}</h3><p>{item.text}</p><button className="more-circle" onClick={() => setDetail(item)} aria-label={`Learn more: ${item.title.replaceAll("\n", " ")}`}><Plus size={20} /></button></article>)}
    </div><div className="wide reasons-controls"><button className="round-control" onClick={() => move(-1)} disabled={position < 2} aria-label="Previous buying benefits"><ChevronLeft /></button><button className="round-control" onClick={() => move(1)} disabled={atEnd} aria-label="Next buying benefits"><ChevronRight /></button></div><DetailDialog detail={detail} close={() => setDetail(null)} />
  </section>;
}

const environment = [
  { icon: "recycle", title: "Thoughtful materials.\nA smaller footprint.", lead: "Thoughtful materials.", detail: "The product imagery remains a temporary reference. WICCLAW will publish material and recycling information for the final WICCLAW Box hardware rather than apply another manufacturer's environmental claims." },
  { icon: "bolt", title: "Less space.\nMore intention.", lead: "Less space.", detail: "A dedicated compact computer is central to the WICCLAW Box design. Power use and efficiency details will be measured against the final configuration and published with the hardware specifications." },
  { icon: "box", title: "Made to arrive\nready for work.", lead: "Made to arrive", detail: "Packaging, included accessories, and setup details will be confirmed before WICCLAW Box orders open. Review the hardware and shipping pages for the current information." },
] as const;
export function EnvironmentSection() {
  const [detail, setDetail] = useState<(typeof environment)[number] | null>(null);
  return <section className="environment-section section-pad" id="environment"><div className="wide"><div className="section-heading"><h2>WICCLAW Box and the environment.</h2><Link className="text-link" href="/hardware">Explore our hardware <ChevronRight size={16} /></Link></div><div className="environment-grid">{environment.map(item => <article key={item.icon}><img src={assetPath(assets[item.icon])} alt="" /><h3>{item.title.split("\n")[0]}<br /><span>{item.title.split("\n")[1]}</span></h3><button className="more-circle" aria-label={`Learn more: ${item.lead}`} onClick={() => setDetail(item)}><Plus size={20} /></button></article>)}</div></div><DetailDialog detail={detail} close={() => setDetail(null)} /></section>;
}
