import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow, coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useThemeContext } from '../components/ThemeProvider'
import TypstViewer from '../components/TypstViewer'
import { typstLanguage } from '../utils/typstLanguage'
import { isTypstContent } from '../../../shared/utils/contentUtils'
import type { Article } from '../../../shared/types'

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const { resolvedTheme } = useThemeContext()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Register Typst language for syntax highlighting
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Prism) {
      (window as any).Prism.languages.typst = typstLanguage
      (window as any).Prism.languages.typ = typstLanguage
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchArticle(id)
    }
  }, [id])

  const fetchArticle = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}`)
      const result = await response.json()

      if (result.success) {
        setArticle(result.data)
      } else {
        setError(result.error || 'Article not found')
      }
    } catch (error) {
      console.error('Failed to fetch article:', error)
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  // Optimize PDF viewer layout
  const optimizePdfLayout = () => {
    const iframe = document.querySelector('.pdf-viewer') as HTMLIFrameElement
    if (iframe) {
      iframe.onload = () => {
        try {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document
          if (iframeDocument) {
            // Add CSS to optimize sidebar width in PDF.js
            const style = iframeDocument.createElement('style')
            style.textContent = `
              #sidebarContainer {
                width: 150px !important;
                min-width: 150px !important;
              }
              #viewerContainer {
                left: 150px !important;
              }
              .sidebarOpen #viewerContainer {
                left: 150px !important;
              }
              #outerContainer.sidebarOpen #viewerContainer {
                left: 150px !important;
              }
            `
            iframeDocument.head.appendChild(style)
          }
        } catch (e) {
          // CORS restrictions might prevent access to iframe content
          console.log('PDF layout optimization skipped due to CORS restrictions')
        }
      }
    }
  }

  // Apply PDF layout optimization for Typst articles
  useEffect(() => {
    if (article && isTypstContent(article.content)) {
      setTimeout(optimizePdfLayout, 1000)
    }
  }, [article])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error || 'Article not found'}</p>
        <Link to="/blog" className="btn-primary">
          返回博客
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft size={16} />
          <span>返回博客</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User size={14} />
            <span>{article.author}</span>
          </div>
        </div>

        {article.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-6">
            <Tag size={14} className="text-gray-400 dark:text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Article Content */}
      <article className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
        {/* Images */}
        {article.images.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Article image ${index + 1}`}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Typst Document */}
        {article.typstDocument && (
          <div className="mb-8">
            <TypstViewer
              typstUrl={article.typstDocument}
              pdfUrl={article.typstPdf}
              title={`${article.title} - 附件文档`}
            />
          </div>
        )}

        {/* Document File (PDF/Typst) */}
        {(article as any).documentFile && (
          <div className="mb-8">
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const docPath = (article as any).documentFile;
                  const fileName = docPath.split('/').pop() || 'document';
                  const docId = btoa(fileName);
                  window.open(`/api/documents/${docId}/pdf`, '_blank');
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                查看 PDF
              </button>
            </div>
          </div>
        )}

        {/* Audio Player */}
        {(article as any).musicFile && (
          <div className="mb-8">
            <audio
              controls
              className="w-full h-12 rounded-lg"
              preload="metadata"
            >
              <source src={`${(article as any).musicFile}`} type="audio/mp4" />
              <source src={`${(article as any).musicFile}`} type="audio/mpeg" />
              您的浏览器不支持音频播放功能。
            </audio>
          </div>
        )}

        {/* Main Content */}
        <div className={`blog-content prose prose-lg max-w-none ${resolvedTheme === 'dark' ? 'prose-invert' : ''}`}>
          {/* Render based on content type */}
          {isTypstContent(article.content) ? (
            <div className="typst-content">

              {/* PDF Viewer */}
              <div className="mb-6">
                <iframe
                  src={`/api/articles/${article.id}/pdf`}
                  className="w-full h-screen border border-gray-200 dark:border-gray-600 rounded-lg"
                  title="Typst PDF Preview"
                  style={{ minHeight: '600px' }}
                />
              </div>

              {/* Source Code Viewer - 完整显示 */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <span>查看源码</span>
                </summary>
                <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-600">
                  <code>{article.content}</code>
                </pre>
              </details>
            </div>
          ) : (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={resolvedTheme === 'dark' ? coldarkDark : tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {article.content}
            </ReactMarkdown>
          )}
        </div>
      </article>

      {/* Article Footer */}
      <footer className="mt-8 text-center">
        <Link
          to="/blog"
          className="btn-secondary"
        >
          返回博客列表
        </Link>
      </footer>
    </div>
  )
}