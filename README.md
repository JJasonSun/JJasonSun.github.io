# J.Jason Personal Blog

静态个人博客，发布于 GitHub Pages。全站使用统一的编辑部窗口视觉系统，无构建步骤。

## 页面

- `index.html`：个人介绍、精选项目和最近文章。
- `about.html`：详细介绍、工作方式和联系方式。
- `blog-post.html`：文章归档兼容入口。
- `articles/`：独立文章页面。

## 共享资源

- `css/site.css`：全站唯一视觉样式入口。
- `js/blog-data.js`：首页与归档页的文章列表数据源。
- `js/script.js`：文章目录生成和滚动状态。
- `js/motion.js`：全站进入、滚动揭示和减少动态效果适配。
- `templates/components.html`：新增页面时可复用的站点片段。

## 添加文章

1. 在 `articles/` 中添加独立 HTML，使用 `templates/components.html` 的文章外壳。
2. 在 `js/blog-data.js` 中添加标题、日期、摘要和链接。
3. 用浏览器检查桌面与移动端排版，确认目录、代码块和表格无溢出。

## 本地预览

页面可以直接打开。需要模拟 GitHub Pages 的 HTTP 环境时，在仓库根目录运行任意静态服务器。
