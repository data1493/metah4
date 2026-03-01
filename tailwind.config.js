export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-green': '#FDB927', // Lakers gold
        'neon-purple': '#542583', // Lakers purple
        'neon-gold': '#FDB927',
        'deep-black': '#0a0a0a',
        'card-bg': '#111111',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Rubik', 'sans-serif'],
      },
      animation: {
        glitch: 'glitch 0.3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in both',
      },
      keyframes: {
        glitch: {
          '0%':   { textShadow: '2px 0 #FDB927, -2px 0 #542583' },
          '25%':  { textShadow: '-2px 0 #FDB927, 2px 0 #542583' },
          '50%':  { textShadow: '2px 2px #FDB927, -2px -2px #542583' },
          '75%':  { textShadow: '-2px 2px #542583, 2px -2px #FDB927' },
          '100%': { textShadow: '2px 0 #FDB927, -2px 0 #542583' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}
