/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F1225',
          surface: '#171B34',
          alt: '#1E2340',
          line: '#2A2F52',
        },
        amber: {
          DEFAULT: '#F2B84B',
          soft: '#F7D07E',
        },
        teal: {
          DEFAULT: '#4FD1C5',
          soft: '#8FE6DC',
        },
        ivory: {
          DEFAULT: '#EDEBFF',
          muted: '#8B90B3',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(circle at 20% 20%, rgba(242,184,75,0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(79,209,197,0.10), transparent 45%)',
      },
    },
  },
  plugins: [],
};
