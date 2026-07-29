export const animationConfig = {
  easing: {
    standard: [0.22, 1, 0.36, 1] as const,
    subtle: [0.25, 0.1, 0.25, 1] as const,
  },
  duration: {
    fast: 180,
    normal: 280,
    slow: 480,
  },
  scroll: {
    lerp: 0.08,
  },
} as const;