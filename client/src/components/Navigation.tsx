import { useState, useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Code, Video, Music, User, FileText, Menu, X, ChevronDown, Edit } from 'lucide-react'
import { SimpleThemeToggle } from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from '../contexts/LanguageContext'

export default function Navigation() {
  const location = useLocation()
  const { t, language } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false)

  const navItems = useMemo(() => [
    { path: '/', label: t('nav.home'), icon: Home },
    {
      path: '/blog',
      label: t('nav.blog'),
      icon: BookOpen,
      hasSubmenu: true,
      submenu: [
        { path: '/blog', label: language === 'zh' ? '所有博客' : 'All Blogs' },
        { path: '/blog/life', label: language === 'zh' ? '生活日志' : 'Life Blog', icon: Edit },
        { path: '/blog/tech', label: language === 'zh' ? '技术博客' : 'Tech Blog', icon: Code },
        { path: '/documents', label: t('nav.documents'), icon: FileText },
      ]
    },
    { path: '/skills', label: t('nav.skills'), icon: Code },
    { path: '/videos', label: t('nav.videos'), icon: Video },
    { path: '/music', label: t('nav.music'), icon: Music },
    { path: '/resume', label: t('nav.resume'), icon: User },
  ], [t, language])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }, [isMobileMenuOpen])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-[100] p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
      >
        {isMobileMenuOpen ? (
          <X size={20} className="text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu size={20} className="text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[90]"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <nav className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-y-auto z-[95] ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          {/* Logo/Brand */}
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            {t('nav.personal_blog')}
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 mb-8">
            {navItems.map((item) => {
              const { path, label, icon: Icon, hasSubmenu, submenu } = item
              const isActive = location.pathname === path || (hasSubmenu && submenu?.some(sub => location.pathname === sub.path))

              if (hasSubmenu) {
                return (
                  <div key={path} className="space-y-1">
                    <button
                      onClick={() => setIsBlogMenuOpen(!isBlogMenuOpen)}
                      className={`nav-link flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon size={18} className="flex-shrink-0" />
                        <span className="ml-3 min-w-0 flex-1">{label}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isBlogMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isBlogMenuOpen && (
                      <div className="ml-4 space-y-1">
                        {submenu?.map((subItem) => {
                          const SubIcon = subItem.icon
                          const isSubActive = location.pathname === subItem.path
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={closeMobileMenu}
                              className={`nav-link flex items-center px-4 py-2 rounded-lg text-sm transition-colors w-full ${
                                isSubActive
                                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {SubIcon ? <SubIcon size={16} className="flex-shrink-0" /> : <div className="w-4"></div>}
                              <span className="ml-3 min-w-0 flex-1">{subItem.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMobileMenu}
                  className={`nav-link flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="ml-3 min-w-0 flex-1">{label}</span>
                </Link>
              )
            })}
          </div>

          {/* Controls */}
          <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <LanguageToggle />
            <SimpleThemeToggle />
          </div>
        </div>
      </nav>
    </>
  )
}