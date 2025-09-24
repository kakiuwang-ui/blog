# 🌟 Rusty Raven的博客系统

Rusty Raven的现代化全栈博客系统，支持多语言、暗黑模式、Typst文档编译等高级功能。基于 React + TypeScript + Node.js 构建，具备完整的内容管理功能和优秀的用户体验。

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.2.0-blue)

## ✨ 功能特性

### 📝 核心功能
- 🌐 **完整的中英文双语支持** - 基于React Context的多语言系统
- 🌙 **暗黑/明亮主题切换** - 基于next-themes的主题管理
- 📝 **Typst文档支持** - 现代化学术文档编译和预览
- 📱 **响应式设计** - 适配桌面端和移动端
- 🔍 **智能搜索和分类** - 支持文章搜索和标签过滤
- 📊 **数据统计面板** - 丰富的博客数据统计
- 🎨 **现代化UI/UX** - 基于Tailwind CSS的设计系统

### 🎨 用户体验
- **响应式设计**：完美适配桌面、平板、手机
- **暗黑模式**：浅色/深色/系统主题自动切换
- **现代界面**：简洁美观的 UI 设计，流畅的动画效果
- **智能导航**：固定侧边栏，移动端友好的折叠导航
- **搜索筛选**：全文搜索和分类筛选功能

### 🔒 安全特性
- **只读前端**：移除所有内容修改入口，确保安全性
- **安全编译**：Typst 文档沙盒编译，防止恶意代码执行
- **输入验证**：严格的文件类型和内容验证
- **路径保护**：防止目录遍历和恶意文件访问

## 🚀 技术栈

### 前端
- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **React Router** - 客户端路由管理
- **React Markdown** - Markdown 渲染
- **Prism.js** - 语法高亮
- **Lucide React** - 现代图标库

### 后端
- **Node.js** + **Express** + **TypeScript**
- **Typst** - 现代化文档编译系统
- **Sharp** - 高性能图片处理
- **CORS** - 跨域资源共享支持

### 数据存储
- **JSON 文件** - 轻量级数据存储
- **文件系统** - 静态资源管理

## 📁 项目结构

```
blog/
├── client/                 # React 前端应用
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   ├── pages/         # 页面组件
│   │   ├── contexts/      # React Context
│   │   ├── styles/        # 全局样式
│   │   └── utils/         # 工具函数
│   └── package.json
├── server/                # Node.js 后端
│   ├── src/
│   │   ├── routes/        # API 路由
│   │   ├── services/      # 业务逻辑
│   │   └── middleware/    # 中间件
│   ├── data/              # JSON 数据文件
│   │   └── articles.json  # 文章数据
│   ├── documents/         # 📋 文档文件夹（用户文档）
│   ├── uploads/           # 上传文件（系统管理）
│   └── compiled/          # 编译输出（临时文件）
├── shared/                # 共享类型定义
│   └── types.ts
├── 网站更新指南.md         # 详细更新指南
└── package.json          # 项目配置
```

## 🔧 安装与运行

### 环境要求
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Typst** >= 0.11.0（用于 PDF 编译）

### 快速开始

1. **安装 Typst 编译器**
   ```bash
   # macOS
   brew install typst

   # Linux
   curl -fsSL https://github.com/typst/typst/releases/latest/download/typst-x86_64-unknown-linux-musl.tar.xz | tar -xJ

   # Windows
   # 从 GitHub Releases 下载二进制文件
   ```

2. **安装项目依赖**
   ```bash
   cd /Users/wangjiaqiao/Desktop/blog
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   - 前端：http://localhost:3001
   - 后端 API：http://localhost:5001

### 生产环境部署

```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

## 📖 内容管理指南

### 🔄 日常更新流程

#### 1. 添加新博客文章
```bash
# 编辑文章数据
vim /Users/wangjiaqiao/Desktop/blog/server/data/articles.json
```

