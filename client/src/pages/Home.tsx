import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Tag } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Article } from '../../../shared/types'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchLatestArticles()
  }, [])

  const fetchLatestArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      const result = await response.json()
      if (result.success) {
        // Get all articles
        setArticles(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
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
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('home.welcome')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </section>

      {/* All Articles */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('home.latest_articles')}</h2>
          <Link
            to="/blog"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            {t('home.view_all')}
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">{t('home.no_articles')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {t('home.coming_soon')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/blog/${article.id}`}
                className="block"
              >
                <article className="card card-interactive h-full cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={14} />
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <User size={14} />
                        <span>{article.author}</span>
                      </div>

                      {article.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Tag size={12} className="text-gray-400 dark:text-gray-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {article.tags[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}