/**
 * Theme Switcher UI Component
 * Handles the theme selection interface
 */

const ThemeSwitcher = {
    /**
     * DOM elements
     */
    elements: {
        button: null,
        panel: null,
        grid: null,
        toast: null
    },

    /**
     * Initialize theme switcher UI
     */
    init() {
        // Create UI elements
        this.createUI();

        // Set up event listeners
        this.setupEvents();

        // Initialize themes module
        Themes.init();

        // Render theme cards
        this.renderThemes();

        console.log('🎨 Theme Switcher initialized');
    },

    /**
     * Create UI elements
     */
    createUI() {
        // Create toggle button
        this.elements.button = document.createElement('button');
        this.elements.button.className = 'theme-switcher-btn';
        this.elements.button.innerHTML = '🎨';
        this.elements.button.setAttribute('aria-label', 'Open theme selector');
        this.elements.button.title = 'Change Theme';

        // Create panel
        this.elements.panel = document.createElement('div');
        this.elements.panel.className = 'theme-panel';
        this.elements.panel.innerHTML = `
            <div class="theme-panel-header">
                <h3 class="theme-panel-title">Chọn Màu Sắc</h3>
                <button class="theme-panel-close" aria-label="Close">×</button>
            </div>
            <div class="theme-grid"></div>
            <div class="theme-quick-actions">
                <button class="theme-action-btn" data-action="prev">← Trước</button>
                <button class="theme-action-btn" data-action="next">Sau →</button>
            </div>
        `;

        // Create toast notification
        this.elements.toast = document.createElement('div');
        this.elements.toast.className = 'theme-toast';

        // Get grid element
        this.elements.grid = this.elements.panel.querySelector('.theme-grid');

        // Add to DOM
        document.body.appendChild(this.elements.button);
        document.body.appendChild(this.elements.panel);
        document.body.appendChild(this.elements.toast);
    },

    /**
     * Setup event listeners
     */
    setupEvents() {
        // Toggle panel
        this.elements.button.addEventListener('click', () => {
            this.togglePanel();
        });

        // Close button
        const closeBtn = this.elements.panel.querySelector('.theme-panel-close');
        closeBtn.addEventListener('click', () => {
            this.closePanel();
        });

        // Quick action buttons
        const prevBtn = this.elements.panel.querySelector('[data-action="prev"]');
        const nextBtn = this.elements.panel.querySelector('[data-action="next"]');

        prevBtn.addEventListener('click', () => {
            Themes.prevTheme();
            this.renderThemes();
            this.showToast();
        });

        nextBtn.addEventListener('click', () => {
            Themes.nextTheme();
            this.renderThemes();
            this.showToast();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.elements.panel.contains(e.target) &&
                !this.elements.button.contains(e.target) &&
                this.elements.panel.classList.contains('active')) {
                this.closePanel();
            }
        });

        // Keyboard shortcut: T for theme
        document.addEventListener('keydown', (e) => {
            if (e.key === 't' || e.key === 'T') {
                if (!this.elements.panel.classList.contains('active')) {
                    e.preventDefault();
                    this.openPanel();
                }
            } else if (e.key === 'Escape' && this.elements.panel.classList.contains('active')) {
                this.closePanel();
            }
        });

        // Listen for theme changes
        window.addEventListener('themeChanged', (e) => {
            this.renderThemes();
        });
    },

    /**
     * Render theme cards
     */
    renderThemes() {
        const themes = Themes.getThemes();
        this.elements.grid.innerHTML = '';

        themes.forEach(theme => {
            const card = this.createThemeCard(theme);
            this.elements.grid.appendChild(card);
        });
    },

    /**
     * Create a theme card element
     * @param {Object} theme - Theme data
     * @returns {HTMLElement} Theme card element
     */
    createThemeCard(theme) {
        const card = document.createElement('div');
        card.className = `theme-card ${theme.active ? 'active' : ''}`;
        card.setAttribute('data-theme', theme.key);

        // Get theme colors for swatches
        const palette = Themes.palettes[theme.key];
        const swatchColors = [
            palette.colors['--color-paper'],
            palette.colors['--color-gold'],
            palette.colors['--color-red'],
            palette.colors['--color-ink']
        ];

        card.innerHTML = `
            <div class="theme-card-header">
                <span class="theme-emoji">${theme.emoji}</span>
                <div>
                    <h4 class="theme-name">${theme.name}</h4>
                </div>
            </div>
            <p class="theme-description">${theme.description}</p>
            <div class="theme-swatches">
                ${swatchColors.map(color => `
                    <div class="theme-swatch" style="background: ${color}"></div>
                `).join('')}
            </div>
        `;

        // Add click handler
        card.addEventListener('click', () => {
            Themes.applyTheme(theme.key);
            this.renderThemes();
            this.showToast();
        });

        return card;
    },

    /**
     * Toggle panel visibility
     */
    togglePanel() {
        if (this.elements.panel.classList.contains('active')) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    },

    /**
     * Open panel
     */
    openPanel() {
        this.elements.panel.classList.add('active');
        this.elements.button.style.transform = 'scale(0.9)';
    },

    /**
     * Close panel
     */
    closePanel() {
        this.elements.panel.classList.remove('active');
        this.elements.button.style.transform = 'scale(1)';
    },

    /**
     * Show toast notification
     */
    showToast() {
        const current = Themes.getCurrentTheme();

        this.elements.toast.innerHTML = `
            <span class="theme-toast-emoji">${current.emoji}</span>
            <span class="theme-toast-text">
                Đã chọn: <span class="theme-toast-name">${current.name}</span>
            </span>
        `;

        // Show toast
        this.elements.toast.classList.add('show');

        // Hide after 2 seconds
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 2000);
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ThemeSwitcher.init();
    });
} else {
    ThemeSwitcher.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}
