# 🚀 开发环境搭建指南

## 📋 环境要求

### 必需软件

| 软件 | 版本要求 | 下载链接 | 说明 |
|------|----------|----------|------|
| **Node.js** | >= 18.0.0 | [nodejs.org](https://nodejs.org/) | JavaScript运行时 |
| **npm** | >= 8.0.0 | 随Node.js安装 | 包管理器 |
| **Typst** | 最新版本 | [typst.app](https://typst.app/) | 文档编译器 |
| **Git** | >= 2.25.0 | [git-scm.com](https://git-scm.com/) | 版本控制 |

### 推荐工具

| 工具 | 用途 | 下载链接 |
|------|------|----------|
| **VS Code** | 代码编辑器 | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Chrome DevTools** | 前端调试 | 内置于Chrome浏览器 |
| **Postman** | API测试 | [postman.com](https://www.postman.com/) |

## 🔧 安装步骤

### 1. 检查环境

```bash
# 检查Node.js版本
node --version
# 应显示 v18.0.0 或更高

# 检查npm版本
npm --version
# 应显示 8.0.0 或更高

# 检查Git版本
git --version
# 应显示 2.25.0 或更高
```

### 2. 安装Typst

#### macOS (使用Homebrew)
```bash
# 安装Homebrew (如果未安装)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装Typst
brew install typst

# 验证安装
typst --version
```

#### Windows
```bash
# 使用Scoop (推荐)
scoop install typst

# 或下载预编译二进制文件
# 从 https://github.com/typst/typst/releases 下载
# 解压到PATH目录中

# 验证安装
typst --version
```

#### Linux
```bash
# Ubuntu/Debian
wget https://github.com/typst/typst/releases/latest/download/typst-x86_64-unknown-linux-musl.tar.xz
tar -xf typst-x86_64-unknown-linux-musl.tar.xz
sudo mv typst-x86_64-unknown-linux-musl/typst /usr/local/bin/

# 验证安装
typst --version
```

### 3. 项目设置

```bash
# 1. 克隆项目 (如果从Git仓库)
git clone <repository-url>
cd blog

# 或者如果是本地项目
cd /path/to/blog

# 2. 安装项目依赖
npm install

# 3. 验证安装
npm run --version
```

## 📝 VS Code配置

### 推荐扩展

创建 `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "nvarner.typst-lsp"
  ]
}
```

### 工作区设置

创建 `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "[typst]": {
    "editor.defaultFormatter": "nvarner.typst-lsp"
  }
}
```

### 调试配置

创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/client/src"
    },
    {
      "name": "Attach to Node",
      "port": 9229,
      "request": "attach",
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    }
  ]
}
```

## 🏃‍♂️ 启动开发环境

### 快速启动
```bash
# 同时启动前后端开发服务器
npm run dev
```

### 分别启动
```bash
# 终端1: 启动后端服务器
npm run dev:server
# 运行在 http://localhost:3001

# 终端2: 启动前端开发服务器
npm run dev:client
# 运行在 http://localhost:5173
```

### 验证启动成功

1. **前端**: 打开 http://localhost:5173
2. **后端**: 访问 http://localhost:3001/api/articles
3. **文档功能**: 上传.typ文件到`server/documents/`目录测试

## 🔍 开发工具

### 代码质量检查

```bash
# ESLint检查
npm run lint

# 自动修复ESLint问题
npm run lint:fix

# TypeScript类型检查
npm run type-check

# Prettier格式化
npm run format
```

### 构建和测试

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 启动生产服务器
npm start
```

## 🐛 调试设置

### 前端调试

1. **React DevTools**:
   - 安装浏览器扩展
   - 在开发者工具中查看组件状态

2. **网络调试**:
   ```javascript
   // 在浏览器控制台测试API
   fetch('/api/articles').then(r => r.json()).then(console.log)
   ```

3. **日志调试**:
   ```typescript
   // 组件中添加调试日志
   console.log('Component state:', { loading, articles })
   ```

### 后端调试

1. **详细日志**:
   ```bash
   DEBUG=* npm run dev:server
   ```

2. **Node.js调试**:
   ```bash
   # 启动调试模式
   npm run dev:server:debug
   # 然后在VS Code中附加调试器
   ```

3. **API测试**:
   ```bash
   # 使用curl测试API
   curl http://localhost:3001/api/articles | jq '.'
   ```

## 📁 项目结构理解

### 开发时的关键目录

```
blog/
├── client/                 # 前端开发目录
│   ├── src/
│   │   ├── components/     # 🔧 主要开发组件
│   │   ├── pages/         # 🔧 页面组件开发
│   │   ├── contexts/      # 🔧 状态管理
│   │   └── styles/        # 🎨 样式开发
│   ├── public/            # 静态资源
│   └── index.html         # 入口HTML
├── server/                # 后端开发目录
│   ├── src/
│   │   ├── routes/        # 🔧 API路由开发
│   │   └── utils/         # 🔧 工具函数
│   ├── documents/         # 📄 测试文档存放
│   └── data/             # 📊 数据文件
└── shared/               # 🔗 共享类型定义
```

### 开发时常用文件

| 文件 | 用途 | 修改频率 |
|------|------|----------|
| `client/src/pages/*.tsx` | 页面开发 | ⭐⭐⭐ |
| `client/src/components/*.tsx` | 组件开发 | ⭐⭐⭐ |
| `client/src/contexts/LanguageContext.tsx` | 多语言管理 | ⭐⭐ |
| `server/src/routes/*.ts` | API开发 | ⭐⭐ |
| `server/data/articles.json` | 测试数据 | ⭐⭐ |
| `shared/types.ts` | 类型定义 | ⭐ |

## 🛠️ 开发最佳实践

### 1. 代码组织

```typescript
// 导入顺序
import React from 'react'                    // 1. React相关
import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'     // 2. 第三方库

import { useLanguage } from '../contexts'   // 3. 内部模块
import { Button } from '../components'

import type { Article } from '../../shared' // 4. 类型导入
```

### 2. 组件结构

```typescript
// 组件模板
interface Props {
  title: string
  optional?: boolean
}

export default function MyComponent({ title, optional = false }: Props) {
  // 1. Hooks
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)

  // 2. 副作用
  useEffect(() => {
    // ...
  }, [])

  // 3. 事件处理
  const handleClick = () => {
    // ...
  }

  // 4. 条件渲染
  if (loading) {
    return <div>Loading...</div>
  }

  // 5. 主要渲染
  return (
    <div className="component-wrapper">
      <h1>{title}</h1>
      {optional && <span>Optional content</span>}
    </div>
  )
}
```

### 3. 样式规范

```typescript
// Tailwind类名顺序
<div className="
  flex items-center justify-between    // 布局
  w-full h-12 p-4 m-2                // 尺寸和间距
  bg-white border border-gray-200     // 背景和边框
  text-gray-900 font-medium          // 文字
  rounded-lg shadow-md               // 装饰效果
  hover:bg-gray-50 transition-colors // 交互状态
  dark:bg-gray-800 dark:text-gray-100 // 主题变体
">
```

### 4. Git工作流

```bash
# 功能开发流程
git checkout -b feature/new-feature
# 开发代码...
git add .
git commit -m "feat: 添加新功能"
git push origin feature/new-feature
# 创建Pull Request...

# 提交信息规范
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## 🚨 常见问题解决

### 依赖安装问题

```bash
# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 端口占用问题

```bash
# 查找占用端口的进程
lsof -ti:3001
lsof -ti:5173

# 终止进程
kill -9 <PID>

# 或修改端口
# client/vite.config.ts
export default {
  server: { port: 5174 }
}

# server/src/server.ts
const PORT = process.env.PORT || 3002
```

### Typst编译问题

```bash
# 检查Typst安装
typst --version

# 手动测试编译
cd server/documents
typst compile test.typ test.pdf

# 检查文件权限
ls -la server/documents/
chmod 644 server/documents/*.typ
```

### 热重载不工作

```bash
# 确保文件监听权限
# macOS: 可能需要给终端完全磁盘访问权限

# 增加文件监听限制 (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 📚 学习资源

### 技术文档

- [React官方文档](https://react.dev/)
- [TypeScript手册](https://www.typescriptlang.org/docs/)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [Vite文档](https://vitejs.dev/guide/)
- [Typst文档](https://typst.app/docs/)

### 工具使用

- [VS Code技巧](https://code.visualstudio.com/docs)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Git教程](https://git-scm.com/docs/gittutorial)

---

🎉 **环境搭建完成！** 开始愉快的开发之旅吧！

如有问题，请参考 [TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md) 或 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)。