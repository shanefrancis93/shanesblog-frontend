/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        darkgray: '#2D2D2D',       // Main dark mode background
        accentPurple: '#8A2BE2',   // Primary accent
        accentGreen: '#32CD32',    // Secondary accent
        cream: '#FAF9F6',          // Softer off-white cream
        purple: {
          50: '#faf5ff',
          // ... add other purple shades
        },
        green: {
          50: '#f0fdf4',
          // ... add other green shades
        },
        theme: {
          light: {
            bg: '#f5f2e8',      // Yellow-cream
            primary: '#5d4c7a',  // Red-violet
            secondary: '#586b4b', // Olive green
            text: '#2d1b38'      // Dark purple
          },
          dark: {
            bg: '#2D2D2D',      // Dark gray
            primary: '#e2e8f0',  // Light gray
            secondary: '#90cdf4', // Light blue
            text: '#f7fafc'      // Almost white
          }
        }
      },
      fontFamily: {
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '50%': '50%',
      },
      backgroundImage: {
        'repeat-2': 'repeat(2, 1fr)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 