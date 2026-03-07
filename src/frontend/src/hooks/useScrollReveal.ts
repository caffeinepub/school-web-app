import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, the "revealed" class is added.
 * Pair with the `.reveal` / `.reveal.revealed` CSS classes in index.css.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
