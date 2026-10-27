export function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={down ? "arrow-down" : ""}
    >
      <path d="M5 5l14 14M5 19h14V5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
export function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/Logo-orange.png"
      alt="WICCLAW"
      width="180"
      height="60"
      className="logo"
    />
  );
}
