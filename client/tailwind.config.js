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
                'dark-bg': '#0f172a', // Slate 900
                'dark-panel': '#1e293b', // Slate 800
                'dark-card': '#334155', // Slate 700
                'dark-border': '#475569', // Slate 600
                'light-bg': '#f8fafc', // Slate 50
                'light-text': '#0f172a', // Slate 900
                'accent-teal': '#14b8a6', // Teal 500
                'accent-blue': '#3b82f6', // Blue 500
                'accent-purple': '#8b5cf6', // Violet 500
            }
        },
    },
    plugins: [],
}
