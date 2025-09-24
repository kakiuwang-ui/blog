import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Calendar, Eye } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Article } from '../../../shared/types'

export default function Videos() {
  const [videoArticles, setVideoArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchVideoArticles()
  }, [])

  const fetchVideoArticles = async () => {
    try {
      const response = await fetch('/api/articles?category=videos')
      const result = await response.json()
      if (result.success) {
        setVideoArticles(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch video articles:', error)
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
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('videos.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{t('videos.subtitle')}</p>
      </div>

      {videoArticles.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Play className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('videos.no_videos')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoArticles.map((article) => (
            <div key={article.id} className="card hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {article.images[0] ? (
                    <img
                      src={article.images[0]}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Play className="text-gray-400" size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <Play className="text-white opacity-0 hover:opacity-100 transition-opacity" size={32} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    <Link
                      to={`/blog/${article.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{t('videos.watch')}</span>
                    </div>
                  </div>

                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('videos.categories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: t('videos.tutorials'), count: videoArticles.filter(a => a.tags.includes(language === 'zh' ? '教程' : 'tutorial')).length },
            { name: t('videos.demos'), count: videoArticles.filter(a => a.tags.includes(language === 'zh' ? '演示' : 'demo')).length },
            { name: t('videos.sharing'), count: videoArticles.filter(a => a.tags.includes(language === 'zh' ? '分享' : 'sharing')).length },
            { name: t('videos.others'), count: videoArticles.filter(a => !a.tags.some(tag => (language === 'zh' ? ['教程', '演示', '分享'] : ['tutorial', 'demo', 'sharing']).includes(tag))).length }
          ].map((category) => (
            <div key={category.name} className="card text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {category.count}
              </div>
              <div className="text-gray-700 dark:text-gray-300">{category.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}