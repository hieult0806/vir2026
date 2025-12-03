/**
 * Application Configuration
 * Contains all constants and configuration values used throughout the application
 */

const CONFIG = {
    // Animation settings
    ANIMATION_DURATION_FIRST: 1000,  // Duration for first page flip (ms)
    ANIMATION_DURATION: 850,          // Duration for subsequent page flips (ms) - Optimized

    // Interaction thresholds
    DRAG_THRESHOLD: 80,               // Minimum drag distance to trigger flip (px)

    // Zoom settings
    ZOOM_MIN: 0.5,                    // Minimum zoom level (50%)
    ZOOM_MAX: 2.0,                    // Maximum zoom level (200%)
    ZOOM_STEP: 0.15,                  // Zoom increment/decrement step
    ZOOM_WHEEL_STEP: 0.1,             // Zoom step when using mouse wheel
    ZOOM_DEFAULT: 1.0,                // Default zoom level (100%)

    // Z-index management
    Z_INDEX_BASE: 100,                // Base z-index for stacking flipped pages
    Z_INDEX_SPINE: 1000,              // Z-index for book spine
    Z_INDEX_CONTROLS: 1000,           // Z-index for control panel

    // Page configuration
    TOTAL_PAGES: 14,                  // Total number of visible pages (including covers)
    TOTAL_FLIP_PAGES: 7,              // Number of flippable pages

    // CSS class names
    CLASSES: {
        FLIPPING: 'flipping',
        FLIPPED: 'flipped',
        DRAGGING: 'dragging'
    },

    // Easing functions
    EASING: {
        FIRST_FLIP: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
        SUBSEQUENT_FLIP: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
