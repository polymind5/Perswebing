/* ============================================
   Perswebbing — Main Script
   ============================================ */

(function () {
    'use strict';

    /* ----------------------------------------
       Viewport Scaling
       Scale the 1440×1024 canvas to fit any viewport
       ---------------------------------------- */
    const canvas = document.querySelector('.canvas');

    function scaleCanvas() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const scale = Math.min(vw / 1440, vh / 1024);

        // Center the canvas after scaling
        const scaledW = 1440 * scale;
        const scaledH = 1024 * scale;
        const offsetX = (vw - scaledW) / 2;
        const offsetY = (vh - scaledH) / 2;

        canvas.style.transform = `scale(${scale})`;
        canvas.style.left = offsetX + 'px';
        canvas.style.top = offsetY + 'px';
    }

    window.addEventListener('resize', scaleCanvas);
    scaleCanvas();

    /* ----------------------------------------
       Hover: Z-index lift + Grayscale others
       ---------------------------------------- */
    const imageCards = document.querySelectorAll(
        '.frame-patterns, .frame-dark-spiral, .frame-the-all, .frame-lightman'
    );

    // Card pairings: hovering the key card makes the value card show text
    // Projects (patterns) → text appears on Animations (dark-spiral)
    // Animations (dark-spiral) → text appears on Photos (lightman)
    // Graphics (the-all) → text appears on Info (bio)
    const pairings = {
        'frame-patterns': 'frame-dark-spiral',
        'frame-dark-spiral': 'frame-lightman',
        'frame-the-all': 'card-bio',
    };

    imageCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            canvas.classList.add('card-hovered');

            // Find and activate paired companion
            for (const [sourceClass, targetClass] of Object.entries(pairings)) {
                if (card.classList.contains(sourceClass)) {
                    const companion = document.querySelector('.' + targetClass);
                    if (companion) {
                        companion.classList.add('card--paired-active');
                    }
                }
            }
        });

        card.addEventListener('mouseleave', () => {
            canvas.classList.remove('card-hovered');

            // Remove paired companion highlight
            document.querySelectorAll('.card--paired-active').forEach(el => {
                el.classList.remove('card--paired-active');
            });
        });
    });

})();
