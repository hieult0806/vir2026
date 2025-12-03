/**
 * Main Application Entry Point
 * Initializes the book application and sets up all event listeners
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM element references
    const elements = {
        book: document.getElementById('book'),
        bookContainer: document.getElementById('bookContainer'),
        flipPages: document.querySelectorAll('.flip-page'),
        staticLeft: document.getElementById('staticLeft'),
        staticRight: document.getElementById('staticRight'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        pageIndicator: document.getElementById('pageIndicator'),
        zoomInBtn: document.getElementById('zoomIn'),
        zoomOutBtn: document.getElementById('zoomOut'),
        zoomLevelEl: document.getElementById('zoomLevel')
    };

    // Initialize book module
    Book.init(elements);

    // === Event Listeners ===

    /**
     * Button Controls
     */
    elements.nextBtn.addEventListener('click', () => Book.flipNext());
    elements.prevBtn.addEventListener('click', () => Book.flipPrev());

    /**
     * Keyboard Navigation
     * - Arrow Right / Space: Next page
     * - Arrow Left: Previous page
     */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            Book.flipNext();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            Book.flipPrev();
        }
    });

    /**
     * Click on pages to flip
     * - Click on flipped page: Go back
     * - Click on unflipped page: Go forward
     */
    elements.flipPages.forEach(page => {
        page.addEventListener('click', () => {
            if (page.classList.contains(CONFIG.CLASSES.FLIPPED)) {
                Book.flipPrev();
            } else {
                Book.flipNext();
            }
        });
    });

    /**
     * Mouse Drag to Flip
     * - Drag left: Next page
     * - Drag right: Previous page
     */
    let dragStartX = 0;
    let isDragging = false;

    elements.book.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        document.body.classList.add(CONFIG.CLASSES.DRAGGING);
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;

        const dragDelta = e.clientX - dragStartX;

        // Check if drag distance exceeds threshold
        if (dragDelta < -CONFIG.DRAG_THRESHOLD) {
            Book.flipNext();
        } else if (dragDelta > CONFIG.DRAG_THRESHOLD) {
            Book.flipPrev();
        }

        isDragging = false;
        document.body.classList.remove(CONFIG.CLASSES.DRAGGING);
    });

    /**
     * Touch Gestures
     * - Swipe left: Next page
     * - Swipe right: Previous page
     */
    let touchStartX = 0;

    elements.book.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    elements.book.addEventListener('touchend', (e) => {
        const touchDelta = e.changedTouches[0].clientX - touchStartX;

        if (touchDelta < -CONFIG.DRAG_THRESHOLD) {
            Book.flipNext();
        } else if (touchDelta > CONFIG.DRAG_THRESHOLD) {
            Book.flipPrev();
        }
    }, { passive: true });

    /**
     * Zoom Controls - Buttons
     */
    elements.zoomInBtn.addEventListener('click', () => Book.zoomIn());
    elements.zoomOutBtn.addEventListener('click', () => Book.zoomOut());

    /**
     * Zoom Controls - Mouse Wheel
     * Ctrl/Cmd + Scroll to zoom
     */
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            Book.zoomWheel(e.deltaY);
        }
    }, { passive: false });

    /**
     * Zoom Controls - Double Click to Reset
     */
    elements.bookContainer.addEventListener('dblclick', () => Book.resetZoom());

    // Log initialization complete
    console.log('📖 Interactive Book initialized successfully');
});
