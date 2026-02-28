export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39ff14',
        'neon-purple': '#d400ff',
        'neon-gold': '#ffd700',
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
          '0%':   { textShadow: '2px 0 #39ff14, -2px 0 #d400ff' },
          '25%':  { textShadow: '-2px 0 #39ff14, 2px 0 #d400ff' },
          '50%':  { textShadow: '2px 2px #ffd700, -2px -2px #d400ff' },
          '75%':  { textShadow: '-2px 2px #d400ff, 2px -2px #39ff14' },
          '100%': { textShadow: '2px 0 #39ff14, -2px 0 #d400ff' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}
