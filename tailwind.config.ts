import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                // Override gray to use theme colors
                gray: {
                    50: 'hsl(var(--muted))',
                    100: 'hsl(var(--muted))',
                    200: 'hsl(var(--border))',
                    300: 'hsl(var(--border))',
                    400: 'hsl(var(--muted-foreground))',
                    500: 'hsl(var(--muted-foreground))',
                    600: 'hsl(var(--foreground) / 0.6)',
                    700: 'hsl(var(--foreground) / 0.7)',
                    800: 'hsl(var(--foreground) / 0.8)',
                    900: 'hsl(var(--foreground))',
                },
                // Zapta Design System Colors
                zapta: {
                    black: 'var(--black)',
                    textBlack: 'var(--text-black)',
                    textBlack2: 'var(--textblack2)',
                    borderColor: 'var(--bordercolor)',
                    white: 'var(--white)',
                    offWhite: 'var(--offwhite)',
                    whiteShade: 'var(--whiteshade)',
                    offBlue: 'var(--offblue)',
                    offWhite3: 'var(--offwhite3)',
                    grayShade: 'var(--grayshade)',
                    offWhite2: 'var(--offwhite2)',
                    footerText: 'var(--footertext)',
                    primaryBlue: 'var(--primaryblue)',
                    primaryBg: 'var(--primaryBg)',
                    primaryBlue2: 'var(--primaryblue2)',
                    primaryBlue3: 'var(--primaryblue3)',
                    primaryBlue4: 'var(--primaryblue4)',
                    primaryBlue5: 'var(--primaryblue5)',
                    primaryBlue6: 'var(--primaryblue6)',
                    blueShade: 'var(--blueshade)',
                    blueShade2: 'var(--blueshade2)',
                    lightPrimary: 'var(--lightprimary)',
                    greenShade: 'var(--greenshade)',
                    darkGreenShade: 'var(--darkgreenshade)',
                    errorColor: 'var(--errorcolor)',
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
export default config
