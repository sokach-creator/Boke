# Sokach 的个人博客 · 使用与部署说明

一个零依赖的手写静态博客（HTML / CSS / JavaScript），样式参考主流个人博客主题：
全屏横幅首屏、透明导航、时间轴、分类、相册、说说、友链、留言板、暗色模式、全文搜索，并完整适配手机端。

## 一、目录结构

```
sokach-blog/
├── index.html        # 唯一入口页面（一般不用动）
├── css/style.css     # 全部样式（想改配色改这里）
├── js/data.js        # ★ 站点配置 + 文章内容（日常只改这个文件）
├── js/app.js         # 路由与渲染逻辑（一般不用动）
└── assets/           # 图片素材（banner 横幅、avatar 头像、相册与封面图）
```

## 二、怎么写文章 / 发说说

打开 `js/data.js`：

- **发文章**：往 `ARTICLES` 数组**最前面**复制一条现有结构，改 `slug`（英文短名，决定链接）、
  `title`、`date`、`category`、`tags`、`cover`、`excerpt`，把正文写进 `content`。
  正文支持 Markdown 子集：`# 标题`、`**加粗**`、`` `行内代码` ``、` ``` 代码块 ``` `、
  `> 引用`、`- 列表`、`1. 列表`、`[链接](url)`、`![图片](url)`、表格、`---` 分割线。
- **发说说**：往 `SAYS` 数组最前面加一条 `{ date, mood, text }`。
- **加友链 / 相册**：改 `FRIENDS` / `ALBUMS` 数组即可。
- **改站名 / 签名 / 社交链接**：改 `SITE` 对象。

图片统一放进 `assets/` 后按路径引用（如 `assets/my-photo.png`）。

## 三、本地预览

直接双击 `index.html` 就能看；或者在本目录执行：

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## 四、部署上线（二选一）

### 方式 A：GitHub Pages（完全免费）

1. 在 GitHub 新建一个仓库，例如 `blog`
2. 把本文件夹里的**所有文件**上传到仓库（网页端拖拽上传即可）
3. 仓库 → Settings → Pages → Source 选 `main` 分支、`/(root)` → Save
4. 等一两分钟，得到预览地址 `https://你的用户名.github.io/blog/`
   （哈希路由 `#/...` 在子路径下也能正常工作，无需任何配置）

### 方式 B：Vercel（速度更快，带自动 HTTPS）

1. 注册/登录 [vercel.com](https://vercel.com)（可用 GitHub 账号）
2. 「Add New → Project」，如果代码在 GitHub 就直接 Import；本地代码可选
   「Add New → Project → 上传文件夹」或安装 `npm i -g vercel` 后在目录里执行 `vercel`
3. 部署完成后得到 `xxx.vercel.app` 预览地址

## 五、绑定域名 sokach.niuma.club

1. 平台后台添加自定义域名：
   - **Vercel**：项目 → Settings → Domains → 输入 `sokach.niuma.club`
   - **GitHub Pages**：仓库 Settings → Pages → Custom domain 输入 `sokach.niuma.club`
2. 平台会显示一个 CNAME 目标值，去 **hapdns 面板**添加解析记录：

   | 记录类型 | 主机名/记录名 | 记录值 |
   | --- | --- | --- |
   | CNAME | sokach（按面板要求填） | 平台给出的目标地址 |

   常见目标值：Vercel → `cname.vercel-dns.com`；
   GitHub Pages → `你的用户名.github.io`
3. 如果 hapdns 面板**不支持 CNAME**，用 A 记录替代：
   Vercel → `76.76.21.21`；GitHub Pages → `185.199.108.153`、`185.199.109.153`、
   `185.199.110.153`、`185.199.111.153`（四条都加）
4. 等 DNS 生效（几分钟到几小时）、平台自动签发 HTTPS 证书，
   访问 `https://sokach.niuma.club` 即为你的博客。

## 六、留言板说明

演示版留言保存在访问者自己的浏览器（localStorage），仅本人可见。
想做成公开留言/评论，推荐二选一（都是免费的）：

- **Giscus**（基于 GitHub Discussions）：[giscus.app](https://giscus.app) 生成一段
  `<script>`，粘贴到 `js/app.js` 中 `pageMessage()` 函数渲染的容器之后即可
- **Waline**（需要一个小后端，可部署在 Vercel）：见 [waline.js.org](https://waline.js.org)

## 七、常见修改

| 想改什么 | 改哪里 |
| --- | --- |
| 站名、签名、头像、横幅 | `js/data.js` 的 `SITE`，或直接替换 `assets/avatar.png`、`assets/banner.png` |
| 主题色 | `css/style.css` 顶部的 `--accent` / `--accent-2` |
| 首屏背景动效速度 | `css/style.css` 中 `heroZoom` 的 `14s` |
| 页脚文案 | `js/app.js` 的 `buildNav()` 末尾 footer 部分 |
