/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'brand-pink': '#E86C7D',
                'royal-blue': '#3F51B5',
                'light-blue': '#D6EAF4',
                'success-green': '#4CAF50',
                'light-gray': '#F5F5F5',
                'medium-gray': '#D3D3D3',
                'dark-gray': '#666666',
            },
            fontFamily: {
                sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
            },
        },
    },
    plugins: [require('daisyui')],
};