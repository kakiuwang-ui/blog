import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

export default function SecretAdmin() {
  const [isVisible, setIsVisible] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const navigate = useNavigate()

  // 隐秘访问逻辑：连续快速点击网站标题5次
  useEffect(() => {
    const resetTimeout = setTimeout(() => {
      setClickCount(0)
    }, 3000) // 3秒内要完成所有点击

    return () => clearTimeout(resetTimeout)
  }, [clickCount])

  const handleSecretClick = () => {
    const now = Date.now()
    const timeDiff = now - lastClickTime

    if (timeDiff < 500) { // 500ms内的快速点击
      setClickCount(prev => prev + 1)

      if (clickCount >= 4) { // 连续5次快速点击
        setIsVisible(true)
        setTimeout(() => {
          navigate('/admin')
        }, 1000)
      }
    } else {
      setClickCount(1) // 重新开始计数
    }

    setLastClickTime(now)
  }

  return (
    <>
      {/* 隐藏的管理入口 - 点击网站标题触发 */}
      <span
        onClick={handleSecretClick}
        className="cursor-pointer select-none"
        title={clickCount > 0 ? `${clickCount}/5` : ''}
      >
        Rusty Raven's Blog
      </span>

      {/* 隐秘访问提示 */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                管理员模式激活
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              正在跳转到管理面板...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// 键盘隐秘访问组件
export function KeyboardSecretAccess() {
  const navigate = useNavigate()
  const [keys, setKeys] = useState<string[]>([])
  const secretCode = ['KeyA', 'KeyD', 'KeyM', 'KeyI', 'KeyN'] // "ADMIN"

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只在按住Ctrl+Shift时才记录按键
      if (event.ctrlKey && event.shiftKey) {
        const newKeys = [...keys, event.code].slice(-5) // 只保留最后5个按键
        setKeys(newKeys)

        // 检查是否匹配隐秘代码
        if (newKeys.length === 5 && newKeys.every((key, index) => key === secretCode[index])) {
          navigate('/admin')
          setKeys([]) // 重置
        }
      } else {
        setKeys([]) // 重置按键序列
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keys, navigate])

  return null // 这个组件不渲染任何内容
}