import type Lenis from "lenis";

export function scrollToId(id: string) {
  if (typeof window === "undefined") return;

  const cleanId = id.startsWith("#") ? id.slice(1) : id;
  const element = document.getElementById(cleanId);
  if (!element) return;

  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(element, { offset: -80 });
  } else {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}