interface LoadingSpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({
  text = '加载中...',
  size = 'md',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}></div>
      {text && (
        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  )
}