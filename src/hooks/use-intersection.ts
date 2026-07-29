"use client";

import { RefObject, useEffect, useState } from "react";

export function useIntersection<T extends Element>(
  ref: RefObject<T>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(Boolean(entry?.isIntersecting));
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options, ref]);

  return isIntersecting;
}