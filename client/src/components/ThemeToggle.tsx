import { Sun, Moon, Monitor } from 'lucide-react'
import { useThemeContext } from './ThemeProvider'
import { useLanguage } from '../contexts/LanguageContext'
import { Theme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeContext()

  const themes: { value: Theme; label: string; icon: JSX.Element }[] = [
    { value: 'light', label: '浅色', icon: <Sun size={16} /> },
    { value: 'dark', label: '深色', icon: <Moon size={16} /> },
    { value: 'system', label: '系统', icon: <Monitor size={16} /> }
  ]

  return (
    <div className="relative">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        {themes.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        {themes.find(t => t.value === theme)?.icon}
      </div>
    </div>
  )
}

// Alternative: Button-based theme toggle for simpler switching between light/dark
export function SimpleThemeToggle() {
  const { resolvedTheme, setTheme } = useThemeContext()
  const { language } = useLanguage()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  const getThemeText = () => {
    if (language === 'zh') {
      return resolvedTheme === 'light' ? '深色模式' : '浅色模式'
    } else {
      return resolvedTheme === 'light' ? 'Dark Mode' : 'Light Mode'
    }
  }

  const getTitle = () => {
    if (language === 'zh') {
      return `切换到${resolvedTheme === 'light' ? '深色' : '浅色'}模式`
    } else {
      return `Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium rounded-lg transition-all duration-200"
      title={getTitle()}
    >
      {resolvedTheme === 'light' ? (
        <Moon size={16} className="flex-shrink-0" />
      ) : (
        <Sun size={16} className="flex-shrink-0" />
      )}
      <span className="ml-2 min-w-0">
        {getThemeText()}
      </span>
    </button>
  )
}