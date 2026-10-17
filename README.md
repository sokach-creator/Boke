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

## 六、接入公开评论（Giscus / Waline）

博客已内置两套公开评论系统，**二选一**，在 `js/data.js` 的 `COMMENT` 区块配置：

```js
const COMMENT = {
  provider: "giscus",   // "giscus" | "waline" | "none"（关闭公开评论）
  ...
};
```

评论位置：**文章底部**和**留言页下方**都会挂载；配置未填时会显示引导提示卡。

### 方案 A：Giscus（推荐 —— 免费、免服务器、无广告）

前提：有一个 GitHub 账号。访客评论时需用 GitHub 登录。

1. **建仓库**：在 GitHub 新建一个**公开**仓库，如 `sokach/blog-comments`
   （专门存评论用，可以不放假文件）
2. **开启 Discussions**：仓库 → Settings → General → Features → 勾选 `Discussions`
3. **安装应用**：打开 https://github.com/apps/giscus → Install → 选择刚建的仓库
4. **拿配置**：打开 https://giscus.app/zh-CN
   - 填入仓库名 `sokach/blog-comments`
   - 映射方式选 **"页面 URL（url）"** —— 本博客按 URL 区分，每篇文章/每个页面
     会自动拥有**独立的评论串**
   - 讨论区分类选 **`Announcements`**（官方推荐，只有维护者能开新串，访客只能回复）
   - 页面下方会生成一段 `<script>` 代码
5. **填配置**：把代码里的四个值抄进 `js/data.js`：
   ```js
   giscus: {
     repo: "sokach/blog-comments",   // data-repo
     repoId: "R_kgDOxxxxxx",         // data-repo-id
     category: "Announcements",      // data-category
     categoryId: "DIC_kwDOxxxxxx",   // data-category-id
     ...
   }
   ```
6. 保存刷新即可。评论开关的亮/暗主题会自动跟随博客的暗色模式。

### 方案 B：Waline（访客无需登录，昵称+邮箱即可留言）

需要部署一个免费的小后端（约 10 分钟）：

1. **建数据库**：注册 [LeanCloud 国际版](https://console.leancloud.app)
   → 创建应用（开发版免费）→ 设置 → 应用凭证，记下 `AppID / AppKey / MasterKey`
2. **一键部署后端**：打开 [Waline 部署文档](https://waline.js.org/guide/get-started.html)
   → 点击"Deploy to Vercel"按钮 → 用 GitHub 登录并创建项目
   → 环境变量里填入 LeanCloud 的三个 Key → Deploy
3. **拿地址**：部署完成后得到 `https://你的项目名.vercel.app`，
   先访问 `https://…/ui/register` 注册管理员账号（第一个注册的就是站长）
4. **填配置**：
   ```js
   const COMMENT = {
     provider: "waline",
     waline: { serverURL: "https://你的项目名.vercel.app" },
   };
   ```
5. 刷新页面，评论框就出现了。样式已适配博客主题色与暗色模式。

### 常见问题

- **评论串怎么区分？** Giscus 用 `mapping: "url"`，Waline 用 `path`（自动取当前
  页面地址），所以不同文章的评论互不混杂；首页和留言页也各有独立评论串。
- **想全站共用一个评论串**：把 giscus 的 `mapping` 改成 `"pathname"` 即可。
- **切换系统**：改 `provider` 字段即可，两套配置可以同时保留。
- **本地测试**：Giscus 在 `localhost` 下可以正常加载；Waline 需要后端已部署。

## 七、常见修改

| 想改什么 | 改哪里 |
| --- | --- |
| 站名、签名、头像、横幅 | `js/data.js` 的 `SITE`，或直接替换 `assets/avatar.png`、`assets/banner.png` |
| 公开评论（Giscus/Waline） | `js/data.js` 的 `COMMENT` 区块（详见第六节） |
| 主题色 | `css/style.css` 顶部的 `--accent` / `--accent-2` |
| 首屏背景动效速度 | `css/style.css` 中 `heroZoom` 的 `14s` |
| 页脚文案 | `js/app.js` 的 `buildNav()` 末尾 footer 部分 |
