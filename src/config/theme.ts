import { designSystemTokens } from "@/design-system"

export const themeConfig = {
  colors: {
    background: designSystemTokens.colors.semantic.background,
    foreground: designSystemTokens.colors.semantic.textPrimary,
    accent: designSystemTokens.colors.accent[600],
    primary: designSystemTokens.colors.primary[600],
    secondary: designSystemTokens.colors.secondary[100],
    success: designSystemTokens.colors.success[600],
    warning: designSystemTokens.colors.warning[500],
    danger: designSystemTokens.colors.danger[600],
    info: designSystemTokens.colors.info[600],
  },
  layout: {
    container: designSystemTokens.containers.xl,
    sectionPadding: "clamp(4rem, 7vw, 8rem)",
  },
  typography: {
    heading: "Space Grotesk",
    body: "Manrope",
    mono: "IBM Plex Mono",
  },
  spacing: designSystemTokens.spacing,
  radius: designSystemTokens.radius,
  shadows: designSystemTokens.shadows,
  containers: designSystemTokens.containers,
  grid: designSystemTokens.grid,
  breakpoints: designSystemTokens.breakpoints,
  icons: designSystemTokens.icons,
  zIndex: designSystemTokens.zIndex,
} as const