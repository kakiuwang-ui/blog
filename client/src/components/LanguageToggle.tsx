import { Languages } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium rounded-lg transition-all duration-200"
      title={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Languages size={16} className="flex-shrink-0" />
      <span className="ml-2 min-w-0">
        {language === 'zh' ? 'English' : '中文'}
      </span>
    </button>
  )
}