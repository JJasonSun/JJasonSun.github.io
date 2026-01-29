document.addEventListener('DOMContentLoaded', () => {
    // 配置项
    const HEADER_OFFSET = 80;

    // ==========================================
    // 主题控制器 (DaisyUI)
    // ==========================================
    // 选择所有主题控制器（桌面端/移动端）
    const themeControllers = document.querySelectorAll('.theme-controller');
    
    // 1. 从 localStorage 初始化主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // 在 <html> 标签上设置主题
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 同步复选框状态
    themeControllers.forEach(controller => {
        if (controller.type === 'checkbox') {
             // value="dark": 选中=深色, 未选中=浅色
             if (controller.value === 'dark') {
                  controller.checked = (savedTheme === 'dark');
             } else {
                  controller.checked = (controller.value === savedTheme);
             }
        }
        
        // 2. 监听主题变化
        controller.addEventListener('change', (e) => {
            let newTheme = 'light';
            if (e.target.value === 'dark') {
                newTheme = e.target.checked ? 'dark' : 'light';
            } else {
                newTheme = e.target.checked ? e.target.value : 'light'; // 后备方案
            }
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // 同步其他控制器
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
    // 锚点链接平滑滚动
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
    // 自动生成文章目录 (TOC)
    // ==========================================
    const tocNav = document.getElementById('toc');
    const articleContent = document.querySelector('.article-content');

    if (tocNav && articleContent) {
        const headers = articleContent.querySelectorAll('h2, h3');
        
        if (headers.length > 0) {
            const ul = document.createElement('ul');
            // 检查 CSS 中是否已有 ul 样式
            
            headers.forEach((header, index) => {
                // 如果没有 ID 则生成
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
                
                // 根据标题层级设置类名
                if (header.tagName === 'H2') {
                    a.className = 'toc-h2 block py-1 hover:text-primary transition-colors';
                } else {
                    a.className = 'toc-h3 block py-1 pl-4 text-sm opacity-80 hover:text-primary transition-colors';
                }
                
                // 点击处理器
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
                        
                        // 更新激活状态
                        document.querySelectorAll('#toc a').forEach(link => {
                            link.classList.remove('text-primary', 'font-bold');
                            // 同时移除 CSS 中的自定义激活逻辑
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
            // 滚动监听（Scroll Spy）
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
                                
                                // 滚动侧边栏
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
