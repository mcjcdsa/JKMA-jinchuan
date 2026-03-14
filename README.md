# JKMA都市圈|金川市官方网站

JKMA都市圈|金川市官方网站源代码。

## 🌐 访问地址

- **GitHub Pages**: https://mcjcdsa.github.io/JKMA-jinchuan/
- **自建服务器**: http://103.39.66.12:13626

## 📋 项目简介

这是JKMA都市圈|金川市的官方网站，提供城市信息、活动预告、团队成员介绍、新闻动态等功能。

## 🚀 快速开始

### 本地开发

使用本地HTTP服务器运行：

```bash
# Windows
start-server.bat

# Linux/Mac
python3 -m http.server 8000
# 或
python -m http.server 8000
```

然后访问 http://localhost:8000

### 部署到GitHub Pages

#### 方式一：一键部署脚本（推荐）

```powershell
# 使用新的部署脚本（自动检测仓库）
.\deploy-github-pages.ps1

# 或指定仓库地址
.\deploy-github-pages.ps1 -GitHubRepo mcjcdsa/JKMA-jinchuan

# Windows用户也可以双击运行
.\deploy-github-pages.bat
```

#### 方式二：使用旧版脚本

```powershell
# 使用旧版部署脚本
.\deploy-github.ps1 -GitHubRepo username/jkma-website
```

详细说明请查看：
- [GitHub Pages部署脚本使用说明](README-GitHub-Pages部署脚本.md)（新版脚本）
- [GitHub Pages部署说明](README-GitHub部署.md)（完整部署指南）

### 部署到自建服务器

```powershell
# 使用SCP部署
.\deploy.ps1 -DeployMethod scp -ServerUser username -StartServer
```

详细说明请查看 [部署脚本说明](README-部署脚本.md)

## 📁 项目结构

```
.
├── index.html              # 主页
├── activity.html           # 活动页面
├── team.html               # 团队成员页面
├── query.html              # 城市查询页面
├── news.html               # 新闻动态页面
├── join.html               # 加入我们页面
├── partner.html            # 合作伙伴页面
├── about.html              # 关于我们页面
├── blacklist.html          # 黑名单页面
├── rules.html              # 城市守则页面
├── 404.html                # 404错误页面
├── style.css               # 主样式文件
├── css/                    # CSS模块
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── utilities.css
│   └── ux-enhancements.css
├── js/                     # JavaScript模块
│   ├── main.js
│   ├── utils.js
│   ├── timer.js
│   └── ...
├── robots.txt              # 搜索引擎配置
├── sitemap.xml             # 网站地图
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions工作流
```

## 🛠️ 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 模块化样式，响应式设计
- **JavaScript (ES6 Modules)** - 模块化JavaScript
- **GitHub Pages** - 静态网站托管（可选）

## 📝 功能特性

- ✅ 响应式设计，支持移动端
- ✅ 模块化代码结构
- ✅ SEO优化
- ✅ 无障碍访问支持
- ✅ 加载动画和进度条
- ✅ Toast通知系统
- ✅ 面包屑导航
- ✅ 城市历史时间轴
- ✅ 团队成员展示
- ✅ 活动倒计时
- ✅ 城市查询功能
- ✅ 新闻动态系统
- ✅ 8月23日彩蛋（烟花和生日蛋糕）

## 📚 文档

- [部署脚本说明](README-部署脚本.md) - 自建服务器部署指南
- [GitHub Pages部署说明](README-GitHub部署.md) - GitHub Pages部署指南
- [服务器启动脚本说明](README-服务器启动脚本.md) - 服务器管理指南

## 🔧 开发说明

### 代码结构

- **CSS模块化**: 样式文件按功能分类（base、layout、components等）
- **JavaScript模块化**: 使用ES6模块系统，每个功能独立文件
- **响应式设计**: 使用CSS媒体查询，支持移动端和桌面端

### 浏览器支持

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- 移动端浏览器

### 本地开发注意事项

由于使用ES6模块，需要使用HTTP服务器运行，不能直接打开HTML文件。

## 📄 许可证

本项目为JKMA都市圈|金川市官方网站，版权归JKMA都市圈所有。

## 🤝 贡献

欢迎提交Issue和Pull Request。

## 📞 联系方式

- QQ审核群: 467257156
- 官方网站: https://mcjcdsa.github.io/JKMA-jinchuan/
- 自建服务器: http://103.39.66.12:13626

---

**最后更新**: 2026年3月14日