**添加新文章示例：**
```json
{
  "id": "unique-article-id",
  "title": "文章标题",
  "content": "文章内容（支持 Markdown 格式）",
  "category": "blog",
  "tags": ["技术", "教程"],
  "author": "作者名",
  "excerpt": "文章摘要",
  "images": [],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

#### 2. 添加 Typst 文档
```bash
# 将文档放入指定目录
cp your-document.typ /Users/wangjiaqiao/Desktop/blog/server/documents/
```

**支持的文档类型：**
- `.typ` - Typst 文档（自动编译为 PDF）
- `.md` - Markdown 文档（渲染为 HTML）

#### 3. 管理图片资源
```bash
# 图片自动存储位置
/Users/wangjiaqiao/Desktop/blog/server/uploads/images/
```

### 📋 源码分段显示功能

系统支持智能源码分段显示，特别针对 Typst 文档进行了优化：

#### 特性说明
- **自动分段**：根据 Typst 文档结构（如 `#resume-section`、`#resume-project` 等）自动分段
- **交互式导航**：支持点击切换不同段落，包含前进/后退按钮
- **双模式显示**：支持完整显示和分段显示两种模式
- **语法高亮**：集成 Prism.js 语法高亮引擎

#### 使用方法
在任何页面显示源码时，都会自动启用分段功能：
1. 在源码预览区域点击展开
2. 选择"分段显示"模式
3. 使用导航按钮或点击段落标签切换不同部分

#### 技术实现
- 组件位置：`client/src/components/SegmentedCodeViewer.tsx`
- 支持页面：文档中心、文章详情页、个人简历等
- 智能识别：自动识别 Typst 文档的 section、project、education 等结构

### 📋 内容分类说明

| 分类 | 用途 | 示例内容 |
|------|------|----------|
| `blog` | 技术博客、生活感悟 | 技术教程、思考总结 |
| `skills` | 技能展示 | 技术栈、项目经验 |
| `projects` | 项目展示 | 作品集、开源项目 |
| `music` | 音乐作品 | 原创音乐、音乐分享 |
| `resume` | 简历相关 | 工作经历、教育背景 |

### 🛠️ 维护操作

#### 清理临时文件
```bash
# 清理 PDF 编译缓存
rm -rf /Users/wangjiaqiao/Desktop/blog/server/compiled/*

# 清理日志文件（如果有）
rm -f /Users/wangjiaqiao/Desktop/blog/server/*.log
```

#### 备份重要数据
```bash
# 备份文章数据
cp /Users/wangjiaqiao/Desktop/blog/server/data/articles.json ~/backups/articles-$(date +%Y%m%d).json

# 备份文档文件
cp -r /Users/wangjiaqiao/Desktop/blog/server/documents ~/backups/documents-$(date +%Y%m%d)

# 备份上传图片
cp -r /Users/wangjiaqiao/Desktop/blog/server/uploads ~/backups/uploads-$(date +%Y%m%d)
```

#### 更新依赖包
```bash
# 检查过期依赖
npm outdated

# 更新依赖（谨慎操作）
npm update

# 重新安装依赖（解决冲突）
rm -rf node_modules package-lock.json
npm install
```

## 🔍 故障排除

### 常见问题解决

#### 1. Typst 文档无法编译
```bash
# 检查 Typst 是否安装
typst --version

# 手动测试编译
typst compile /path/to/document.typ /path/to/output.pdf

# 检查文档语法错误
typst check /path/to/document.typ
```

#### 2. 服务器启动失败
```bash
# 检查端口占用
lsof -i :3001
lsof -i :5001

# 强制结束占用进程
kill -9 $(lsof -ti:3001)
kill -9 $(lsof -ti:5001)

# 重新启动
npm run dev
```

#### 3. 前端构建错误
```bash
# 清理缓存
rm -rf client/node_modules
rm -rf client/dist
cd client && npm install

# 检查 TypeScript 错误
cd client && npm run type-check

# 重新构建
npm run build
```

#### 4. 文档不显示
**检查步骤：**
1. 确认文件在正确目录：`/server/documents/`
2. 检查文件权限：`ls -la server/documents/`
3. 重启开发服务器：`npm run dev`
4. 查看浏览器控制台错误

## 📊 性能监控

