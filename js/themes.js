/**
 * Theme System
 * Trending color palettes for the interactive book
 */

const Themes = {
    /**
     * Available color palettes
     * Each theme includes all CSS variables needed
     */
    palettes: {
        // Original theme (default)
        'classic': {
            name: 'Classic Elegance',
            description: 'Original warm, sophisticated palette',
            emoji: '🏛️',
            colors: {
                '--color-cream': '#F8F5F0',
                '--color-paper': '#FFFEF9',
                '--color-paper-back': '#F5F2ED',
                '--color-ink': '#1A1612',
                '--color-ink-light': '#4A4540',
                '--color-ink-faded': '#8A857D',
                '--color-red': '#8B2323',
                '--color-red-dark': '#5C1717',
                '--color-gold': '#B8956A',
                '--color-gold-light': '#D4B896'
            },
            background: 'linear-gradient(135deg, #2C2420 0%, #1A1612 50%, #0D0B0A 100%)'
        },

        // Trending: Dark Academia
        'dark-academia': {
            name: 'Dark Academia',
            description: 'Deep greens and browns, scholarly aesthetic',
            emoji: '📚',
            colors: {
                '--color-cream': '#E8E3D5',
                '--color-paper': '#F5F3E8',
                '--color-paper-back': '#EBE8DC',
                '--color-ink': '#1C1A15',
                '--color-ink-light': '#3D3A30',
                '--color-ink-faded': '#6B6756',
                '--color-red': '#5C4033',
                '--color-red-dark': '#3E2B23',
                '--color-gold': '#8B7355',
                '--color-gold-light': '#A89379'
            },
            background: 'linear-gradient(135deg, #2F3E2C 0%, #1C1F1A 50%, #0F1211 100%)'
        },

        // Trending: Midnight Blue
        'midnight-blue': {
            name: 'Midnight Blue',
            description: 'Cool blues and silver, modern and calm',
            emoji: '🌙',
            colors: {
                '--color-cream': '#E8ECF1',
                '--color-paper': '#F8FAFD',
                '--color-paper-back': '#EDF1F5',
                '--color-ink': '#0F1419',
                '--color-ink-light': '#2E3A47',
                '--color-ink-faded': '#5C6B7A',
                '--color-red': '#3D5A80',
                '--color-red-dark': '#293F5C',
                '--color-gold': '#7D9CAF',
                '--color-gold-light': '#A3BFD1'
            },
            background: 'linear-gradient(135deg, #1B2838 0%, #0F1419 50%, #08090C 100%)'
        },

        // Trending: Rose Gold
        'rose-gold': {
            name: 'Rose Gold',
            description: 'Soft pinks and golds, feminine and luxe',
            emoji: '🌸',
            colors: {
                '--color-cream': '#F5E6E8',
                '--color-paper': '#FFF8F9',
                '--color-paper-back': '#F8EEF0',
                '--color-ink': '#2C1618',
                '--color-ink-light': '#5C3A3E',
                '--color-ink-faded': '#8A6E72',
                '--color-red': '#B76E79',
                '--color-red-dark': '#8B4A53',
                '--color-gold': '#D4A5A5',
                '--color-gold-light': '#E8C5C5'
            },
            background: 'linear-gradient(135deg, #4A2C33 0%, #2C1618 50%, #1A0D0F 100%)'
        },

        // Trending: Forest Green
        'forest-green': {
            name: 'Forest Green',
            description: 'Natural greens and earth tones, organic feel',
            emoji: '🌲',
            colors: {
                '--color-cream': '#E8EDE5',
                '--color-paper': '#F7FAF5',
                '--color-paper-back': '#EDF2EA',
                '--color-ink': '#1A2419',
                '--color-ink-light': '#3A4839',
                '--color-ink-faded': '#6B7A6A',
                '--color-red': '#5C704A',
                '--color-red-dark': '#3E4A31',
                '--color-gold': '#8B9E7D',
                '--color-gold-light': '#A8BFA0'
            },
            background: 'linear-gradient(135deg, #2E3E2F 0%, #1A2419 50%, #0F1410 100%)'
        },

        // Trending: Lavender Dreams
        'lavender': {
            name: 'Lavender Dreams',
            description: 'Soft purples and lilacs, dreamy aesthetic',
            emoji: '💜',
            colors: {
                '--color-cream': '#EDE8F0',
                '--color-paper': '#FAF7FC',
                '--color-paper-back': '#F2EDF5',
                '--color-ink': '#1F1624',
                '--color-ink-light': '#433A4A',
                '--color-ink-faded': '#736A7D',
                '--color-red': '#7D5C8B',
                '--color-red-dark': '#5A3E6B',
                '--color-gold': '#A38BB5',
                '--color-gold-light': '#C5AED7'
            },
            background: 'linear-gradient(135deg, #372842 0%, #1F1624 50%, #120D16 100%)'
        },

        // Trending: Minimalist Gray
        'minimalist': {
            name: 'Minimalist Gray',
            description: 'Clean grays and whites, modern minimal',
            emoji: '⚪',
            colors: {
                '--color-cream': '#EBEBEB',
                '--color-paper': '#FAFAFA',
                '--color-paper-back': '#F0F0F0',
                '--color-ink': '#1A1A1A',
                '--color-ink-light': '#4A4A4A',
                '--color-ink-faded': '#8A8A8A',
                '--color-red': '#5A5A5A',
                '--color-red-dark': '#3A3A3A',
                '--color-gold': '#9A9A9A',
                '--color-gold-light': '#BABABA'
            },
            background: 'linear-gradient(135deg, #3A3A3A 0%, #1A1A1A 50%, #0A0A0A 100%)'
        },

        // Trending: Sunset Orange
        'sunset': {
            name: 'Sunset Orange',
            description: 'Warm oranges and peaches, energetic',
            emoji: '🌅',
            colors: {
                '--color-cream': '#F5E8E0',
                '--color-paper': '#FFF7F2',
                '--color-paper-back': '#F8EEE7',
                '--color-ink': '#2C1810',
                '--color-ink-light': '#5C3C28',
                '--color-ink-faded': '#8A6B5A',
                '--color-red': '#D4763D',
                '--color-red-dark': '#A85A2D',
                '--color-gold': '#E89A5C',
                '--color-gold-light': '#F5B885'
            },
            background: 'linear-gradient(135deg, #4A2E1F 0%, #2C1810 50%, #1A0D08 100%)'
        },

        // Trending: Ocean Blue
        'ocean': {
            name: 'Ocean Blue',
            description: 'Deep teals and aqua, refreshing',
            emoji: '🌊',
            colors: {
                '--color-cream': '#E0F0F0',
                '--color-paper': '#F2FAFA',
                '--color-paper-back': '#E7F3F3',
                '--color-ink': '#102628',
                '--color-ink-light': '#284A4D',
                '--color-ink-faded': '#5A787A',
                '--color-red': '#2D7A7A',
                '--color-red-dark': '#1F5A5A',
                '--color-gold': '#5CA8A8',
                '--color-gold-light': '#85C5C5'
            },
            background: 'linear-gradient(135deg, #1F3E3F 0%, #102628 50%, #081415 100%)'
        },

        // Trending: Cherry Blossom
        'sakura': {
            name: 'Cherry Blossom',
            description: 'Soft pinks and whites, Japanese aesthetic',
            emoji: '🌸',
            colors: {
                '--color-cream': '#F5E8ED',
                '--color-paper': '#FFF5F8',
                '--color-paper-back': '#F8EDF2',
                '--color-ink': '#2C1620',
                '--color-ink-light': '#5C3A45',
                '--color-ink-faded': '#8A6E78',
                '--color-red': '#D48BA8',
                '--color-red-dark': '#A86B85',
                '--color-gold': '#E8A8C5',
                '--color-gold-light': '#F5C5DD'
            },
            background: 'linear-gradient(135deg, #4A2836 0%, #2C1620 50%, #1A0D13 100%)'
        }
    },

    /**
     * Current active theme
     */
    currentTheme: 'classic',

    /**
     * Initialize theme system
     */
    init() {
        // Load saved theme from localStorage
        const saved = localStorage.getItem('bookTheme');
        if (saved && this.palettes[saved]) {
            this.currentTheme = saved;
        }

        // Apply the theme
        this.applyTheme(this.currentTheme);
    },

    /**
     * Apply a theme
     * @param {string} themeKey - Theme key from palettes
     */
    applyTheme(themeKey) {
        if (!this.palettes[themeKey]) {
            console.error(`Theme "${themeKey}" not found`);
            return;
        }

        const theme = this.palettes[themeKey];
        const root = document.documentElement;

        // Apply CSS variables
        Object.entries(theme.colors).forEach(([variable, value]) => {
            root.style.setProperty(variable, value);
        });

        // Apply background gradient
        document.body.style.background = theme.background;

        // Update current theme
        this.currentTheme = themeKey;

        // Save to localStorage
        localStorage.setItem('bookTheme', themeKey);

        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeKey }
        }));

        console.log(`✨ Theme applied: ${theme.name}`);
    },

    /**
     * Get all available themes
     * @returns {Array} Array of theme objects
     */
    getThemes() {
        return Object.entries(this.palettes).map(([key, theme]) => ({
            key,
            name: theme.name,
            description: theme.description,
            emoji: theme.emoji,
            active: key === this.currentTheme
        }));
    },

    /**
     * Get current theme info
     * @returns {Object} Current theme object
     */
    getCurrentTheme() {
        return {
            key: this.currentTheme,
            ...this.palettes[this.currentTheme]
        };
    },

    /**
     * Switch to next theme (for quick cycling)
     */
    nextTheme() {
        const keys = Object.keys(this.palettes);
        const currentIndex = keys.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % keys.length;
        this.applyTheme(keys[nextIndex]);
    },

    /**
     * Switch to previous theme
     */
    prevTheme() {
        const keys = Object.keys(this.palettes);
        const currentIndex = keys.indexOf(this.currentTheme);
        const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
        this.applyTheme(keys[prevIndex]);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Themes;
}
