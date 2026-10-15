document.addEventListener('DOMContentLoaded', () => {
    const toc = document.getElementById('toc');
    const content = document.querySelector('.article-content');

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        link.rel = 'noopener noreferrer';
    });

    if (content) {
        const languageNames = {
            bash: 'Shell',
            html: 'HTML',
            javascript: 'JavaScript',
            plaintext: 'Plain text',
            powershell: 'PowerShell'
        };

        content.querySelectorAll('pre').forEach((pre) => {
            const code = pre.querySelector('code');
            if (!code || pre.parentElement?.classList.contains('code-shell')) return;

            const languageClass = [...code.classList].find((name) => name.startsWith('language-'));
            const language = languageClass?.replace('language-', '') || 'plaintext';
            const shell = document.createElement('div');
            const toolbar = document.createElement('div');
            const label = document.createElement('span');
            const copyButton = document.createElement('button');

            shell.className = 'code-shell';
            toolbar.className = 'code-toolbar';
            label.className = 'code-language';
            label.textContent = languageNames[language] || language;
            copyButton.className = 'code-copy';
            copyButton.type = 'button';
            copyButton.title = '复制代码';
            copyButton.setAttribute('aria-label', '复制代码');
            copyButton.textContent = '复制';
            copyButton.setAttribute('aria-live', 'polite');

            copyButton.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(code.textContent);
                } catch {
                    const textarea = document.createElement('textarea');
                    textarea.value = code.textContent;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        if (!document.execCommand('copy')) throw new Error('Copy failed');
                    } catch {
                        copyButton.textContent = '复制失败';
                        copyButton.title = '请选中代码后手动复制';
                        copyButton.setAttribute('aria-label', '复制失败，请选中代码后手动复制');
                        return;
                    } finally {
                        textarea.remove();
                    }
                }

                copyButton.dataset.copied = 'true';
                copyButton.title = '已复制';
                copyButton.setAttribute('aria-label', '代码已复制');
                copyButton.textContent = '已复制';
                window.setTimeout(() => {
                    delete copyButton.dataset.copied;
                    copyButton.title = '复制代码';
                    copyButton.setAttribute('aria-label', '复制代码');
                    copyButton.textContent = '复制';
                }, 1200);
            });

            pre.before(shell);
            toolbar.append(label, copyButton);
            shell.append(toolbar, pre);
        });

        content.querySelectorAll('.table-scroll').forEach((table) => {
            table.tabIndex = 0;
            table.setAttribute('role', 'region');
            table.setAttribute('aria-label', '可横向滚动的表格');
        });
    }

    if (!toc || !content) return;

    const headings = [...content.querySelectorAll('h2, h3')];
    const tocPanel = toc.closest('.article-toc');

    if (headings.length === 0) {
        if (tocPanel) tocPanel.hidden = true;
        return;
    }

    const usedIds = new Set();
    const list = document.createElement('ul');

    headings.forEach((heading, index) => {
        let id = heading.id || heading.textContent
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\u4e00-\u9fa5-]/g, '');

        id = id || `heading-${index + 1}`;
        const baseId = id;
        let suffix = 2;
        while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
        usedIds.add(id);
        heading.id = id;

        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.className = heading.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
        item.appendChild(link);
        list.appendChild(item);
    });

    toc.replaceChildren(list);
    if (tocPanel) {
        tocPanel.hidden = false;
        tocPanel.open = !window.matchMedia('(max-width: 900px)').matches;
    }

    const links = [...toc.querySelectorAll('a')];
    const activate = (id) => {
        links.forEach((link) => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    };

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) activate(visible[0].target.id);
    }, { rootMargin: '-64px 0px -72% 0px' });

    headings.forEach((heading) => observer.observe(heading));
    activate(headings[0].id);
});
