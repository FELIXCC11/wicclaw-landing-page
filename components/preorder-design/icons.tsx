import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement> & { size?: number };
function icon(path: string) {
  return function Icon({ size = 24, ...props }: Props) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={path} /></svg>;
  };
}
export const ChevronLeft = icon("m15 18-6-6 6-6");
export const ChevronRight = icon("m9 18 6-6-6-6");
export const Menu = icon("M4 8h16M4 16h16");
export const X = icon("m6 6 12 12M6 18 18 6");
export const Play = icon("m8 5 11 7-11 7Z");
export const Pause = icon("M8 5v14M16 5v14");
export const Plus = icon("M12 5v14M5 12h14");
export const ShoppingBag = icon("M5 7h14l1 14H4L5 7ZM8 7V5a4 4 0 0 1 8 0v2");
export const Search = icon("M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0");
