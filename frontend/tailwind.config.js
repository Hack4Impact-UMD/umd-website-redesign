/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'h4i-blue': '#0069CA',
        'h4i-blue-light': '#C2E0FB',
        'h4i-mint': '#80D2C8',
        'h4i-mint-light': '#CBF9F3',
        'h4i-black': '#333333',
        'h4i-gray': '#657788',
        'h4i-coral': '#F2594B',
        'text-secondary': '#4B5563',
        'text-link': '#0069CA',
        'state-primary-hover': '#004785',
        'state-primary-active': '#003563',
        'state-secondary-hover': '#E6F0FA',
        'state-secondary-active': '#D2E6F7',
        'state-success': '#15803D',
        'state-success-subtle': '#ECFDF3',
        'state-warning': '#B48C0B',
        'state-error': '#B91C1C',
        'state-error-subtle': '#FEF2F2',
        'state-info': '#0069CA',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        inverse: {
          DEFAULT: "hsl(var(--inverse))",
          foreground: "hsl(var(--inverse-foreground))",
        },
      },
      fontFamily: {
        heading: ['Karla', 'sans-serif'],
        body: ['Rubik', 'sans-serif'],
        karla: ['Karla', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '56px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h1': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '36px', letterSpacing: '0', fontWeight: '700' }],
        'h3': ['22px', { lineHeight: '30px', letterSpacing: '0', fontWeight: '700' }],
        'body': ['18px', { lineHeight: '24px', letterSpacing: '0', fontWeight: '400' }],
        'body-small': ['16px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '400' }],
        'label': ['16px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '700' }],
        'caption': ['14px', { lineHeight: '16px', letterSpacing: '0', fontWeight: '400' }],
      },
      screens: {
        'nav': '1000px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

