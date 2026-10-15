# J.Jason Personal Blog

静态个人博客，发布于 GitHub Pages，无需构建。

## 页面

- `index.html`：姓名、简介和文章列表。
- `about.html`：简短个人介绍。
- `blog-post.html`：文章归档兼容入口。
- `articles/`：独立文章页面，保留原有正文与阅读样式。

## 共享资源

- `css/home.css`：首页、关于和归档页的样式。
- `js/home.js`：文章列表与动效，支持减少动态效果。
- `js/blog-data.js`：首页与归档页的文章列表数据源。
- `css/site.css`、`js/script.js`、`js/motion.js`：文章页样式、目录、代码复制和动效。
- `assets/fonts/`：本地字体与许可。
- `templates/components.html`：文章页可复用片段。

## 添加文章

1. 在 `articles/` 中添加独立 HTML，使用 `templates/components.html` 的文章外壳。
2. 在 `js/blog-data.js` 中添加标题、日期、摘要和链接。
3. 同步首页与归档页的无脚本备用链接。
4. 用浏览器检查桌面与手机排版，确认目录、代码块和表格无溢出。

## 本地预览

在仓库根目录运行静态服务器，例如 `python3 -m http.server`。
