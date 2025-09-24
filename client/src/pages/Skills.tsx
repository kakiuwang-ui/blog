import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Code, Star, ExternalLink } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Article } from '../../../shared/types'

export default function Skills() {
  const [skillArticles, setSkillArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchSkillArticles()
  }, [])

  const fetchSkillArticles = async () => {
    try {
      const response = await fetch('/api/articles?category=skills')
      const result = await response.json()
      if (result.success) {
        setSkillArticles(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch skill articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const skillCategories = [
    {
      title: t('skills.frontend'),
      skills: ['React', 'TypeScript', 'Vue.js', 'Tailwind CSS', 'Next.js'],
      color: 'bg-blue-500'
    },
    {
      title: t('skills.backend'),
      skills: ['Node.js', 'Python', 'Express', 'FastAPI', 'PostgreSQL'],
      color: 'bg-green-500'
    },
    {
      title: t('skills.tools'),
      skills: ['Git', 'Docker', 'AWS', 'Vercel', 'GitHub Actions'],
      color: 'bg-purple-500'
    },
    {
      title: t('skills.other'),
      skills: ['Figma', 'Photoshop', 'Typst', language === 'zh' ? '技术写作' : 'Technical Writing', language === 'zh' ? '项目管理' : 'Project Management'],
      color: 'bg-orange-500'
    }
  ]

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('skills.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{t('skills.subtitle')}</p>
      </div>

      {/* Skills Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((category) => (
          <div key={category.title} className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Skill Articles */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('skills.articles')}</h2>
        </div>

        {skillArticles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <Code className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('skills.no_articles')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillArticles.map((article) => (
              <div key={article.id} className="card hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <Link
                      to={`/blog/${article.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/blog/${article.id}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Proficiency Levels */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('skills.proficiency')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { skill: 'React/TypeScript', level: 90 },
            { skill: 'Node.js/Express', level: 85 },
            { skill: 'Python', level: 80 },
            { skill: 'UI/UX Design', level: 75 },
            { skill: 'DevOps', level: 70 },
            { skill: 'Mobile Development', level: 65 }
          ].map(({ skill, level }) => (
            <div key={skill} className="card">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">{skill}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{level}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}