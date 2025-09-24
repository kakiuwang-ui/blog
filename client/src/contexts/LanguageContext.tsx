import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'zh' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations = {
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.blog': '博客',
    'nav.skills': '技能',
    'nav.videos': '视频',
    'nav.music': '音乐',
    'nav.documents': '文档',
    'nav.resume': '简历',
    'nav.personal_blog': 'Rusty Raven的博客',

    // Home page
    'home.welcome': '欢迎来到Rusty Raven的博客',
    'home.subtitle': '分享技术见解、创意项目和生活感悟',
    'home.latest_articles': '所有文章',
    'home.view_all': '博客分类 →',
    'home.no_articles': '暂无文章',
    'home.coming_soon': '敬请期待精彩内容...',

    // Blog page
    'blog.title': '博客文章',
    'blog.center': '博客中心',
    'blog.center_subtitle': '记录生活，分享技术，留下思考的轨迹',
    'blog.life': '生活日志',
    'blog.life_desc': '记录生活点滴，分享心情感悟',
    'blog.tech': '技术博客',
    'blog.tech_desc': '分享技术心得，记录成长历程',
    'blog.articles': '篇文章',
    'blog.tags': '个标签',
    'blog.hot_tags': '热门标签：',
    'blog.latest': '最新文章',
    'blog.stats': '博客统计',
    'blog.total_articles': '总文章数',
    'blog.life_articles': '生活文章',
    'blog.tech_articles': '技术文章',
    'blog.total_tags': '标签总数',
    'blog.search_placeholder': '搜索文章...',
    'blog.search_life': '搜索生活记录...',
    'blog.search_tech': '搜索技术文章...',
    'blog.filter_by_tag': '按标签筛选',
    'blog.all_tags': '所有标签',
    'blog.no_articles': '暂无博客文章',
    'blog.no_life': '暂无生活博客',
    'blog.no_tech': '暂无技术博客',
    'blog.no_match': '没有找到匹配的文章',
    'blog.back_to_blog': '返回博客',
    'blog.back_to_list': '返回博客列表',
    'blog.read_more': '阅读全文 →',

    // Skills page
    'skills.title': '技能展示',
    'skills.subtitle': '我的技术栈和专业技能',
    'skills.frontend': '前端开发',
    'skills.backend': '后端开发',
    'skills.tools': '工具与部署',
    'skills.other': '其他技能',
    'skills.articles': '技术文章',
    'skills.no_articles': '暂无技术文章',
    'skills.proficiency': '技能熟练度',

    // Videos page
    'videos.title': '视频内容',
    'videos.subtitle': '技术教程、演示和其他视频内容',
    'videos.no_videos': '暂无视频内容',
    'videos.categories': '视频分类',
    'videos.tutorials': '技术教程',
    'videos.demos': '项目演示',
    'videos.sharing': '技术分享',
    'videos.others': '其他视频',
    'videos.watch': '观看',

    // Music page
    'music.title': '音乐作品',
    'music.subtitle': '我的音乐创作、分享和音乐相关内容',
    'music.no_music': '暂无音乐内容',
    'music.stats': '音乐统计',
    'music.original': '原创作品',
    'music.covers': '翻唱作品',
    'music.reviews': '音乐评论',
    'music.total': '总作品数',
    'music.playlists': '精选歌单',
    'music.coding_music': '编程时听的音乐',
    'music.coding_music_desc': '适合专注工作的轻音乐合集',
    'music.original_works': '我的原创作品',
    'music.original_works_desc': '个人音乐创作合集',
    'music.songs': '首歌曲',
    'music.favorite': '收藏',

    // Resume page
    'resume.title': '个人简历',
    'resume.download_pdf': '下载PDF简历',
    'resume.experience': '工作经历',
    'resume.education': '教育背景',
    'resume.achievements': '主要成就',
    'resume.documents': '简历相关文档',
    'resume.no_documents': '暂无简历文档',
    'resume.view_details': '查看详情 →',

    // Documents page
    'documents.title': '文档中心',
    'documents.subtitle': '浏览和查看各种文档，支持 Markdown 和 Typst 格式',
    'documents.no_documents': '暂无文档',
    'documents.categories': '文档分类',
    'documents.all': '全部文档',
    'documents.markdown': 'Markdown 文档',
    'documents.typst': 'Typst 文档',
    'documents.search_placeholder': '搜索文档...',
    'documents.last_modified': '最后修改',
    'documents.file_size': '文件大小',
    'documents.view': '查看',
    'documents.download': '下载',

    // Common
    'common.loading': '加载中...',
    'common.author': '作者',
    'common.date': '日期',
    'common.tags': '标签',
    'common.category': '分类',
    'common.read_more': '阅读更多',
    'common.view_details': '查看详情',
    'common.download': '下载',
    'common.back': '返回',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.search': '搜索',
    'common.filter': '筛选',

    // Article categories
    'category.all': '全部',
    'category.blog': '博客',
    'category.skills': '技能',
    'category.videos': '视频',
    'category.music': '音乐',
    'category.resume': '简历',

    // Owner name
    'owner.name': 'Rusty Raven',
    'owner.title': '全栈开发工程师',
    'owner.email': 'rusty.raven@example.com',
    'owner.phone': '+1 555-0123',
    'owner.location': 'San Francisco, CA',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.skills': 'Skills',
    'nav.videos': 'Videos',
    'nav.music': 'Music',
    'nav.documents': 'Documents',
    'nav.resume': 'Resume',
    'nav.personal_blog': "Rusty Raven's Blog",

    // Home page
    'home.welcome': 'Welcome to My Personal Blog',
    'home.subtitle': 'Sharing technical insights, creative projects, and life reflections',
    'home.latest_articles': 'All Articles',
    'home.view_all': 'Blog Categories →',
    'home.no_articles': 'No articles yet',
    'home.coming_soon': 'Stay tuned for amazing content...',

    // Blog page
    'blog.title': 'Blog Articles',
    'blog.center': 'Blog Center',
    'blog.center_subtitle': 'Recording life, sharing technology, leaving traces of thoughts',
    'blog.life': 'Life Blog',
    'blog.life_desc': 'Recording daily life and sharing personal insights',
    'blog.tech': 'Tech Blog',
    'blog.tech_desc': 'Sharing technical insights and growth journey',
    'blog.articles': ' articles',
    'blog.tags': ' tags',
    'blog.hot_tags': 'Popular tags:',
    'blog.latest': 'Latest Articles',
    'blog.stats': 'Blog Statistics',
    'blog.total_articles': 'Total Articles',
    'blog.life_articles': 'Life Articles',
    'blog.tech_articles': 'Tech Articles',
    'blog.total_tags': 'Total Tags',
    'blog.search_placeholder': 'Search articles...',
    'blog.search_life': 'Search life records...',
    'blog.search_tech': 'Search tech articles...',
    'blog.filter_by_tag': 'Filter by tag',
    'blog.all_tags': 'All tags',
    'blog.no_articles': 'No blog articles yet',
    'blog.no_life': 'No life blog yet',
    'blog.no_tech': 'No tech blog yet',
    'blog.no_match': 'No matching articles found',
    'blog.back_to_blog': 'Back to Blog',
    'blog.back_to_list': 'Back to Article List',
    'blog.read_more': 'Read More →',

    // Skills page
    'skills.title': 'Skills Showcase',
    'skills.subtitle': 'My technology stack and professional skills',
    'skills.frontend': 'Frontend Development',
    'skills.backend': 'Backend Development',
    'skills.tools': 'Tools & Deployment',
    'skills.other': 'Other Skills',
    'skills.articles': 'Technical Articles',
    'skills.no_articles': 'No technical articles yet',
    'skills.proficiency': 'Skill Proficiency',

    // Videos page
    'videos.title': 'Video Content',
    'videos.subtitle': 'Tutorials, demos, and other video content',
    'videos.no_videos': 'No video content yet',
    'videos.categories': 'Video Categories',
    'videos.tutorials': 'Tutorials',
    'videos.demos': 'Project Demos',
    'videos.sharing': 'Tech Sharing',
    'videos.others': 'Other Videos',
    'videos.watch': 'Watch',

    // Music page
    'music.title': 'Musical Works',
    'music.subtitle': 'My music creations, shares, and music-related content',
    'music.no_music': 'No music content yet',
    'music.stats': 'Music Statistics',
    'music.original': 'Original Works',
    'music.covers': 'Cover Songs',
    'music.reviews': 'Music Reviews',
    'music.total': 'Total Works',
    'music.playlists': 'Featured Playlists',
    'music.coding_music': 'Coding Music',
    'music.coding_music_desc': 'Ambient music collection for focused work',
    'music.original_works': 'My Original Works',
    'music.original_works_desc': 'Personal music creation collection',
    'music.songs': ' songs',
    'music.favorite': 'Favorite',

    // Resume page
    'resume.title': 'Resume',
    'resume.download_pdf': 'Download PDF Resume',
    'resume.experience': 'Work Experience',
    'resume.education': 'Education',
    'resume.achievements': 'Key Achievements',
    'resume.documents': 'Resume Documents',
    'resume.no_documents': 'No resume documents yet',
    'resume.view_details': 'View Details →',

    // Documents page
    'documents.title': 'Document Center',
    'documents.subtitle': 'Browse and view various documents supporting Markdown and Typst formats',
    'documents.no_documents': 'No documents available',
    'documents.categories': 'Document Categories',
    'documents.all': 'All Documents',
    'documents.markdown': 'Markdown Documents',
    'documents.typst': 'Typst Documents',
    'documents.search_placeholder': 'Search documents...',
    'documents.last_modified': 'Last Modified',
    'documents.file_size': 'File Size',
    'documents.view': 'View',
    'documents.download': 'Download',

    // Common
    'common.loading': 'Loading...',
    'common.author': 'Author',
    'common.date': 'Date',
    'common.tags': 'Tags',
    'common.category': 'Category',
    'common.read_more': 'Read More',
    'common.view_details': 'View Details',
    'common.download': 'Download',
    'common.back': 'Back',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search',
    'common.filter': 'Filter',

    // Article categories
    'category.all': 'All',
    'category.blog': 'Blog',
    'category.skills': 'Skills',
    'category.videos': 'Videos',
    'category.music': 'Music',
    'category.resume': 'Resume',

    // Owner name
    'owner.name': 'Rusty Raven',
    'owner.title': 'Full-Stack Developer',
    'owner.email': 'rusty.raven@example.com',
    'owner.phone': '+1 555-0123',
    'owner.location': 'San Francisco, CA',
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved as Language) || 'zh'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  useEffect(() => {
    document.documentElement.lang = language
    // Add language-specific class to body for font optimization
    document.body.className = document.body.className.replace(/\blang-(zh|en)\b/g, '')
    document.body.classList.add(`lang-${language}`)
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}