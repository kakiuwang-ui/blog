import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Edit, Code, TrendingUp, Calendar } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Article } from '../../../shared/types'

export default function Blog() {
  const [blogArticles, setBlogArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchBlogArticles()
  }, [])

  const fetchBlogArticles = async () => {
    try {
      const response = await fetch('/api/articles?category=blog')
      const result = await response.json()
      if (result.success) {
        setBlogArticles(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch blog articles:', error)
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

  // Categorize articles
  const lifeArticles = blogArticles.filter(article =>
    article.tags.some(tag =>
      ['生活', '日常', '感悟', '随想', '心情', '旅行', '美食', '摄影', '音乐', '电影'].includes(tag)
    ) ||
    article.title.includes('生活') ||
    article.title.includes('日常')
  )

  const techArticles = blogArticles.filter(article =>
    article.tags.some(tag =>
      ['技术', '编程', '代码', '前端', '后端', '算法', '数据结构', 'React', 'Vue', 'JavaScript', 'TypeScript'].includes(tag)
    ) ||
    article.title.includes('技术') ||
    article.title.includes('编程')
  )

  const recentArticles = [...blogArticles].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-center space-x-2">
          <BookOpen className="text-blue-500" size={32} />
          <span>{t('blog.center')}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('blog.center_subtitle')}
        </p>
      </div>

      {/* Blog Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Life Blog */}
        <Link to="/blog/life" className="group">
          <div className="card hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                <Edit className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {t('blog.life')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('blog.life_desc')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{lifeArticles.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('blog.articles')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {lifeArticles.reduce((sum, article) => sum + article.tags.length, 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('blog.tags')}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('blog.hot_tags')}</h3>
              <div className="flex flex-wrap gap-2">
                {['生活', '感悟', '日常', '心情'].map(tag => (
                  <span key={tag} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>

        {/* Tech Blog */}
        <Link to="/blog/tech" className="group">
          <div className="card hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <Code className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t('blog.tech')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('blog.tech_desc')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{techArticles.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('blog.articles')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {techArticles.reduce((sum, article) => sum + article.tags.length, 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('blog.tags')}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('blog.hot_tags')}</h3>
              <div className="flex flex-wrap gap-2">
                {['技术', '编程', '前端', 'React'].map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Recent Articles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <TrendingUp className="text-green-500" size={24} />
            <span>{t('blog.latest')}</span>
          </h2>
        </div>

        {recentArticles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('blog.no_articles')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <Link key={article.id} to={`/blog/${article.id}`} className="group">
                <div className="card hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={14} />
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {article.excerpt}
                    </p>

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
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Blog Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('blog.total_articles'), value: blogArticles.length, color: 'text-blue-600' },
          { label: t('blog.life_articles'), value: lifeArticles.length, color: 'text-green-600' },
          { label: t('blog.tech_articles'), value: techArticles.length, color: 'text-blue-600' },
          { label: t('blog.total_tags'), value: new Set(blogArticles.flatMap(a => a.tags)).size, color: 'text-purple-600' }
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className={`text-2xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-gray-700 dark:text-gray-300">{stat.label}</div>
          </div>
        ))}
      </section>
    </div>
  )
}