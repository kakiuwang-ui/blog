import { useState, useMemo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow, coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ChevronLeft, ChevronRight, FileText, Hash } from 'lucide-react'
import { useThemeContext } from './ThemeProvider'

interface SegmentedCodeViewerProps {
  content: string
  language: string
  title?: string
  className?: string
}

interface CodeSegment {
  title: string
  content: string
  startLine: number
  endLine: number
}

export default function SegmentedCodeViewer({
  content,
  language,
  title = '查看源码',
  className = ''
}: SegmentedCodeViewerProps) {
  const { resolvedTheme } = useThemeContext()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentSegment, setCurrentSegment] = useState(0)
  const [viewMode, setViewMode] = useState<'full' | 'segmented'>('full')

  // 根据内容类型智能分段
  const segments = useMemo<CodeSegment[]>(() => {
    const lines = content.split('\n')
    const segments: CodeSegment[] = []

    if (language === 'typst') {
      // Typst文档分段逻辑
      let currentSegment: CodeSegment | null = null
      let segmentStart = 0

      lines.forEach((line, index) => {
        const trimmedLine = line.trim()

        // 检测各种Typst结构
        if (
          trimmedLine.startsWith('#import') ||
          trimmedLine.startsWith('#set ') ||
          trimmedLine.startsWith('#show:')
        ) {
          if (currentSegment) {
            currentSegment.endLine = index - 1
            segments.push(currentSegment)
          }
          currentSegment = {
            title: trimmedLine.startsWith('#import') ? '导入和配置' :
                   trimmedLine.startsWith('#set') ? '文档设置' : '样式配置',
            content: '',
            startLine: index,
            endLine: index
          }
          segmentStart = index
        } else if (trimmedLine.startsWith('#resume-section')) {
          if (currentSegment) {
            currentSegment.endLine = index - 1
            segments.push(currentSegment)
          }
          // 提取section名称
          const match = trimmedLine.match(/#resume-section\(["\']([^"']+)["\']|\[([^\]]+)\]/)
          const sectionName = match ? (match[1] || match[2]) : '未知部分'
          currentSegment = {
            title: sectionName,
            content: '',
            startLine: index,
            endLine: index
          }
          segmentStart = index
        } else if (trimmedLine.startsWith('#resume-project')) {
          if (currentSegment) {
            currentSegment.endLine = index - 1
            segments.push(currentSegment)
          }
          // 提取项目标题
          const match = trimmedLine.match(/title:\s*["\']([^"']+)["\']/)
          const projectTitle = match ? match[1] : '项目'
          currentSegment = {
            title: `项目: ${projectTitle}`,
            content: '',
            startLine: index,
            endLine: index
          }
          segmentStart = index
        } else if (trimmedLine.startsWith('#resume-education')) {
          if (currentSegment) {
            currentSegment.endLine = index - 1
            segments.push(currentSegment)
          }
          currentSegment = {
            title: '教育经历详情',
            content: '',
            startLine: index,
            endLine: index
          }
          segmentStart = index
        }
      })

      // 添加最后一个段落
      if (currentSegment) {
        currentSegment.endLine = lines.length - 1
        segments.push(currentSegment)
      }

      // 为每个段落生成内容
      segments.forEach(segment => {
        segment.content = lines.slice(segment.startLine, segment.endLine + 1).join('\n')
      })
    }

    // 如果没有检测到特定结构，使用通用分段
    if (segments.length === 0) {
      const linesPerSegment = Math.ceil(lines.length / 5) // 分为5段
      for (let i = 0; i < lines.length; i += linesPerSegment) {
        const endIndex = Math.min(i + linesPerSegment - 1, lines.length - 1)
        segments.push({
          title: `第 ${Math.floor(i / linesPerSegment) + 1} 部分`,
          content: lines.slice(i, endIndex + 1).join('\n'),
          startLine: i,
          endLine: endIndex
        })
      }
    }

    return segments
  }, [content, language])

  const currentSegmentData = segments[currentSegment] || { title: '', content: content, startLine: 0, endLine: 0 }

  const handlePrevSegment = () => {
    setCurrentSegment(prev => Math.max(0, prev - 1))
  }

  const handleNextSegment = () => {
    setCurrentSegment(prev => Math.min(segments.length - 1, prev + 1))
  }

  return (
    <div className={`mt-4 ${className}`}>
      <details open={isExpanded} onToggle={(e) => setIsExpanded(e.currentTarget.open)}>
        <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
          <FileText size={16} />
          <span>{title}</span>
          {segments.length > 1 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({segments.length} 个部分)
            </span>
          )}
        </summary>

        {isExpanded && (
          <div className="space-y-4">
            {/* 视图模式切换 */}
            {segments.length > 1 && (
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('full')}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      viewMode === 'full'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    完整显示
                  </button>
                  <button
                    onClick={() => setViewMode('segmented')}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      viewMode === 'segmented'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    分段显示
                  </button>
                </div>

                {viewMode === 'segmented' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrevSegment}
                      disabled={currentSegment === 0}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {currentSegment + 1} / {segments.length}
                    </span>
                    <button
                      onClick={handleNextSegment}
                      disabled={currentSegment === segments.length - 1}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 分段导航 */}
            {viewMode === 'segmented' && segments.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {segments.map((segment, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSegment(index)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                      index === currentSegment
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {segment.title}
                  </button>
                ))}
              </div>
            )}

            {/* 当前段落标题 */}
            {viewMode === 'segmented' && segments.length > 1 && (
              <div className="flex items-center space-x-2 mb-2">
                <Hash size={14} className="text-blue-500" />
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {currentSegmentData.title}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  (第 {currentSegmentData.startLine + 1}-{currentSegmentData.endLine + 1} 行)
                </span>
              </div>
            )}

            {/* 代码显示 */}
            <SyntaxHighlighter
              language={language}
              style={resolvedTheme === 'dark' ? coldarkDark : tomorrow}
              className="code-highlighter"
              showLineNumbers={true}
              startingLineNumber={viewMode === 'segmented' ? currentSegmentData.startLine + 1 : 1}
              customStyle={{
                margin: 0,
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.5',
                maxHeight: viewMode === 'segmented' ? '50vh' : '70vh',
                overflow: 'auto'
              }}
            >
              {viewMode === 'segmented' ? currentSegmentData.content : content}
            </SyntaxHighlighter>
          </div>
        )}
      </details>
    </div>
  )
}