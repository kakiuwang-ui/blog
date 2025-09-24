import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Image, Upload, X, Plus } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import type { Article, ArticleCategory, ImageUpload } from '../../../shared/types'

interface ArticleEditorProps {
  articleId?: string | null
  onBack: () => void
}

export default function ArticleEditor({ articleId, onBack }: ArticleEditorProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [article, setArticle] = useState<Partial<Article>>({
    title: '',
    content: '',
    category: 'blog',
    tags: [],
    author: 'Admin',
    excerpt: '',
    images: []
  })
  const [newTag, setNewTag] = useState('')
  const [uploadedImages, setUploadedImages] = useState<ImageUpload[]>([])
  const [typstFile, setTypstFile] = useState<File | null>(null)

  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId)
    }
  }, [articleId])

  const fetchArticle = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/articles/${id}`)
      const result = await response.json()

      if (result.success) {
        setArticle(result.data)
        // Load existing images for preview
        const imageUploads = result.data.images.map((url: string) => ({
          file: null,
          preview: url
        }))
        setUploadedImages(imageUploads)
      }
    } catch (error) {
      console.error('Failed to fetch article:', error)
    } finally {
      setLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    onDrop: handleImageDrop
  })

  async function handleImageDrop(acceptedFiles: File[]) {
    for (const file of acceptedFiles) {
      const preview = URL.createObjectURL(file)
      const newImage: ImageUpload = { file, preview }
      setUploadedImages(prev => [...prev, newImage])

      // Upload image immediately
      try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (result.success) {
          // Update the image with the server URL
          setUploadedImages(prev =>
            prev.map(img =>
              img.preview === preview
                ? { ...img, preview: result.url }
                : img
            )
          )

          // Add to article images
          setArticle(prev => ({
            ...prev,
            images: [...(prev.images || []), result.url]
          }))
        }
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (!file) continue

        const preview = URL.createObjectURL(file)
        const newImage: ImageUpload = { file, preview }
        setUploadedImages(prev => [...prev, newImage])

        // Convert to base64 and upload
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const response = await fetch('/api/upload/paste', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                imageData: reader.result
              })
            })

            const result = await response.json()

            if (result.success) {
              setUploadedImages(prev =>
                prev.map(img =>
                  img.preview === preview
                    ? { ...img, preview: result.url }
                    : img
                )
              )

              setArticle(prev => ({
                ...prev,
                images: [...(prev.images || []), result.url]
              }))
            }
          } catch (error) {
            console.error('Failed to upload pasted image:', error)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const removeImage = (index: number) => {
    const imageToRemove = uploadedImages[index]
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    setArticle(prev => ({
      ...prev,
      images: prev.images?.filter(url => url !== imageToRemove.preview) || []
    }))
  }

  const handleTypstUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('document', file)

      const response = await fetch('/api/upload/typst', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setArticle(prev => ({
          ...prev,
          typstDocument: result.url,
          typstPdf: result.pdfUrl
        }))
        setTypstFile(file)
      }
    } catch (error) {
      console.error('Failed to upload Typst document:', error)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !article.tags?.includes(newTag.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleSave = async () => {
    if (!article.title || !article.content) {
      alert('请填写标题和内容')
      return
    }

    setSaving(true)
    try {
      const url = articleId ? `/api/articles/${articleId}` : '/api/articles'
      const method = articleId ? 'PUT' : 'POST'

      const articleData = {
        ...article,
        excerpt: article.excerpt || article.content.substring(0, 200) + '...'
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
      })

      const result = await response.json()

      if (result.success) {
        alert(articleId ? '文章更新成功' : '文章创建成功')
        onBack()
      } else {
        alert('保存失败：' + result.error)
      }
    } catch (error) {
      console.error('Failed to save article:', error)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft size={16} />
          <span>返回列表</span>
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center space-x-2"
        >
          <Save size={16} />
          <span>{saving ? '保存中...' : '保存文章'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              文章标题
            </label>
            <input
              type="text"
              value={article.title || ''}
              onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入文章标题..."
            />
          </div>

          {/* Content */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              文章内容 (支持 Markdown)
            </label>
            <textarea
              value={article.content || ''}
              onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
              onPaste={handlePaste}
              className="w-full h-96 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="输入文章内容，支持 Markdown 格式。可以直接粘贴图片..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              💡 提示：可以直接在此处粘贴图片 (Ctrl+V)
            </p>
          </div>

          {/* Images */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              文章图片
            </label>

            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Image className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-gray-600">
                {isDragActive ? '释放以上传图片' : '拖拽图片到此处或点击选择'}
              </p>
            </div>

            {/* Image Previews */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <select
              value={article.category || 'blog'}
              onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value as ArticleCategory }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="blog">博客</option>
              <option value="skills">技能</option>
              <option value="videos">视频</option>
              <option value="music">音乐</option>
              <option value="resume">简历</option>
            </select>
          </div>

          {/* Tags */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签
            </label>

            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="添加标签..."
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {article.tags?.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Typst Upload */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Typst 文档
            </label>

            <input
              type="file"
              accept=".typ,.typst"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleTypstUpload(file)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {(typstFile || article.typstDocument) && (
              <div className="mt-2 p-2 bg-gray-50 rounded flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {typstFile?.name || 'Typst 文档'}
                </span>
                {article.typstDocument && (
                  <a
                    href={article.typstDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Upload size={16} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Author */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              作者
            </label>
            <input
              type="text"
              value={article.author || ''}
              onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="作者名称..."
            />
          </div>

          {/* Excerpt */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              摘要 (可选)
            </label>
            <textarea
              value={article.excerpt || ''}
              onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="文章摘要，留空将自动生成..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}