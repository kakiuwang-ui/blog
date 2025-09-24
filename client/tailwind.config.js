/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            lineHeight: '1.75',
            h1: {
              fontSize: '2.25rem',
              fontWeight: '700',
              lineHeight: '1.25',
            },
            h2: {
              fontSize: '1.875rem',
              fontWeight: '600',
              lineHeight: '1.3',
            },
            h3: {
              fontSize: '1.5rem',
              fontWeight: '600',
              lineHeight: '1.4',
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1f2937',
              color: '#f9fafb',
              borderRadius: '0.5rem',
              padding: '1rem',
              overflow: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
            },
            blockquote: {
              borderLeftColor: '#0ea5e9',
              borderLeftWidth: '4px',
              paddingLeft: '1rem',
              fontStyle: 'normal',
            },
            // Dark mode styles
            '--tw-prose-invert-body': '#d1d5db',
            '--tw-prose-invert-headings': '#f9fafb',
            '--tw-prose-invert-lead': '#9ca3af',
            '--tw-prose-invert-links': '#60a5fa',
            '--tw-prose-invert-bold': '#f9fafb',
            '--tw-prose-invert-counters': '#9ca3af',
            '--tw-prose-invert-bullets': '#6b7280',
            '--tw-prose-invert-hr': '#374151',
            '--tw-prose-invert-quotes': '#f3f4f6',
            '--tw-prose-invert-quote-borders': '#374151',
            '--tw-prose-invert-captions': '#9ca3af',
            '--tw-prose-invert-code': '#f9fafb',
            '--tw-prose-invert-pre-code': '#d1d5db',
            '--tw-prose-invert-pre-bg': '#1f2937',
            '--tw-prose-invert-th-borders': '#374151',
            '--tw-prose-invert-td-borders': '#4b5563',
          }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}