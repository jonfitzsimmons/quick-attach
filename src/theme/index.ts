import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

/**
 * Custom theme configuration for the design system
 * This can be extended and customized per project
 */
export const theme = defineConfig({
  // Color palette - customize these for your brand
  theme: {
    tokens: {
      colors: {
        // Primary brand colors - cool grey scale
        primary: {
          50: { value: "#f8f9fa" },
          100: { value: "#e9ecef" },
          200: { value: "#dee2e6" },
          300: { value: "#ced4da" },
          400: { value: "#adb5bd" },
          500: { value: "#6c757d" }, // Main brand color
          600: { value: "#495057" },
          700: { value: "#343a40" },
          800: { value: "#212529" },
          900: { value: "#1a1d20" },
        },
        // Secondary colors - cool blue-grey
        secondary: {
          50: { value: "#f1f3f5" },
          100: { value: "#e2e8f0" },
          200: { value: "#cbd5e1" },
          300: { value: "#94a3b8" },
          400: { value: "#64748b" },
          500: { value: "#475569" }, // More subdued blue-grey
          600: { value: "#334155" },
          700: { value: "#1e293b" },
          800: { value: "#0f172a" },
          900: { value: "#020617" },
        },
        // Semantic colors
        success: {
          50: { value: "#f0fdf4" },
          100: { value: "#dcfce7" },
          200: { value: "#bbf7d0" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
          700: { value: "#15803d" },
          800: { value: "#166534" },
          900: { value: "#14532d" },
        },
        warning: {
          50: { value: "#fffbeb" },
          100: { value: "#fef3c7" },
          200: { value: "#fde68a" },
          300: { value: "#fcd34d" },
          400: { value: "#fbbf24" },
          500: { value: "#f59e0b" },
          600: { value: "#d97706" },
          700: { value: "#b45309" },
          800: { value: "#92400e" },
          900: { value: "#78350f" },
        },
        error: {
          50: { value: "#fef2f2" },
          100: { value: "#fee2e2" },
          200: { value: "#fecaca" },
          300: { value: "#fca5a5" },
          400: { value: "#f87171" },
          500: { value: "#ef4444" },
          600: { value: "#dc2626" },
          700: { value: "#b91c1c" },
          800: { value: "#991b1b" },
          900: { value: "#7f1d1d" },
        },
      },
      fonts: {
        heading: { value: "system-ui, -apple-system, sans-serif" },
        body: { value: "system-ui, -apple-system, sans-serif" },
        mono: { value: "ui-monospace, SFMono-Regular, monospace" },
      },
      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
        "3xl": { value: "1.875rem" },
        "4xl": { value: "2.25rem" },
        "5xl": { value: "3rem" },
        "6xl": { value: "3.75rem" },
      },
      fontWeights: {
        normal: { value: "400" },
        medium: { value: "500" },
        semibold: { value: "600" },
        bold: { value: "700" },
      },
      radii: {
        none: { value: "0" },
        sm: { value: "0.5rem" }, // 8px
        md: { value: "1rem" }, // 16px - default
        lg: { value: "1.5rem" }, // 24px
        xl: { value: "2rem" }, // 32px
        "2xl": { value: "2.5rem" }, // 40px
        "3xl": { value: "3rem" }, // 48px - iOS-style continuous curve
        full: { value: "9999px" },
      },
      spacing: {
        xs: { value: "0.5rem" },
        sm: { value: "0.75rem" },
        md: { value: "1rem" },
        lg: { value: "1.5rem" },
        xl: { value: "2rem" },
        "2xl": { value: "3rem" },
        "3xl": { value: "4rem" },
      },
      sizes: {
        // Mobile-friendly button sizes (44px minimum tap target)
        button: {
          sm: {
            height: { value: "2.75rem" }, // 44px - minimum for mobile
            minHeight: { value: "2.75rem" },
            px: { value: "1rem" },
            fontSize: { value: "0.875rem" },
          },
          md: {
            height: { value: "3rem" }, // 48px - slightly larger
            minHeight: { value: "3rem" },
            px: { value: "1.25rem" },
            fontSize: { value: "1rem" },
          },
          lg: {
            height: { value: "3.5rem" }, // 56px - largest
            minHeight: { value: "3.5rem" },
            px: { value: "1.5rem" },
            fontSize: { value: "1.125rem" },
          },
        },
      },
      shadows: {
        sm: { value: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
        md: { value: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
        lg: { value: "0 10px 15px -3px rgb(0 0 0 / 0.1)" },
        xl: { value: "0 20px 25px -5px rgb(0 0 0 / 0.1)" },
      },
    },
    semanticTokens: {
      colors: {
        "bg.primary": { value: { base: "white", _dark: "gray.900" } },
        "bg.secondary": { value: { base: "gray.50", _dark: "gray.800" } },
        "text.primary": { value: { base: "gray.900", _dark: "white" } },
        "text.secondary": { value: { base: "gray.600", _dark: "gray.400" } },
        "border.base": { value: { base: "gray.200", _dark: "gray.700" } },
      },
      radii: {
        // Default border radius for components
        "component": { value: { base: "radii.md" } }, // 16px
      },
    },
  },
})

export const system = createSystem(defaultConfig, theme)

