# 🚀 博客系统快速参考手册

## ⚡ 快速启动
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 前端: http://localhost:3001
# 后端: http://localhost:5001
```

## 📝 常用命令速查

### 开发命令
```bash
npm run dev          # 启动前后端开发服务器
npm run dev:client   # 仅启动前端
npm run dev:server   # 仅启动后端
npm run build        # 构建生产版本
npm start           # 启动生产服务器
npm run lint        # 代码检查
npm run type-check  # TypeScript类型检查
```

### Git工作流
```bash
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

## 🗂️ 文件结构速查

### 核心目录
```
blog/
├── client/src/
│   ├── components/     # 可复用组件
│   ├── pages/         # 页面组件
│   ├── contexts/      # React上下文
│   └── styles/        # 样式文件
├── server/src/        # 后端代码
├── shared/           # 共享类型
└── documents/        # 文档存储
```

### 关键文件
- `client/src/App.tsx` - 应用入口和路由
- `client/src/contexts/LanguageContext.tsx` - 多语言管理
- `server/src/server.ts` - 后端服务器
- `server/data/articles.json` - 文章数据
- `shared/types.ts` - TypeScript类型定义

## 🌐 多语言系统

### 添加翻译
```typescript
// 在 LanguageContext.tsx 中添加
const translations = {
  zh: {
    'your.key': '中文翻译',
  },
  en: {
    'your.key': 'English Translation',
  }
}
```

### 在组件中使用
```typescript
import { useLanguage } from '../contexts/LanguageContext'

function Component() {
  const { t, language } = useLanguage()

  return (
    <div>
      <h1>{t('your.key')}</h1>
      {language === 'zh' ? '中文内容' : 'English content'}
    </div>
  )
}
```

## 🎨 主题系统

### 使用主题
```typescript
import { useTheme } from 'next-themes'

function Component() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      切换主题
    </button>
  )
}
```

### 样式类参考
```css
/* 响应主题的类 */
text-gray-900 dark:text-gray-100
bg-white dark:bg-gray-800
border-gray-200 dark:border-gray-700

/* 常用组合 */
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
}
```

## 📄 新增内容

### 添加新文章
```json
// 在 server/data/articles.json 中添加
{
  "id": "unique-id",
  "title": "文章标题",
  "excerpt": "文章摘要",
  "content": "完整内容",
  "author": "作者",
  "category": "blog|skills|videos|music|resume",
  "tags": ["标签1", "标签2"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "images": []
}
```

### 添加新页面
```typescript
// 1. 创建页面组件 pages/NewPage.tsx
export default function NewPage() {
  const { t } = useLanguage()
  return <div>{t('page.title')}</div>
}

// 2. 添加路由到 App.tsx
<Route path="/new-page" element={<NewPage />} />

// 3. 添加导航项到 Navigation.tsx
{ path: '/new-page', label: t('nav.new_page'), icon: Icon }

// 4. 添加翻译到 LanguageContext.tsx
'nav.new_page': '新页面' / 'New Page'
```

## 🔧 组件开发

### 基础组件模板
```typescript
import { useLanguage } from '../contexts/LanguageContext'
import { Icon } from 'lucide-react'

interface Props {
  title: string
  children?: React.ReactNode
}

export default function MyComponent({ title, children }: Props) {
  const { t } = useLanguage()

  return (
    <div className="card">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h1>
      {children}
    </div>
  )
}
```

### SegmentedCodeViewer 使用
```typescript
import SegmentedCodeViewer from '../components/SegmentedCodeViewer'

// 基础用法
<SegmentedCodeViewer
  content={sourceCode}
  language="typst"
  title="查看源码"
/>

// 带自定义样式
<SegmentedCodeViewer
  content={content}
  language="javascript"
  title="代码预览"
  className="my-4"
/>
```

### 常用Hooks
```typescript
// 语言管理
const { t, language, setLanguage } = useLanguage()

// 主题管理
const { theme, setTheme } = useTheme()

// 状态管理
const [loading, setLoading] = useState(true)
const [data, setData] = useState<DataType[]>([])

// 副作用
useEffect(() => {
  fetchData()
}, [])
```

## 📱 响应式设计

### Tailwind断点
```css
/* 移动优先 */
sm:   640px+   /* 平板 */
md:   768px+   /* 小桌面 */
lg:   1024px+  /* 桌面 */
xl:   1280px+  /* 大桌面 */
2xl:  1536px+  /* 超大屏 */

/* 示例 */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 常用布局类
```css
/* 网格布局 */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
gap-4 md:gap-6

/* 弹性布局 */
flex flex-col md:flex-row
justify-between items-center
space-x-2 space-y-4

/* 显示控制 */
hidden md:block
block md:hidden
```

## 🎯 常用图标

### Lucide React图标
```typescript
import {
  Home, BookOpen, Code, Video, Music, User, FileText,
  Search, Filter, Download, Calendar, Tag, Edit,
  Sun, Moon, Menu, X, ChevronDown, Play
} from 'lucide-react'

// 使用
<Home size={20} className="text-blue-500" />
```

## 📊 数据获取模式

### API请求模板
```typescript
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch('/api/endpoint')
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])

// 加载状态
if (loading) {
  return <div className="animate-spin ...">Loading...</div>
}
```

## 🐛 调试技巧

### 前端调试
```typescript
// React DevTools
console.log('State:', { data, loading })

// 网络请求
fetch('/api/articles').then(r => r.json()).then(console.log)

// 错误边界
try {
  // 可能出错的代码
} catch (error) {
  console.error('Error:', error)
}
```

### 后端调试
```bash
# 启用详细日志
DEBUG=* npm run dev:server

# 检查文件权限
ls -la server/documents/

# 测试Typst编译
typst compile document.typ
```

## 🚨 常见问题

### 翻译不显示
```typescript
// 检查键是否存在
console.log(translations.zh['your.key'])

// 确保在Provider内使用
<LanguageProvider>
  <YourComponent />
</LanguageProvider>
```

### 主题不切换
```typescript
// 检查ThemeProvider设置
<ThemeProvider attribute="class" defaultTheme="system">
  <App />
</ThemeProvider>

// 确保CSS类包含dark:前缀
"text-gray-900 dark:text-gray-100"
```

### Typst编译失败
```bash
# 检查安装
typst --version

# 手动编译测试
typst compile document.typ output.pdf

# 检查文件路径和权限
ls -la server/documents/
```

## 📦 依赖包参考

### 核心依赖
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "typescript": "^4.9.0",
  "tailwindcss": "^3.2.0",
  "lucide-react": "^0.263.0",
  "next-themes": "^0.2.1"
}
```

### 开发依赖
```json
{
  "vite": "^4.1.0",
  "@types/react": "^18.0.0",
  "eslint": "^8.0.0",
  "prettier": "^2.8.0",
  "nodemon": "^2.0.0"
}
```

## 🎨 设计系统

### 色彩变量
```css
:root {
  --primary: #3b82f6;    /* 蓝色 */
  --secondary: #10b981;  /* 绿色 */
  --accent: #8b5cf6;     /* 紫色 */
  --warning: #f59e0b;    /* 橙色 */
  --error: #ef4444;      /* 红色 */
}
```

### 间距系统
```css
/* Tailwind间距 */
p-2  = 8px    p-4  = 16px   p-6  = 24px
m-2  = 8px    m-4  = 16px   m-6  = 24px
gap-2 = 8px   gap-4 = 16px  gap-6 = 24px
```

---

💡 **提示**: 保存此文件为书签，开发时随时查阅！