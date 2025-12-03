/**
 * State Management Module
 * Manages the application state using a centralized state object pattern
 */

const BookState = {
    /**
     * Current page index (0 = cover, 1-7 = flipped pages)
     */
    currentPage: 0,

    /**
     * Current zoom level (0.5 - 2.0)
     */
    zoom: CONFIG.ZOOM_DEFAULT,

    /**
     * Animation lock to prevent overlapping animations
     */
    isAnimating: false,

    /**
     * Get the current page index
     * @returns {number} Current page index
     */
    getCurrentPage() {
        return this.currentPage;
    },

    /**
     * Set the current page index
     * @param {number} page - Page index to set
     */
    setCurrentPage(page) {
        if (page >= 0 && page <= CONFIG.TOTAL_FLIP_PAGES) {
            this.currentPage = page;
        }
    },

    /**
     * Increment the current page
     */
    nextPage() {
        if (this.currentPage < CONFIG.TOTAL_FLIP_PAGES) {
            this.currentPage++;
        }
    },

    /**
     * Decrement the current page
     */
    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
        }
    },

    /**
     * Get the current zoom level
     * @returns {number} Current zoom level
     */
    getZoom() {
        return this.zoom;
    },

    /**
     * Set the zoom level (clamped to min/max bounds)
     * @param {number} zoomLevel - Desired zoom level
     * @returns {number} Actual zoom level set (after clamping)
     */
    setZoom(zoomLevel) {
        this.zoom = Math.max(CONFIG.ZOOM_MIN, Math.min(CONFIG.ZOOM_MAX, zoomLevel));
        return this.zoom;
    },

    /**
     * Increase zoom level
     * @param {number} step - Zoom increment (default: CONFIG.ZOOM_STEP)
     * @returns {number} New zoom level
     */
    zoomIn(step = CONFIG.ZOOM_STEP) {
        return this.setZoom(this.zoom + step);
    },

    /**
     * Decrease zoom level
     * @param {number} step - Zoom decrement (default: CONFIG.ZOOM_STEP)
     * @returns {number} New zoom level
     */
    zoomOut(step = CONFIG.ZOOM_STEP) {
        return this.setZoom(this.zoom - step);
    },

    /**
     * Reset zoom to default level
     * @returns {number} Default zoom level
     */
    resetZoom() {
        return this.setZoom(CONFIG.ZOOM_DEFAULT);
    },

    /**
     * Check if animation is in progress
     * @returns {boolean} True if animating
     */
    isCurrentlyAnimating() {
        return this.isAnimating;
    },

    /**
     * Set animation lock state
     * @param {boolean} animating - Animation state
     */
    setAnimating(animating) {
        this.isAnimating = animating;
    },

    /**
     * Get display page number (1-indexed for UI)
     * @returns {number} Display page number
     */
    getDisplayPage() {
        return this.currentPage * 2 + 1;
    },

    /**
     * Check if on first page
     * @returns {boolean} True if on cover page
     */
    isFirstPage() {
        return this.currentPage === 0;
    },

    /**
     * Check if on last page
     * @returns {boolean} True if all pages are flipped
     */
    isLastPage() {
        return this.currentPage === CONFIG.TOTAL_FLIP_PAGES;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookState;
}
