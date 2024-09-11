module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'background-gray': 'var(--background-gray)',
      },
      keyframes: {
        'outer-glow-cycle': {
          '0%, 100%': { boxShadow: '0 0 10px 1.5px rgba(255, 0, 0, 0.5)' }, // Red glow
          '16%': { boxShadow: '0 0 10px 1.5px rgba(255, 165, 0, 0.5)' }, // Orange glow
          '32%': { boxShadow: '0 0 10px 1.5px rgba(255, 255, 0, 0.5)' }, // Yellow glow
          '48%': { boxShadow: '0 0 10px 1.5px rgba(0, 255, 0, 0.5)' }, // Green glow
          '64%': { boxShadow: '0 0 10px 1.5px rgba(0, 255, 255, 0.5)' }, // Cyan glow
          '80%': { boxShadow: '0 0 10px 1.5px rgba(0, 0, 255, 0.5)' }, // Blue glow
          '96%': { boxShadow: '0 0 10px 1.5px rgba(255, 0, 255, 0.5)' }, // Magenta glow
        },
        'inner-glow-cycle': {
          '0%, 100%': { boxShadow: 'inset 0 0 10px 1.5px rgba(255, 0, 0, 0.5)' }, // Red glow
          '16%': { boxShadow: 'inset 0 0 10px 1.5px rgba(255, 165, 0, 0.5)' }, // Orange glow
          '32%': { boxShadow: 'inset 0 0 10px 1.5px rgba(255, 255, 0, 0.5)' }, // Yellow glow
          '48%': { boxShadow: 'inset 0 0 10px 1.5px rgba(0, 255, 0, 0.5)' }, // Green glow
          '64%': { boxShadow: 'inset 0 0 10px 1.5px rgba(0, 255, 255, 0.5)' }, // Cyan glow
          '80%': { boxShadow: 'inset 0 0 10px 1.5px rgba(0, 0, 255, 0.5)' }, // Blue glow
          '96%': { boxShadow: 'inset 0 0 10px 1.5px rgba(255, 0, 255, 0.5)' }, // Magenta glow
        }
      },
      animation: {
        'outer-glow-cycle': 'outer-glow-cycle 5s infinite',
        'inner-glow-cycle': 'inner-glow-cycle 5s infinite',
      },
    },
  },
  plugins: [],
};
