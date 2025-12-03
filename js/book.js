/**
 * Book Module
 * Handles the core book flipping logic and zoom functionality
 */

const Book = {
    // DOM element references
    elements: {
        book: null,
        bookContainer: null,
        flipPages: null,
        staticLeft: null,
        staticRight: null,
        prevBtn: null,
        nextBtn: null,
        pageIndicator: null,
        zoomInBtn: null,
        zoomOutBtn: null,
        zoomLevelEl: null
    },

    // Page content data (loaded from JSON)
    pageData: null,

    /**
     * Initialize the book module
     * @param {Object} elements - DOM element references
     */
    init(elements) {
        this.elements = elements;
        this.loadPageData();
    },

    /**
     * Load page content data from JSON
     */
    async loadPageData() {
        try {
            const response = await fetch('data/pages.json');
            const data = await response.json();
            this.pageData = data.pages;
            this.updateDisplay();
        } catch (error) {
            console.error('Failed to load page data:', error);
            // Fallback to empty content if JSON fails to load
            this.pageData = [];
        }
    },

    /**
     * Update the display based on current state
     * Updates page indicator, buttons, left page content, and right page visibility
     */
    updateDisplay() {
        const currentPage = BookState.getCurrentPage();

        // Update page indicator (display as 1-indexed spread)
        const displayPage = currentPage * 2 + 1;
        this.elements.pageIndicator.textContent = `Trang ${displayPage}-${displayPage + 1} / ${CONFIG.TOTAL_PAGES}`;

        // Update navigation buttons
        this.elements.prevBtn.disabled = BookState.isFirstPage();
        this.elements.nextBtn.disabled = BookState.isLastPage();

        // Update left static page content from data
        if (this.pageData && currentPage < this.pageData.length) {
            const pageContent = this.pageData[currentPage].leftContent;
            this.elements.staticLeft.innerHTML = `<div class="${pageContent.class}">${pageContent.html}</div>`;
        }

        // Show/hide right static page (back cover)
        this.elements.staticRight.style.visibility = BookState.isLastPage() ? 'visible' : 'hidden';
    },

    /**
     * Flip to the next page
     * Applies animation and updates state
     */
    flipNext() {
        if (BookState.isLastPage() || BookState.isCurrentlyAnimating()) {
            return;
        }

        BookState.setAnimating(true);
        const currentPage = BookState.getCurrentPage();
        const pageToFlip = this.elements.flipPages[CONFIG.TOTAL_FLIP_PAGES - 1 - currentPage];

        // Add flipping animation class
        pageToFlip.classList.add(CONFIG.CLASSES.FLIPPING);
        pageToFlip.classList.add(CONFIG.CLASSES.FLIPPED);

        // Update z-index for proper stacking order
        pageToFlip.style.zIndex = CONFIG.Z_INDEX_BASE + currentPage;

        // Advance state
        BookState.nextPage();

        // Remove animation class and update display after animation completes
        setTimeout(() => {
            pageToFlip.classList.remove(CONFIG.CLASSES.FLIPPING);
            this.updateDisplay();
            BookState.setAnimating(false);
        }, CONFIG.ANIMATION_DURATION);
    },

    /**
     * Flip to the previous page
     * Reverses animation and updates state
     */
    flipPrev() {
        if (BookState.isFirstPage() || BookState.isCurrentlyAnimating()) {
            return;
        }

        BookState.setAnimating(true);
        BookState.prevPage();

        const currentPage = BookState.getCurrentPage();
        const pageToFlip = this.elements.flipPages[CONFIG.TOTAL_FLIP_PAGES - 1 - currentPage];

        // Add flipping animation class
        pageToFlip.classList.add(CONFIG.CLASSES.FLIPPING);
        pageToFlip.classList.remove(CONFIG.CLASSES.FLIPPED);

        // Reset z-index to original stacking order
        pageToFlip.style.zIndex = CONFIG.TOTAL_FLIP_PAGES - currentPage;

        // Remove animation class and update display after animation completes
        setTimeout(() => {
            pageToFlip.classList.remove(CONFIG.CLASSES.FLIPPING);
            this.updateDisplay();
            BookState.setAnimating(false);
        }, CONFIG.ANIMATION_DURATION);
    },

    /**
     * Set zoom level with visual update
     * @param {number} newZoom - Desired zoom level
     */
    setZoom(newZoom) {
        const actualZoom = BookState.setZoom(newZoom);
        this.elements.bookContainer.style.transform = `scale(${actualZoom})`;
        this.elements.zoomLevelEl.textContent = `${Math.round(actualZoom * 100)}%`;
    },

    /**
     * Increase zoom level
     */
    zoomIn() {
        const newZoom = BookState.zoomIn();
        this.setZoom(newZoom);
    },

    /**
     * Decrease zoom level
     */
    zoomOut() {
        const newZoom = BookState.zoomOut();
        this.setZoom(newZoom);
    },

    /**
     * Reset zoom to default (100%)
     */
    resetZoom() {
        const defaultZoom = BookState.resetZoom();
        this.setZoom(defaultZoom);
    },

    /**
     * Zoom using mouse wheel
     * @param {number} delta - Wheel delta value
     */
    zoomWheel(delta) {
        const currentZoom = BookState.getZoom();
        const newZoom = delta > 0
            ? BookState.zoomOut(CONFIG.ZOOM_WHEEL_STEP)
            : BookState.zoomIn(CONFIG.ZOOM_WHEEL_STEP);
        this.setZoom(newZoom);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Book;
}
