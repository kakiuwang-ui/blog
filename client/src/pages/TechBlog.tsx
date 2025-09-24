import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Tag, Search, Code } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Article } from '../../../shared/types'

export default function TechBlog() {
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
        // Filter for tech-related articles
        const techArticles = result.data.filter((article: Article) =>
          article.tags.some(tag =>
            ['技术', '编程', '代码', '前端', '后端', '算法', '数据结构', '框架', 'React', 'Vue', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'AI', '机器学习', '深度学习', '数据库', 'SQL', 'NoSQL', 'DevOps', '云计算', '微服务', '架构', '设计模式', '测试', '性能优化', '安全', '区块链', '开源'].includes(tag)
          ) ||
          article.title.includes('技术') ||
          article.title.includes('编程') ||
          article.title.includes('代码') ||
          article.category === 'skills'
        )
        setArticles(techArticles)
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
            <Code className="text-blue-500" size={32} />
            <span>{t('blog.tech')}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('blog.tech_desc')}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
            <input
              type="text"
              placeholder={t('blog.search_tech')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('blog.all_tags')}</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tech Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: '前端开发', color: 'bg-blue-500', count: articles.filter(a => a.tags.some(t => ['前端', 'React', 'Vue', 'JavaScript', 'TypeScript'].includes(t))).length },
          { name: '后端开发', color: 'bg-green-500', count: articles.filter(a => a.tags.some(t => ['后端', 'Node.js', 'Python', 'Java', 'Go'].includes(t))).length },
          { name: '算法与数据结构', color: 'bg-purple-500', count: articles.filter(a => a.tags.some(t => ['算法', '数据结构', 'LeetCode'].includes(t))).length },
          { name: '架构设计', color: 'bg-orange-500', count: articles.filter(a => a.tags.some(t => ['架构', '设计模式', '微服务'].includes(t))).length }
        ].map((category) => (
          <div key={category.name} className="card text-center">
            <div className={`w-8 h-8 ${category.color} rounded-full mx-auto mb-2`}></div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{category.name}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.count}</p>
          </div>
        ))}
      </div>

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Code className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500 dark:text-gray-400">
            {articles.length === 0 ? t('blog.no_tech') : t('blog.no_match')}
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
                    className="hover:text-blue-600 dark:hover:text-blue-400"
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
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
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
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
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