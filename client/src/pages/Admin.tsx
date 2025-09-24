import { useState } from 'react'
import ArticleEditor from '../components/ArticleEditor'
import ArticleList from '../components/ArticleList'
import { Plus, List } from 'lucide-react'

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'list' | 'editor'>('list')
  const [editingArticle, setEditingArticle] = useState<string | null>(null)

  const handleEditArticle = (articleId: string) => {
    setEditingArticle(articleId)
    setActiveTab('editor')
  }

  const handleNewArticle = () => {
    setEditingArticle(null)
    setActiveTab('editor')
  }

  const handleBackToList = () => {
    setActiveTab('list')
    setEditingArticle(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">内容管理</h1>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <List size={16} />
            <span>文章列表</span>
          </button>

          <button
            onClick={handleNewArticle}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'editor'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Plus size={16} />
            <span>写文章</span>
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <ArticleList onEditArticle={handleEditArticle} />
      ) : (
        <ArticleEditor
          articleId={editingArticle}
          onBack={handleBackToList}
        />
      )}
    </div>
  )
}