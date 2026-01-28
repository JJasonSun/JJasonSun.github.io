document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const HEADER_OFFSET = 80;

    // ==========================================
    // Theme Controller (DaisyUI)
    // ==========================================
    // Select all theme controllers (desktop/mobile)
    const themeControllers = document.querySelectorAll('.theme-controller');
    
    // 1. Initialize from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Set theme on <html>
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Sync checkboxes
    themeControllers.forEach(controller => {
        if (controller.type === 'checkbox') {
             // value="dark": checked=dark, unchecked=light
             if (controller.value === 'dark') {
                  controller.checked = (savedTheme === 'dark');
             } else {
                  controller.checked = (controller.value === savedTheme);
             }
        }
        
        // 2. Listen for changes
        controller.addEventListener('change', (e) => {
            let newTheme = 'light';
            if (e.target.value === 'dark') {
                newTheme = e.target.checked ? 'dark' : 'light';
            } else {
                newTheme = e.target.checked ? e.target.value : 'light'; // Fallback
            }
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Sync other controllers
            themeControllers.forEach(other => {
                if (other !== e.target && other.type === 'checkbox') {
                    if (other.value === 'dark') {
                        other.checked = (newTheme === 'dark');
                    }
                }
            });
        });
    });


    // ==========================================
    // Smooth Scrolling for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
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

    // ==========================================
    // Automatic Table of Contents (TOC) Generation
    // ==========================================
    const tocNav = document.getElementById('toc');
    const articleContent = document.querySelector('.article-content');

    if (tocNav && articleContent) {
        const headers = articleContent.querySelectorAll('h2, h3');
        
        if (headers.length > 0) {
            const ul = document.createElement('ul');
            // Check if we already have styles for ul in CSS
            
            headers.forEach((header, index) => {
                // Generate ID if missing
                if (!header.id) {
                    const id = header.textContent
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w\u4e00-\u9fa5-]/g, ''); 
                    header.id = id || `heading-${index}`;
                }

                const li = document.createElement('li');
                const a = document.createElement('a');
                
                a.href = `#${header.id}`;
                a.textContent = header.textContent;
                
                // Set class based on hierarchy
                if (header.tagName === 'H2') {
                    a.className = 'toc-h2 block py-1 hover:text-primary transition-colors';
                } else {
                    a.className = 'toc-h3 block py-1 pl-4 text-sm opacity-80 hover:text-primary transition-colors';
                }
                
                // Click handler
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
                        
                        // Update active state
                        document.querySelectorAll('#toc a').forEach(link => {
                            link.classList.remove('text-primary', 'font-bold');
                            // Also remove custom active logic from CSS
                            link.classList.remove('active');
                        });
                        a.classList.add('text-primary', 'font-bold', 'active');
                    }
                });

                li.appendChild(a);
                ul.appendChild(li);
            });
            
            tocNav.innerHTML = ''; 
            tocNav.appendChild(ul);

            // ==========================================
            // Scroll Spy
            // ==========================================
            const scrollSpyOptions = {
                root: null,
                rootMargin: '-100px 0px -70% 0px',
                threshold: 0
            };

            const scrollSpyCallback = (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeId = entry.target.id;
                        document.querySelectorAll('#toc a').forEach(link => {
                            link.classList.remove('text-primary', 'font-bold', 'active');
                            
                            if (link.getAttribute('href') === `#${activeId}`) {
                                link.classList.add('text-primary', 'font-bold', 'active');
                                
                                // Scroll sidebar
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
             const sidebarContainer = document.querySelector('.toc-content')?.parentElement;
             if (sidebarContainer) {
                 sidebarContainer.style.display = 'none';
             }
        }
    }
});
