(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    const animated = new WeakSet();
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';

    const enter = (element, options = {}) => {
        if (!element || animated.has(element)) return;
        animated.add(element);

        const {
            delay = 0,
            distance = 22,
            duration = 720,
            scale = 0.985
        } = options;

        element.animate([
            { opacity: 0, translate: `0 ${distance}px`, scale },
            { opacity: 1, translate: '0 0', scale: 1 }
        ], {
            duration,
            delay,
            easing,
            fill: 'backwards'
        });
    };

    const sequence = (selectors, start = 80, step = 85) => {
        selectors.forEach((selector, index) => {
            enter(document.querySelector(selector), { delay: start + index * step });
        });
    };

    const boot = () => {
        enter(document.querySelector('.topline'), { distance: -12, duration: 560 });

        if (document.querySelector('.hero')) {
            sequence([
                '.hero-label',
                '.name',
                '.portrait-window',
                '.manifesto',
                '.quick-links',
                '.dock'
            ], 70, 90);
        } else if (document.querySelector('.about-hero')) {
            sequence([
                '.about-hero .page-label',
                '.about-heading',
                '.about-portrait',
                '.about-copy'
            ], 70, 105);
        } else if (document.querySelector('.archive')) {
            sequence([
                '.archive .page-label',
                '.archive-heading',
                '.archive-list'
            ], 70, 105);
        } else if (document.querySelector('.article-layout')) {
            enter(document.querySelector('.article-main'), { delay: 80, distance: 26 });
            enter(document.querySelector('.article-toc'), { delay: 180, distance: 18 });
        }

        const revealSelectors = [
            '.practice',
            '.section-intro',
            '.project-row',
            '.writing-title',
            '.notes-window',
            '.about-principles .page-label',
            '.principles-heading',
            '.principle',
            '.contact-inner > *',
            '.archive-item',
            '.article-content > h2',
            '.page-footer-inner'
        ];
        const revealElements = [...document.querySelectorAll(revealSelectors.join(','))]
            .filter((element) => !animated.has(element));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const index = revealElements.indexOf(entry.target);
                enter(entry.target, { delay: (index % 3) * 55, distance: 20, duration: 680 });
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        revealElements.forEach((element) => observer.observe(element));
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();
