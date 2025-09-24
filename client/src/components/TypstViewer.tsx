import { useState, useEffect } from 'react'
import { FileText, Download, Eye, ExternalLink } from 'lucide-react'
import SegmentedCodeViewer from './SegmentedCodeViewer'

interface TypstViewerProps {
  typstUrl: string
  pdfUrl?: string
  title?: string
  className?: string
}

export default function TypstViewer({ typstUrl, pdfUrl, title, className = '' }: TypstViewerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typstContent, setTypstContent] = useState<string | null>(null)

  useEffect(() => {
    if (typstUrl) {
      loadTypstContent()
    }
  }, [typstUrl])

  const loadTypstContent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(typstUrl)
      if (response.ok) {
        const content = await response.text()
        setTypstContent(content)
      } else {
        setError('无法加载Typst文档')
      }
    } catch (err) {
      setError('加载文档时出错')
      console.error('Error loading Typst document:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = typstUrl
    link.download = title || 'document.typ'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenInNewTab = () => {
    window.open(typstUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className={`p-4 bg-gray-50 dark:bg-gray-700 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">加载Typst文档...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 dark:bg-red-900/20 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2">
          <FileText className="text-red-500" size={16} />
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-gray-50 dark:bg-gray-700 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileText className="text-blue-600 dark:text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title || 'Typst文档'}
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {pdfUrl && (
            <>
              <button
                onClick={() => window.open(pdfUrl, '_blank')}
                className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                title="查看PDF"
              >
                PDF
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = pdfUrl
                  link.download = (title || 'document') + '.pdf'
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                title="下载PDF"
              >
                <Download size={16} />
              </button>
            </>
          )}
          <button
            onClick={handleOpenInNewTab}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            title="在新标签页中打开源码"
          >
            <ExternalLink size={16} />
          </button>
          <button
            onClick={handleDownload}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            title="下载源码"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {typstContent && (
        <SegmentedCodeViewer
          content={typstContent}
          language="typst"
          title="文档预览 (Typst源码)"
        />
      )}

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        💡 提示: Typst是一个现代的排版系统，特别适合学术文档和简历。
        <br />
        {pdfUrl ? '点击PDF按钮查看渲染效果，或下载源文件进行编辑。' : '点击下载按钮获取源文件，或在新标签页中查看。'}
      </div>
    </div>
  )
}

// 简化版Typst链接组件
export function TypstLink({ typstUrl, title, className = '' }: TypstViewerProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = typstUrl
    link.download = title || 'document.typ'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleView = () => {
    window.open(typstUrl, '_blank')
  }

  return (
    <div className={`inline-flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg ${className}`}>
      <FileText className="text-blue-600 dark:text-blue-400" size={16} />
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        {title || 'Typst文档'}
      </span>
      <div className="flex items-center space-x-1">
        <button
          onClick={handleView}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          title="查看"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={handleDownload}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          title="下载"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  )
}