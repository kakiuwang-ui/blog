# 📖 技术架构指南

## 概览

本文档详细介绍博客系统的技术架构、设计模式、开发理念和实现细节。

## 🏗️ 整体架构

### 系统架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server │◄──►│  File System    │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Node.js       │    │ • JSON数据      │
│ • TypeScript    │    │ • TypeScript    │    │ • 文档文件      │
│ • Tailwind CSS  │    │ • Express       │    │ • 静态资源      │
│ • Vite         │    │ • Typst编译     │    │ • 上传文件      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技术选型理由

#### 前端技术栈
- **React 18**: 现代化的组件化开发，强大的生态系统
- **TypeScript**: 静态类型检查，提高代码质量和开发效率
- **Vite**: 快速的构建工具，优秀的开发体验
- **Tailwind CSS**: 实用优先的CSS框架，快速开发响应式界面
- **React Router**: 声明式路由管理

#### 后端技术栈
- **Node.js**: JavaScript运行时，与前端技术栈统一
- **Express**: 简单灵活的Web框架
- **TypeScript**: 后端代码类型安全
- **Typst**: 现代化文档编译系统

#### 数据存储
- **JSON文件**: 轻量级、易于维护、版本控制友好
- **文件系统**: 直接存储文档和资源文件

## 🔧 前端架构

### 组件层次结构
```
App
├── ThemeProvider          # 主题管理
├── LanguageProvider       # 多语言管理
├── Router                 # 路由管理
│   ├── Layout            # 页面布局
│   │   ├── Navigation    # 导航组件
│   │   └── Sidebar       # 侧边栏
│   └── Pages             # 页面组件
│       ├── Home          # 首页
│       ├── Blog          # 博客页面
│       ├── Documents     # 文档中心
│       ├── Resume        # 个人简历
│       └── ArticleDetail # 文章详情
└── GlobalComponents      # 全局组件
    ├── SegmentedCodeViewer # 代码分段查看器
    ├── TypstViewer       # Typst文档查看器
    └── LoadingSpinner    # 加载指示器
```

### 状态管理架构

#### React Context 模式
```typescript
// 主题状态管理
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: string) => void
  resolvedTheme: 'light' | 'dark'
}

// 语言状态管理
interface LanguageContextType {
  language: 'zh' | 'en'
  setLanguage: (lang: 'zh' | 'en') => void
  t: (key: string) => string
}
```

#### 本地状态管理
- **useState**: 组件内部状态
- **useEffect**: 副作用处理
- **useCallback**: 函数缓存
- **useMemo**: 计算结果缓存

### 路由架构
```typescript
// 路由配置
const routes = [
  { path: '/', element: <Home /> },
  { path: '/blog', element: <Blog /> },
  { path: '/blog/:id', element: <ArticleDetail /> },
  { path: '/documents', element: <Documents /> },
  { path: '/resume', element: <Resume /> }
]
```

## 🔧 后端架构

### 服务层架构
```
Express Server
├── Routes                # 路由层
│   ├── articles.ts      # 文章相关路由
│   ├── documents.ts     # 文档相关路由
│   └── health.ts        # 健康检查
├── Services             # 服务层
│   ├── ArticleService   # 文章业务逻辑
│   ├── DocumentService  # 文档业务逻辑
│   └── TypstService     # Typst编译服务
├── Middleware           # 中间件
│   ├── cors.ts         # 跨域处理
│   ├── static.ts       # 静态文件服务
│   └── error.ts        # 错误处理
└── Utils                # 工具函数
    ├── fileUtils.ts    # 文件操作
    └── validation.ts   # 数据验证
```

### API设计模式

#### RESTful API 设计
```typescript
// 标准响应格式
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

// 文章API端点
GET    /api/articles           # 获取文章列表
GET    /api/articles/:id       # 获取特定文章
POST   /api/articles          # 创建文章
PUT    /api/articles/:id      # 更新文章
DELETE /api/articles/:id      # 删除文章
GET    /api/articles/:id/pdf  # 编译Typst文章为PDF
```

#### 错误处理模式
```typescript
// 统一错误处理
try {
  const result = await service.operation()
  res.json({ success: true, data: result })
} catch (error) {
  console.error('Operation failed:', error)
  res.status(500).json({
    success: false,
    error: 'Operation failed',
    code: 'OPERATION_ERROR'
  })
}
```

## 📁 数据架构

### 文章数据模型
```typescript
interface Article {
  id: string                    // 唯一标识
  title: string                 // 标题
  content: string               // 内容
  category: ArticleCategory     // 分类
  tags: string[]                // 标签
  author: string                // 作者
  excerpt: string               // 摘要
  images: string[]              // 图片URL列表
  typstDocument?: string        // Typst文档路径
  typstPdf?: string            // PDF文档路径
  createdAt: string            // 创建时间
  updatedAt: string            // 更新时间
}

type ArticleCategory = 'blog' | 'skills' | 'projects' | 'music' | 'resume'
```

### 文档数据模型
```typescript
interface DocumentFile {
  id: string              // 文档ID（Base64编码）
  name: string           // 文件名
  type: 'typst' | 'markdown'  // 文档类型
  path: string           // 文件路径
  size: number           // 文件大小
  lastModified: string   // 最后修改时间
  content?: string       // 文档内容
}
```

### 文件存储架构
```
server/
├── data/
│   └── articles.json     # 文章数据
├── documents/            # 用户文档
│   ├── resume.typ
│   └── notes.typ
├── uploads/             # 上传文件
│   └── images/
│       ├── photo1.jpg
│       └── photo2.png
└── compiled/            # 临时编译文件
    └── temp_*.pdf
```

