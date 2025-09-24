import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Tag, Search, Edit } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Article } from '../../../shared/types'

export default function LifeBlog() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const { t } = useLanguage()

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, selectedTag])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles?category=blog')
      const result = await response.json()
      if (result.success) {
        // Filter for life-related articles
        const lifeArticles = result.data.filter((article: Article) =>
          article.tags.some(tag =>
            ['生活', '日常', '感悟', '随想', '心情', '旅行', '美食', '摄影', '音乐', '电影'].includes(tag)
          ) ||
          article.title.includes('生活') ||
          article.title.includes('日常')
        )
        setArticles(lifeArticles)
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterArticles = () => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(article =>
        article.tags.includes(selectedTag)
      )
    }

    setFilteredArticles(filtered)
  }

  const getAllTags = () => {
    const tags = new Set<string>()
    articles.forEach(article => {
      article.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const allTags = getAllTags()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Edit className="text-green-500" size={32} />
            <span>{t('blog.life')}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('blog.life_desc')}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
            <input
              type="text"
              placeholder={t('blog.search_life')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">{t('blog.all_tags')}</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Edit className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500 dark:text-gray-400">
            {articles.length === 0 ? t('blog.no_life') : t('blog.no_match')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredArticles.map((article) => (
            <article key={article.id} className="card hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{article.author}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  <Link
                    to={`/blog/${article.id}`}
                    className="hover:text-green-600 dark:hover:text-green-400"
                  >
                    {article.title}
                  </Link>
                </h2>

                <p className="text-gray-600 dark:text-gray-300">
                  {article.excerpt}
                </p>

                {article.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Tag size={14} className="text-gray-400 dark:text-gray-500" />
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map(tag => (
                        <span
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs rounded cursor-pointer hover:bg-green-200 dark:hover:bg-green-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <Link
                    to={`/blog/${article.id}`}
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                  >
                    {t('blog.read_more')}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}