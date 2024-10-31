import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'bg-1': 'var(--color-bg-1)',
                'bg-2': 'var(--color-bg-2)',
                'bg-3': 'var(--color-bg-3)',
                'bg-4': 'var(--color-bg-4)',
                'bg-5': 'var(--color-bg-5)',
                'bg-6': 'var(--color-bg-6)',
                'txt-1': 'var(--color-txt-1)',
                'txt-2': 'var(--color-txt-2)',
                'txt-3': 'var(--color-txt-3)',
                'accent-1': 'var(--color-accent-1)',
                'accent-red': 'var(--color-accent-red)',
                'accent-green': 'var(--color-accent-green)',
                'unaccent-1': 'var(--color-unaccent-1)',
                'unaccent-accent-1': 'var(--color-unaccent-accent-1)',
                'unaccent-accent-2': 'var(--color-unaccent-accent-2)',
            },
        },
    },
    plugins: [],
}
export default config
