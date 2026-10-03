export const colors = {
  primary: "#C2410C",
  primaryPressed: "#9A3412",

  secondary: "#2F6B3C",
  secondaryPressed: "#24552F",

  background: "#FFF9F3",
  surface: "#FFFFFF",
  surfaceMuted: "#F5EFE8",

  text: "#1F2937",
  textSecondary: "#6B7280",
  textOnPrimary: "#FFFFFF",

  border: "#E7DED4",

  error: "#B42318",
  favorite: "#BE123C",

  overlay: "rgba(0, 0, 0, 0.5)",
  transparent: "transparent",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const fontSize = {
  caption: 13,
  body: 16,
  subtitle: 18,
  sectionTitle: 22,
  screenTitle: 30,
} as const;

export const lineHeight = {
  body: 24,
  subtitle: 26,
  screenTitle: 36,
} as const;

export const shadows = {
  card: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
} as const;