# 🧩 组件库指南

## 概览

本文档详细介绍了博客系统中的所有组件，包括组件的功能、属性、使用方法和自定义指南。

## 📁 组件分类

### 核心组件
- [ThemeProvider](#themeprovider) - 主题管理
- [LanguageContext](#languagecontext) - 多语言支持
- [Navigation](#navigation) - 导航组件

### 内容组件
- [SegmentedCodeViewer](#segmentedcodeviewer) - 分段代码查看器
- [TypstViewer](#typstviewer) - Typst 文档查看器
- [ArticleCard](#articlecard) - 文章卡片
- [StatCard](#statcard) - 统计卡片

### 布局组件
- [PageLayout](#pagelayout) - 页面布局
- [Sidebar](#sidebar) - 侧边栏
- [LoadingSpinner](#loadingspinner) - 加载指示器

## 🎨 核心组件

### ThemeProvider

主题管理组件，提供暗黑/明亮模式切换功能。

**位置**: `client/src/components/ThemeProvider.tsx`

#### 功能特性
- 支持 `light`、`dark`、`system` 三种主题模式
- 自动检测系统主题偏好
- 主题状态持久化存储
- 提供主题切换 Hook

#### 使用方法
```tsx
import { useThemeContext } from './components/ThemeProvider'

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useThemeContext()

  return (
    <div className={`component ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        切换主题
      </button>
    </div>
  )
}
```

#### Props 接口
```tsx
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  resolvedTheme: 'light' | 'dark'
}
```

### LanguageContext

多语言支持组件，提供中英文切换功能。

**位置**: `client/src/contexts/LanguageContext.tsx`

#### 功能特性
- 支持中文和英文界面
- 翻译文本管理
- 语言偏好持久化
- 实时语言切换

#### 使用方法
```tsx
import { useLanguage } from '../contexts/LanguageContext'

function MyComponent() {
  const { t, language, setLanguage } = useLanguage()

  return (
    <div>
      <h1>{t('page.title')}</h1>
      <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}>
        {language === 'zh' ? 'English' : '中文'}
      </button>
    </div>
  )
}
```

#### 翻译配置
```tsx
const translations = {
  zh: {
    'page.title': '页面标题',
    'common.loading': '加载中...'
  },
  en: {
    'page.title': 'Page Title',
    'common.loading': 'Loading...'
  }
}
```

### Navigation

导航组件，提供网站主要导航功能。

**位置**: `client/src/components/Navigation.tsx`

#### 功能特性
- 响应式设计（桌面/移动端适配）
- 多级导航菜单
- 当前页面高亮
- 移动端折叠菜单

#### 配置方法
```tsx
const navItems = [
  {
    to: '/blog',
    label: '博客中心',
    subItems: [
      { to: '/blog?category=blog', label: '生活日志' },
      { to: '/documents', label: '技术博客' }
    ]
  }
]
```

## 📄 内容组件

### SegmentedCodeViewer

智能代码分段查看器，特别优化了 Typst 文档显示。

**位置**: `client/src/components/SegmentedCodeViewer.tsx`

#### 功能特性
- 自动检测 Typst 文档结构
- 智能分段（基于 section、project 等）
- 双模式显示（完整/分段）
- 语法高亮支持
- 交互式导航

#### Props 接口
```tsx
interface SegmentedCodeViewerProps {
  content: string           // 代码内容
  language: string          // 语言类型（如 'typst', 'javascript'）
  title?: string            // 标题（默认：'查看源码'）
  className?: string        // 自定义样式类
}
```

#### 使用示例
```tsx
<SegmentedCodeViewer
  content={typstContent}
  language="typst"
  title="简历源码"
  className="my-4"
/>
```

#### 自定义分段逻辑
```tsx
// 在组件内部，可以扩展分段检测逻辑
const detectSegments = (content: string, language: string) => {
  if (language === 'typst') {
    // 检测 Typst 特定结构
    if (line.startsWith('#resume-section')) {
      // 处理简历段落
    } else if (line.startsWith('#import')) {
      // 处理导入段落
    }
  }
  // 添加其他语言的分段逻辑
}
```

### TypstViewer

Typst 文档查看器，提供完整的文档预览和操作功能。

**位置**: `client/src/components/TypstViewer.tsx`

#### 功能特性
- 自动加载 Typst 文档内容
- PDF 预览支持
- 源码下载
- 错误处理和加载状态

#### Props 接口
```tsx
interface TypstViewerProps {
  typstUrl: string          // Typst 文档 URL
  pdfUrl?: string          // PDF 文档 URL（可选）
  title?: string           // 文档标题
  className?: string       // 自定义样式类
}
```

#### 使用示例
```tsx
<TypstViewer
  typstUrl="/documents/resume.typ"
  pdfUrl="/documents/resume.pdf"
  title="个人简历"
/>
```

#### 简化版组件
```tsx
<TypstLink
  typstUrl="/documents/document.typ"
  title="快速链接"
  className="inline-block"
/>
```

### ArticleCard

文章卡片组件，用于展示文章摘要信息。

**位置**: `client/src/components/ArticleCard.tsx`

#### Props 接口
```tsx
interface ArticleCardProps {
  article: {
    id: string
    title: string
    excerpt: string
    author: string
    createdAt: string
    tags: string[]
    category: string
    images?: string[]
  }
  onClick?: (article: Article) => void
}
```

#### 使用示例
```tsx
<ArticleCard
  article={article}
  onClick={(article) => navigate(`/article/${article.id}`)}
/>
```

## 🎛️ 布局组件

### PageLayout

页面布局组件，提供统一的页面结构。

#### 使用方法
```tsx
function MyPage() {
  return (
    <PageLayout
      title="页面标题"
      subtitle="页面描述"
      breadcrumb={[
        { label: '首页', to: '/' },
        { label: '当前页', to: '/current' }
      ]}
    >
      <div>页面内容</div>
    </PageLayout>
  )
}
```

### LoadingSpinner

加载指示器组件，用于显示加载状态。

#### 使用方法
```tsx
{loading && <LoadingSpinner text="加载中..." />}
```

## 🔧 自定义和扩展

### 添加新组件

#### 1. 创建组件文件
```tsx
// client/src/components/MyNewComponent.tsx
import React from 'react'

interface MyNewComponentProps {
  title: string
  content: string
  className?: string
}

export default function MyNewComponent({
  title,
  content,
  className = ''
}: MyNewComponentProps) {
  return (
    <div className={`new-component ${className}`}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  )
}
```

#### 2. 添加样式
```css
/* client/src/styles/components.css */
.new-component {
  @apply p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md;
}

.new-component h2 {
  @apply text-xl font-bold text-gray-900 dark:text-gray-100 mb-2;
}
```

#### 3. 导出组件
```tsx
// client/src/components/index.ts
export { default as MyNewComponent } from './MyNewComponent'
```

### 主题自定义

#### 1. 扩展主题变量
```css
/* client/src/styles/index.css */
:root {
  /* 自定义颜色 */
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --color-accent: #f59e0b;

  /* 自定义间距 */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;

  /* 自定义字体 */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Source Sans Pro', sans-serif;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-secondary: #34d399;
}
```

#### 2. 组件主题适配
```tsx
function ThemedComponent() {
  const { resolvedTheme } = useThemeContext()

  return (
    <div className={`
      component
      ${resolvedTheme === 'dark' ? 'dark-theme' : 'light-theme'}
    `}>
      内容
    </div>
  )
}
```

### 国际化扩展

#### 1. 添加新语言
```tsx
// client/src/contexts/LanguageContext.tsx
const translations = {
  zh: { /* 中文翻译 */ },
  en: { /* 英文翻译 */ },
  ja: { /* 日文翻译 */ }  // 新增日语支持
}

type Language = 'zh' | 'en' | 'ja'  // 更新类型定义
```

#### 2. 语言选择组件
```tsx
function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' }
  ]

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  )
}
```

## 🎨 样式系统

### Tailwind CSS 配置
```javascript
// client/tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      }
    }
  }
}
```

### 自定义CSS类
```css
/* 实用类 */
.btn-primary {
  @apply px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors;
}

