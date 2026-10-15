(() => {
    const list = document.querySelector('[data-article-list], #blog-list');
    if (list && typeof blogPosts !== 'undefined' && Array.isArray(blogPosts)) {
        list.replaceChildren(...blogPosts.map((post) => {
            const link = document.createElement('a');
            link.className = 'writing-item';
            link.href = post.link;
            const title = document.createElement('p');
            title.className = 'note-title';
            title.textContent = post.title;
            const meta = document.createElement('div');
            meta.className = 'note-meta';
            const time = document.createElement('time');
            time.dateTime = post.date;
            time.textContent = post.date;
            const read = document.createElement('span');
            read.className = 'read-link';
            read.textContent = '阅读全文';
            meta.append(time, read);
            const summary = document.createElement('p');
            summary.className = 'note-summary';
            summary.textContent = post.summary;
            [title, meta, summary].forEach((element) => { element.dataset.reveal = ''; });
            link.append(title, meta, summary);
            return link;
        }));
    }

    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate) return;
    const easing = 'cubic-bezier(.22, 1, .36, 1)';
    document.querySelectorAll('.name-line > span').forEach((line, index) => {
        line.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], {
            duration: 900, delay: 60 + index * 110, easing, fill: 'backwards'
        });
    });
    document.querySelectorAll('.hero-intro, .hero .button').forEach((element, index) => {
        element.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], {
            duration: 650, delay: 250 + index * 80, easing, fill: 'backwards'
        });
    });
    const observer = new IntersectionObserver((entries) => {
        entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
            entry.target.animate([
                { opacity: 0, transform: 'translateY(18px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 650, delay: index * 65, easing, fill: 'backwards' });
            observer.unobserve(entry.target);
        });
    }, { threshold: .08 });
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
})();
