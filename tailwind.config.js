/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './emails/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Contemporary Chic — Oatmeal / Deep Espresso / Soft Mauve
        ivory:         '#F5F0E8',  // Oatmeal/Cream — primary page background
        'ivory-dark':  '#EDE8DC',  // Warm beige — inputs, borders, hover surfaces
        ebony:         '#1E110A',  // Deep Espresso — text, logo, nav (17:1 on ivory ✓)
        'ebony-light': '#7A5C48',  // Warm brown — secondary text (4.8:1 on ivory ✓)
        'ebony-dark':  '#120B06',  // Near-black espresso — footer bg, darkest elements
        // Soft Mauve accent — primary buttons, CTAs, active states
        gold:          '#9E7B8C',
        'gold-light':  '#B89AA8',
        'gold-dark':   '#7D5D6E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-right': 'slideRight 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
