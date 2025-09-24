import { useEffect, useState } from 'react'
import { Calendar, User, Tag, Edit, Trash2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Article, ArticleCategory } from '../../../shared/types'

interface ArticleListProps {
  onEditArticle: (articleId: string) => void
}

export default function ArticleList({ onEditArticle }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all')

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory])

  const fetchArticles = async () => {
    try {
      const url = selectedCategory === 'all'
        ? '/api/articles'
        : `/api/articles?category=${selectedCategory}`

      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setArticles(result.data.sort((a: Article, b: Article) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ))
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setArticles(articles.filter(article => article.id !== articleId))
      } else {
        alert('删除失败：' + result.error)
      }
    } catch (error) {
      console.error('Failed to delete article:', error)
      alert('删除失败')
    }
  }

  const categories = [
    { value: 'all' as const, label: '全部' },
    { value: 'blog' as const, label: '博客' },
    { value: 'skills' as const, label: '技能' },
    { value: 'videos' as const, label: '视频' },
    { value: 'music' as const, label: '音乐' },
    { value: 'resume' as const, label: '简历' }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      {articles.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    分类
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    标签
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {article.excerpt}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
                          <User size={12} />
                          <span>{article.author}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="inline-flex px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">+{article.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={12} />
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/blog/${article.id}`}
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                          title="查看"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => onEditArticle(article.id)}
                          className="text-blue-600 hover:text-blue-700"
                          title="编辑"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-red-600 hover:text-red-700"
                          title="删除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}