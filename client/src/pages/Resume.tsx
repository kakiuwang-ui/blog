import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Article } from '../../../shared/types'

export default function Resume() {
  const [resumeArticles, setResumeArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchResumeArticles()
  }, [])

  const fetchResumeArticles = async () => {
    try {
      const response = await fetch('/api/articles?category=resume')
      const result = await response.json()
      if (result.success) {
        setResumeArticles(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch resume articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const personalInfo = {
    name: language === 'zh' ? '汪嘉桥' : 'Jiaqiao Wang',
    title: language === 'zh' ? '全栈开发工程师 | 计算机科学学生' : 'Full-stack Developer | Computer Science Student',
    email: 'kakiuwang@gmail.com',
    phone: '+86 13822790423',
    location: language === 'zh' ? '中国武汉' : 'Wuhan, China',
    github: 'https://github.com/kakiuwang-ui',
    avatar: null
  }

  const experiences = [
    {
      company: language === 'zh' ? '个人项目开发' : 'Personal Projects',
      position: language === 'zh' ? '全栈开发工程师' : 'Full-stack Developer',
      period: '2025.03 - ' + (language === 'zh' ? '至今' : 'Present'),
      description: language === 'zh' ? '独立开发多个完整项目，包括个人博客系统、LED显示器色彩优化系统等，涵盖前端开发、后端架构、算法设计等技术领域。' : 'Independently developed multiple complete projects including personal blog system, LED display color optimization system, covering frontend development, backend architecture, and algorithm design.',
      technologies: ['React', 'TypeScript', 'Node.js', 'Python', 'C/C++']
    }
  ]

  const education = [
    {
      school: language === 'zh' ? '中国地质大学（武汉）' : 'China University of Geosciences (Wuhan)',
      degree: language === 'zh' ? '工学学士 - 智能科学与技术' : 'Bachelor of Engineering - Intelligent Science and Technology',
      period: '2024.09 - 2027.06',
      description: language === 'zh' ? '计算机学院，主修课程：高等数学、数据结构与算法、计算机组成原理、计算机网络、计算机视觉、机器学习。2027年应届毕业生' : 'Computer College. Major courses: Advanced Mathematics, Data Structures & Algorithms, Computer Architecture, Computer Networks, Computer Vision, Machine Learning. Expected graduation in 2027.'
    }
  ]

  const achievements = [
    language === 'zh' ? '2025年"深圳杯"数学建模挑战赛决赛优秀论文 - LED显示器色彩优化系统' : '2025 "Shenzhen Cup" Mathematical Modeling Challenge Final Excellent Paper - LED Display Color Optimization System',
    language === 'zh' ? '2025年全国大学生英语作文大赛省级二等奖' : '2025 National College English Writing Competition Provincial Second Prize',
    language === 'zh' ? '2025年全国大学生统计建模大赛校级一等奖 - 音频特征工程自适应编码系统' : '2025 National College Statistical Modeling Competition School First Prize - Audio Feature Engineering Adaptive Coding System',
    language === 'zh' ? '2024年中国地质大学科技论文报告会校级三等奖' : '2024 China University of Geosciences Science and Technology Paper Report Third Prize',
    language === 'zh' ? '2024年入选中国地质大学大学英语ESS实验班' : '2024 Selected for CUG English ESS Experimental Class'
  ]

  const projects = [
    {
      title: language === 'zh' ? '个人博客系统 (Rusty Raven\'s Blog)' : 'Personal Blog System (Rusty Raven\'s Blog)',
      period: '2025.09 - ' + (language === 'zh' ? '至今' : 'Present'),
      description: language === 'zh' ? '基于React + TypeScript + Node.js构建的现代化个人博客系统，实现Typst文档渲染、音频播放、多语言支持、暗黑模式等功能。' : 'Modern personal blog system built with React + TypeScript + Node.js, featuring Typst document rendering, audio playback, multi-language support, dark mode, etc.',
      technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'Express', 'File Upload']
    },
    {
      title: language === 'zh' ? 'LED显示器色彩优化系统' : 'LED Display Color Optimization System',
      period: '2025.06 - 2025.08',
      description: language === 'zh' ? '构建基于BT2020色域映射的全链路LED显示器色彩优化系统，获深圳杯数学建模竞赛决赛优秀论文。实现多通道增强和像素校正算法，根据使用环境自动匹配最优色彩校正方案。' : 'Built a full-chain LED display color optimization system based on BT2020 color gamut mapping, won excellent paper in Shenzhen Cup Mathematical Modeling Competition. Implemented multi-channel enhancement and pixel correction algorithms.',
      technologies: ['Color Space Conversion', 'Image Processing', 'Algorithm Optimization']
    },
    {
      title: language === 'zh' ? '音频特征工程自适应编码系统' : 'Audio Feature Engineering Adaptive Coding System',
      period: '2025.03 - 2025.04',
      description: language === 'zh' ? '基于音频特征工程实现自适应编码系统，获全国统计建模大赛校级一等奖。通过音频信号特征提取结合机器学习算法，实现高效音频编码和压缩。' : 'Implemented adaptive coding system based on audio feature engineering, won first prize in National Statistical Modeling Competition. Achieved efficient audio encoding and compression through signal feature extraction and ML algorithms.',
      technologies: ['Signal Processing', 'Machine Learning', 'Feature Engineering', 'Audio Compression']
    }
  ]


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }


  const resumeDocument = resumeArticles.find(article => article.typstDocument)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('resume.title')}</h1>
        {resumeDocument && (
          <div className="flex justify-center space-x-4">
            <a
              href={resumeDocument.typstDocument}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Download size={16} />
              <span>{t('resume.download_pdf')}</span>
            </a>
          </div>
        )}
      </div>

      {/* Personal Info */}
      <section className="card">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            {personalInfo.avatar ? (
              <img
                src={personalInfo.avatar}
                alt={personalInfo.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {personalInfo.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{personalInfo.name}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">{personalInfo.title}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail size={14} />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={14} />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={14} />
                <span>{personalInfo.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section className="card">
        <div className="flex items-center space-x-2 mb-6">
          <Briefcase className="text-blue-600" size={20} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('resume.experience')}</h3>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="border-l-2 border-blue-200 pl-6 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{exp.position}</h4>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>{exp.period}</span>
                  </div>
                </div>

                <p className="font-medium text-blue-600">{exp.company}</p>
                <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {exp.technologies.map(tech => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="card">
        <div className="flex items-center space-x-2 mb-6">
          <GraduationCap className="text-blue-600" size={20} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('resume.education')}</h3>
        </div>

        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="border-l-2 border-blue-200 pl-6 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{edu.degree}</h4>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>{edu.period}</span>
                  </div>
                </div>

                <p className="font-medium text-blue-600">{edu.school}</p>
                <p className="text-gray-600 dark:text-gray-300">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="card">
        <div className="flex items-center space-x-2 mb-6">
          <Briefcase className="text-blue-600" size={20} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{language === 'zh' ? '项目经历' : 'Projects'}</h3>
        </div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="border-l-2 border-green-200 pl-6 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-green-500 rounded-full"></div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{project.title}</h4>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>{project.period}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300">{project.description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {project.technologies.map(tech => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="card">
        <div className="flex items-center space-x-2 mb-6">
          <Award className="text-blue-600" size={20} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('resume.achievements')}</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 dark:text-gray-300">{achievement}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Resume Articles */}
      {resumeArticles.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('resume.documents')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumeArticles.map((article) => (
              <div key={article.id} className="card">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{article.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{article.excerpt}</p>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/blog/${article.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {t('resume.view_details')}
                  </Link>

                  {article.typstDocument && (
                    <a
                      href={article.typstDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Download size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {resumeArticles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('resume.no_documents')}</p>
        </div>
      )}
    </div>
  )
}