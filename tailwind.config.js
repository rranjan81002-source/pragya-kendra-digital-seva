/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffeed5',
          200: '#feddab',
          300: '#fdcc81',
          400: '#fcbb57',
          500: '#fe9832', // primary_container (saffron vibrant)
          600: '#ed8b24', // primary_fixed_dim
          700: '#b06510',
          800: '#8b4b00', // primary (saffron base)
          900: '#7a4100', // primary_dim
        },
        secondary: {
          50: '#f3f1ff',
          100: '#e8e6f9',
          200: '#cbceff', // secondary_container
          300: '#babfff', // secondary_fixed_dim
          400: '#828cdc',
          500: '#4953ac', // secondary
          600: '#3d469f', // secondary_dim
          700: '#343d96', 
          800: '#1f2882', // on_secondary_fixed
          900: '#151c6b',
        },
        tertiary: {
          50: '#e8fae6',
          100: '#d1ffc8',
          200: '#9df197', // tertiary_container
          300: '#90e28a', // tertiary_fixed_dim
          400: '#5abf53',
          500: '#176a21', // tertiary
          600: '#12661e',
          700: '#025d16', // tertiary_dim
          800: '#00460e', // on_tertiary_fixed
          900: '#003309',
        },
        surface: {
          50: '#ffffff', // surface_container_lowest
          100: '#f7f7f2', // surface
          200: '#f1f1ec', // surface_container_low
          300: '#e8e9e3', // surface_container
          400: '#e2e3dd', // surface_container_high
          500: '#dcddd7', // surface_container_highest
          600: '#d3d5cf', // surface_dim
          700: '#9c9d99', // inverse_on_surface
          800: '#5a5c58', // on_surface_variant
          900: '#2d2f2c', // on_surface
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
