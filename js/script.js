document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const HEADER_OFFSET = 80;

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    
    // States: 'auto' -> 'light' -> 'dark'
    const themes = ['auto', 'light', 'dark'];
    
    function getStoredTheme() {
        return localStorage.getItem('theme') || 'auto';
    }

    function setTheme(theme) {
        if (theme === 'auto') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('theme');
            themeToggle.innerHTML = '<i class="fas fa-adjust"></i>';
            themeToggle.setAttribute('title', '跟随系统');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if (theme === 'dark') {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggle.setAttribute('title', '深色模式');
            } else {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggle.setAttribute('title', '浅色模式');
            }
        }
    }

    // Initialize
    if (themeToggle) {
        setTheme(getStoredTheme());
        
        themeToggle.addEventListener('click', () => {
            const current = getStoredTheme();
            const nextIndex = (themes.indexOf(current) + 1) % themes.length;
            setTheme(themes[nextIndex]);
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Smooth Scrolling for Anchor Links (Updated to allow external links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // 如果是页面内跳转才阻止默认行为
            if (targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Adjust scroll position for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // Load Blog Posts
    const blogContainer = document.getElementById('blog-container');
    if (blogContainer && typeof blogPosts !== 'undefined') {
        blogPosts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'blog-card';
            article.innerHTML = `
                <h3>${post.title}</h3>
                <p class="date">${post.date}</p>
                <p>${post.summary}</p>
                <a href="${post.link}">阅读更多</a>
            `;
            blogContainer.appendChild(article);
        });
    }

    // Simple scroll animation (optional)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .blog-card').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // ==========================================
    // Automatic Table of Contents (TOC) Generation
    // ==========================================
    const tocNav = document.getElementById('toc');
    const articleContent = document.querySelector('.article-content');

    if (tocNav && articleContent) {
        const headers = articleContent.querySelectorAll('h2, h3');
        
        if (headers.length > 0) {
            const ul = document.createElement('ul');
            
            headers.forEach((header, index) => {
                // Ensure header has an ID
                if (!header.id) {
                    // Generate ID from text or fallback to index
                    const id = header.textContent
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w\u4e00-\u9fa5-]/g, ''); // Keep Chinese chars
                    header.id = id || `heading-${index}`;
                }

                const li = document.createElement('li');
                const a = document.createElement('a');
                
                a.href = `#${header.id}`;
                a.textContent = header.textContent;
                a.className = header.tagName === 'H2' ? 'toc-h2' : 'toc-h3';
                
                // Add click handler for smooth scrolling with offset
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetElement = document.getElementById(header.id);
                    if (targetElement) {
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                        
                        // Update active state manually
                        document.querySelectorAll('#toc a').forEach(link => link.classList.remove('active'));
                        a.classList.add('active');
                    }
                });

                li.appendChild(a);
                ul.appendChild(li);
            });
            
            tocNav.appendChild(ul);

            // Scroll Spy using IntersectionObserver
            const scrollSpyOptions = {
                root: null,
                rootMargin: '-100px 0px -70% 0px', // Trigger when element is near top
                threshold: 0
            };

            const scrollSpyCallback = (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeId = entry.target.id;
                        document.querySelectorAll('#toc a').forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${activeId}`) {
                                link.classList.add('active');
                                
                                // Auto scroll sidebar to active item
                                const sidebar = document.querySelector('.toc-content');
                                if (sidebar) {
                                    const linkTop = link.offsetTop;
                                    const sidebarHeight = sidebar.clientHeight;
                                    const scrollAmount = linkTop - (sidebarHeight / 2);
                                    sidebar.scrollTo({
                                        top: scrollAmount,
                                        behavior: 'smooth'
                                    });
                                }
                            }
                        });
                    }
                });
            };

            const spyObserver = new IntersectionObserver(scrollSpyCallback, scrollSpyOptions);
            headers.forEach(header => spyObserver.observe(header));
        } else {
            // Hide sidebar if no headers found
            const sidebar = document.querySelector('.toc-sidebar');
            if (sidebar) sidebar.style.display = 'none';
        }
    }
});
