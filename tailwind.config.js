export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-green': 'var(--neon-green)',
        'neon-purple': 'var(--neon-purple)',
        'neon-gold': 'var(--neon-gold)',
        'deep-black': 'var(--deep-black)',
        'card-bg': 'var(--card-bg)',
        'lakers-purple': 'var(--lakers-purple)',
        'lakers-gold': 'var(--lakers-gold)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Rubik', 'sans-serif'],
      },
      animation: {
        glitch: 'glitch 0.3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in both',
        'basketball-bounce': 'basketballBounce 2s infinite',
        'lakers-float': 'lakersFloat 3s ease-in-out infinite',
        'particle-twinkle': 'particleTwinkle 2s ease-in-out infinite',
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
        basketballBounce: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) rotate(90deg)' },
          '50%': { transform: 'translateY(-10px) rotate(180deg)' },
          '75%': { transform: 'translateY(-30px) rotate(270deg)' },
        },
        lakersFloat: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.05)' },
        },
        particleTwinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.2)' },
        },
      },
    },
  },
}