## 🔄 核心功能实现

### Typst 文档编译系统

#### 编译流程
```typescript
async function compileTypstContentToPDF(content: string, outputPath: string) {
  // 1. 创建临时Typst文件
  const tempPath = path.join(documentsDir, `temp_${Date.now()}.typ`)
  fs.writeFileSync(tempPath, content)

  // 2. 执行编译命令
  const command = `cd "${documentsDir}" && typst compile "${path.basename(tempPath)}" "${outputPath}"`
  await execAsync(command)

  // 3. 清理临时文件
  fs.unlinkSync(tempPath)
}
```

#### 安全措施
- 编译在隔离的文档目录中执行
- 临时文件自动清理
- 编译超时限制
- 文件大小限制

### 智能代码分段系统

#### 分段算法
```typescript
// Typst文档智能分段
function detectTypstSegments(content: string): CodeSegment[] {
  const lines = content.split('\n')
  const segments: CodeSegment[] = []

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()

    // 检测各种Typst结构
    if (trimmedLine.startsWith('#import')) {
      // 导入和配置段落
    } else if (trimmedLine.startsWith('#resume-section')) {
      // 简历段落
    } else if (trimmedLine.startsWith('#resume-project')) {
      // 项目段落
    }
  })

  return segments
}
```

#### 交互式导航
- 段落缩略图导航
- 前进/后退按钮
- 完整/分段模式切换
- 行号显示

### 多语言系统

#### 翻译管理
```typescript
const translations = {
  zh: {
    'nav.home': '首页',
    'nav.blog': '博客',
    'common.loading': '加载中...'
  },
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'common.loading': 'Loading...'
  }
}
```

#### 动态翻译函数
```typescript
function useTranslation() {
  const { language } = useLanguage()

  const t = useCallback((key: string): string => {
    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }, [language])

  return { t }
}
```

### 主题系统

#### 主题切换逻辑
```typescript
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

## 🎨 样式系统架构

### Tailwind CSS 配置
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 自定义颜色系统
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      },
      typography: {
        // 自定义排版
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit'
          }
        }
      }
    }
  }
}
```

### CSS架构模式
```css
/* 基础样式 */
@layer base {
  html {
    @apply scroll-smooth;
  }

  body {
    @apply text-gray-900 dark:text-gray-100;
    @apply bg-white dark:bg-gray-900;
  }
}

/* 组件样式 */
@layer components {
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
  }

  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
  }
}
```

## 🔒 安全架构

### 前端安全
- XSS防护：React默认转义
- CSRF防护：SameSite cookies
- 输入验证：TypeScript类型检查
- 路径安全：React Router保护

### 后端安全
- CORS配置：限制跨域访问
- 文件类型验证：严格的文件扩展名检查
- 路径遍历防护：禁止相对路径
- 资源限制：文件大小和超时限制

### Typst编译安全
```typescript
// 安全编译环境
const ALLOWED_EXTENSIONS = ['.typ', '.md']
const MAX_FILE_SIZE = 10 * 1024 * 1024  // 10MB
const COMPILE_TIMEOUT = 30000  // 30秒

function validateFile(filename: string, size: number) {
  const ext = path.extname(filename).toLowerCase()

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error('Invalid file type')
  }

  if (size > MAX_FILE_SIZE) {
    throw new Error('File too large')
  }
}
```

## 📈 性能优化

### 前端优化
- **代码分割**: React.lazy动态导入
- **组件缓存**: React.memo避免重复渲染
- **虚拟化**: 大列表虚拟滚动
- **图片优化**: WebP格式和懒加载

### 后端优化
- **文件缓存**: PDF编译结果临时缓存
- **流式传输**: 大文件流式响应
- **并发处理**: 异步编译处理
- **资源压缩**: Gzip压缩

### 构建优化
```typescript
// Vite配置优化
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'react-syntax-highlighter']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
```

## 🧪 测试架构

### 单元测试
```typescript
// 组件测试
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../contexts/ThemeProvider'

function renderWithProviders(ui: ReactElement) {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </MemoryRouter>
  )
}
```

### 集成测试
```typescript
// API测试
describe('Articles API', () => {
  it('should return articles list', async () => {
    const response = await fetch('/api/articles')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })
})
```

## 🚀 部署架构

### 开发环境
- Vite开发服务器
- Nodemon热重载
- 并发运行前后端

### 生产环境
- Nginx反向代理
- PM2进程管理
- SSL/TLS加密
- 静态资源CDN

### CI/CD流程
```yaml
# 构建流程
1. 代码检查 (ESLint, TypeScript)
2. 单元测试
3. 构建优化
4. 部署到服务器
5. 健康检查
```

## 📚 最佳实践

### 代码组织
- **单一职责**: 每个组件/函数只负责一个功能
- **组合优于继承**: 使用组合模式构建复杂组件
- **依赖注入**: 通过Props传递依赖
- **错误边界**: React错误边界处理异常

### 类型安全
```typescript
// 严格类型定义
interface StrictProps {
  id: string
  title: string
  onSelect: (id: string) => void
  isLoading?: boolean
}

// 类型守卫
function isValidArticle(obj: any): obj is Article {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string'
}
```

### 性能监控
- React DevTools Profiler
- 网络请求监控
- 内存使用监控
- 用户体验指标

---

**最后更新**: 2025年9月23日
**技术架构版本**: v2.0.0