### 系统资源检查
```bash
# 检查磁盘使用
du -sh /Users/wangjiaqiao/Desktop/blog/server/uploads
du -sh /Users/wangjiaqiao/Desktop/blog/server/compiled

# 检查进程状态
ps aux | grep node

# 内存使用情况
top -p $(pgrep -f "npm run dev")
```

### 日志监控
```bash
# 查看实时日志（开发模式）
npm run dev | tee logs/app-$(date +%Y%m%d).log

# 分析错误日志
grep -i error logs/*.log
```

## 🔒 安全建议

### 生产环境配置
1. **文件系统权限**
   ```bash
   # 设置合适的文件权限
   chmod 755 server/documents
   chmod 644 server/documents/*.typ
   chmod 755 server/uploads
   ```

2. **防火墙配置**
   ```bash
   # 仅允许必要端口
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw deny 3001/tcp  # 生产环境应通过反向代理访问
   ```

3. **定期安全检查**
   ```bash
   # 检查异常文件
   find server/ -name "*.typ" -exec grep -l "exec\|system\|import" {} \;

   # 监控磁盘使用
   df -h | grep server
   ```

## 📚 完整文档

本项目提供了完整的技术文档，帮助快速上手和深入了解系统：

- [📖 技术架构指南](./docs/TECHNICAL_GUIDE.md) - 详细的技术架构和设计模式
- [⚡ 快速参考手册](./QUICK_REFERENCE.md) - 开发时的快速查阅指南
- [📡 API接口文档](./docs/API_DOCUMENTATION.md) - 完整的API接口说明
- [🧩 组件库指南](./docs/COMPONENT_LIBRARY.md) - 组件使用和自定义指南
- [🚀 部署指南](./docs/DEPLOYMENT_GUIDE.md) - 生产环境部署和运维
- [🔄 网站更新指南](./网站更新指南.md) - 内容管理和更新流程

### 🌐 多语言系统使用

```typescript
// 在组件中使用多语言
import { useLanguage } from '../contexts/LanguageContext'

function MyComponent() {
  const { t, language } = useLanguage()

  return (
    <div>
      <h1>{t('page.title')}</h1>
      <p>{language === 'zh' ? '中文内容' : 'English content'}</p>
    </div>
  )
}
```

### 🎨 主题系统使用

```typescript
// 使用主题切换
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  )
}
```

## 🎯 主要页面特性

- **首页** - 展示所有文章概览和统计
- **博客中心** - 博客分类展示和管理
  - 生活日志 - 记录日常生活和感悟
  - 技术博客 - 技术文章和经验分享
- **技能展示** - 个人技术栈和项目经验
- **视频内容** - 技术教程和项目演示
- **音乐作品** - 音乐创作和分享
- **文档中心** - Typst和Markdown文档管理
- **个人简历** - 专业履历和成就展示

## 📋 快速开发指南

### 添加新页面
1. 创建页面组件 `client/src/pages/NewPage.tsx`
2. 添加路由到 `client/src/App.tsx`
3. 添加导航项到 `client/src/components/Navigation.tsx`
4. 添加翻译到 `client/src/contexts/LanguageContext.tsx`

### 添加新文章
在 `server/data/articles.json` 中添加：
```json
{
  "id": "unique-id",
  "title": "文章标题",
  "excerpt": "文章摘要",
  "content": "完整内容",
  "author": "作者",
  "category": "blog",
  "tags": ["标签1", "标签2"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 自定义主题色彩
编辑 `client/src/styles/index.css` 中的CSS变量：
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
}
```

## 📞 技术支持

如果遇到问题：
1. 📖 查阅本文档和 `网站更新指南.md`
2. 🔍 检查浏览器开发者工具的控制台错误
3. 📝 查看服务器终端输出的错误信息
4. 🔧 按照故障排除章节进行诊断

**重要提醒：**
- 定期备份 `articles.json` 文件
- 谨慎修改系统配置文件
- 生产环境部署前请先在测试环境验证

---

**最后更新**：2025年9月22日
**当前版本**：v2.0.0
**维护状态**：积极维护中
