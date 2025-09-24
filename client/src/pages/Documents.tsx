import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, HardDrive, Search, Filter } from 'lucide-react'
import SegmentedCodeViewer from '../components/SegmentedCodeViewer'
import { useLanguage } from '../contexts/LanguageContext'
import { typstLanguage } from '../utils/typstLanguage'

interface DocumentFile {
  id: string
  name: string
  type: 'markdown' | 'typst'
  path: string
  size: number
  lastModified: string
  content?: string
}

export default function Documents() {
  const { t, language } = useLanguage()
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'markdown' | 'typst'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null)
  const [loading, setLoading] = useState(true)

  // Register Typst language for syntax highlighting
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Prism) {
      (window as any).Prism.languages.typst = typstLanguage
      (window as any).Prism.languages.typ = typstLanguage
    }
  }, [])

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const docs = await response.json()
        setDocuments(docs)
      }
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDocumentClick = async (doc: DocumentFile) => {
    try {
      const response = await fetch(`/api/documents/${doc.id}`)
      if (response.ok) {
        const content = await response.text()
        setSelectedDocument({ ...doc, content })
      }
    } catch (error) {
      console.error('Failed to load document content:', error)
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

  // Apply PDF layout optimization when document is selected
  useEffect(() => {
    if (selectedDocument?.type === 'typst') {
      setTimeout(optimizePdfLayout, 1000)
    }
  }, [selectedDocument])

  const handleDownload = (doc: DocumentFile) => {
    const link = document.createElement('a')
    if (doc.type === 'typst') {
      // For Typst files, download the compiled PDF
      link.href = `/api/documents/${doc.id}/pdf/download`
      link.download = doc.name.replace('.typ', '.pdf')
    } else {
      // For other files, download the source file
      link.href = `/api/documents/${doc.id}/download`
      link.download = doc.name
    }
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString()
  }

  if (selectedDocument) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedDocument(null)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← {t('common.back')}
          </button>
          <button
            onClick={() => handleDownload(selectedDocument)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download size={16} />
            <span>{t('documents.download')}</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {selectedDocument.name}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <span className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{t('documents.last_modified')}: {formatDate(selectedDocument.lastModified)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <HardDrive size={14} />
              <span>{t('documents.file_size')}: {formatFileSize(selectedDocument.size)}</span>
            </span>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            {selectedDocument.type === 'markdown' ? (
              <div dangerouslySetInnerHTML={{ __html: selectedDocument.content || '' }} />
            ) : selectedDocument.type === 'typst' ? (
              <div className="typst-content">

                {/* PDF Viewer */}
                <div className="mb-6">
                  <iframe
                    src={`/api/documents/${selectedDocument.id}/pdf`}
                    className="w-full h-screen border border-gray-200 dark:border-gray-600 rounded-lg"
                    title="Typst PDF Preview"
                    style={{ minHeight: '600px' }}
                  />
                </div>

                {/* Source Code Viewer - 完整显示 */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                    <FileText size={16} />
                    <span>查看源码</span>
                  </summary>
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-600">
                    <code>{selectedDocument.content}</code>
                  </pre>
                </details>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                {selectedDocument.content}
              </pre>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-center space-x-2">
          <FileText className="text-blue-500" size={32} />
          <span>{t('documents.title')}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          {t('documents.subtitle')}
        </p>

      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('documents.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as 'all' | 'markdown' | 'typst')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t('documents.all')}</option>
            <option value="markdown">{t('documents.markdown')}</option>
            <option value="typst">{t('documents.typst')}</option>
          </select>
        </div>
      </div>

      {/* Document Stats */}
      {!loading && documents.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: language === 'zh' ? '总文档数' : 'Total Documents',
              value: documents.length,
              color: 'text-blue-600',
              bgColor: 'bg-blue-50 dark:bg-blue-900/20'
            },
            {
              label: language === 'zh' ? 'Typst 文档' : 'Typst Documents',
              value: documents.filter(d => d.type === 'typst').length,
              color: 'text-purple-600',
              bgColor: 'bg-purple-50 dark:bg-purple-900/20'
            },
            {
              label: language === 'zh' ? 'Markdown 文档' : 'Markdown Documents',
              value: documents.filter(d => d.type === 'markdown').length,
              color: 'text-green-600',
              bgColor: 'bg-green-50 dark:bg-green-900/20'
            },
            {
              label: language === 'zh' ? '总文件大小' : 'Total File Size',
              value: formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0)),
              color: 'text-orange-600',
              bgColor: 'bg-orange-50 dark:bg-orange-900/20'
            }
          ].map((stat) => (
            <div key={stat.label} className={`card text-center ${stat.bgColor}`}>
              <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-700 dark:text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Documents Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-600 dark:text-gray-400">{language === 'zh' ? '正在加载文档...' : 'Loading documents...'}</div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {documents.length === 0 ? t('documents.no_documents') : (language === 'zh' ? '没有找到匹配的文档' : 'No matching documents found')}
          </p>
          {documents.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {language === 'zh' ? '请将 .typ 或 .md 文件放入 documents 文件夹' : 'Please place .typ or .md files in the documents folder'}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText size={20} className="text-blue-600" />
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      doc.type === 'markdown'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {doc.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {doc.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{formatDate(doc.lastModified)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <HardDrive size={14} />
                    <span>{formatFileSize(doc.size)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDocumentClick(doc)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    {t('documents.view')}
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title={doc.type === 'typst' ? "下载PDF" : "下载源文件"}
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}