.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
}

.text-muted {
  @apply text-gray-600 dark:text-gray-400;
}
```

## 📱 响应式设计

### 断点系统
```css
/* 移动端优先设计 */
.responsive-component {
  @apply text-sm;

  /* 平板 */
  @apply md:text-base;

  /* 桌面 */
  @apply lg:text-lg;

  /* 大屏 */
  @apply xl:text-xl;
}
```

### 移动端适配
```tsx
function ResponsiveComponent() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      {/* 响应式内容 */}
    </div>
  )
}
```

## 🧪 测试组件

### 单元测试示例
```tsx
// __tests__/SegmentedCodeViewer.test.tsx
import { render, screen } from '@testing-library/react'
import SegmentedCodeViewer from '../SegmentedCodeViewer'

describe('SegmentedCodeViewer', () => {
  it('renders code content correctly', () => {
    const content = '#import "template.typ": *'

    render(
      <SegmentedCodeViewer
        content={content}
        language="typst"
      />
    )

    expect(screen.getByText('查看源码')).toBeInTheDocument()
  })
})
```

### 集成测试
```tsx
// __tests__/integration/ThemeToggle.test.tsx
import { render, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../ThemeProvider'
import ThemeToggleButton from '../ThemeToggleButton'

test('theme toggle works correctly', () => {
  render(
    <ThemeProvider>
      <ThemeToggleButton />
    </ThemeProvider>
  )

  const toggleButton = screen.getByRole('button')
  fireEvent.click(toggleButton)

  // 验证主题切换逻辑
})
```

## 📚 最佳实践

### 1. 组件设计原则
- **单一职责**: 每个组件只负责一个特定功能
- **可复用性**: 通过 props 配置，避免硬编码
- **可访问性**: 支持键盘导航和屏幕阅读器
- **性能优化**: 使用 React.memo 和 useMemo 优化渲染

### 2. Props 设计
```tsx
// 好的 Props 设计
interface ComponentProps {
  // 必需属性在前
  content: string

  // 可选属性在后，提供默认值
  title?: string
  className?: string

  // 回调函数
  onContentChange?: (content: string) => void

  // 布尔属性使用 is/has/can 前缀
  isLoading?: boolean
  hasError?: boolean
}
```

### 3. 错误边界
```tsx
class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }

    return this.props.children
  }
}
```

---

**最后更新**: 2025年9月23日
**组件库版本**: v2.0.0