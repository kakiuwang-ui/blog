import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Music as MusicIcon, Play, Calendar, Heart } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Article } from '../../../shared/types'

export default function Music() {
  const [musicArticles, setMusicArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchMusicArticles()
  }, [])

  const fetchMusicArticles = async () => {
    try {
      const response = await fetch('/api/articles?category=music')
      const result = await response.json()
      if (result.success) {
        setMusicArticles(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch music articles:', error)
    } finally {
      setLoading(false)
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('music.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{t('music.subtitle')}</p>
      </div>

      {musicArticles.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <MusicIcon className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('music.no_music')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicArticles.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.id}`}
              className="card hover:shadow-md transition-shadow block cursor-pointer"
            >
              <div className="space-y-4">
                {/* Album Cover */}
                <div className="relative aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg overflow-hidden">
                  {article.images[0] ? (
                    <img
                      src={article.images[0]}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <MusicIcon className="text-white" size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <Play className="text-white opacity-0 hover:opacity-100 transition-opacity" size={32} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart size={14} />
                      <span>{t('music.favorite')}</span>
                    </div>
                  </div>

                  {/* Audio Player */}
                  {(article as any).musicFile && (
                    <div className="mt-4" onClick={(e) => e.preventDefault()}>
                      <audio
                        controls
                        className="w-full h-8 rounded"
                        preload="metadata"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <source src={`http://localhost:5001${(article as any).musicFile}`} type="audio/mp4" />
                        <source src={`http://localhost:5001${(article as any).musicFile}`} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Music Stats */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('music.stats')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('music.original'), value: musicArticles.filter(a => a.tags.includes(language === 'zh' ? '原创' : 'original')).length },
            { label: t('music.covers'), value: musicArticles.filter(a => a.tags.includes(language === 'zh' ? '翻唱' : 'cover')).length },
            { label: t('music.reviews'), value: musicArticles.filter(a => a.tags.includes(language === 'zh' ? '评论' : 'review')).length },
            { label: t('music.total'), value: musicArticles.length }
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-700 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Playlist */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('music.playlists')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: t('music.coding_music'),
              description: t('music.coding_music_desc'),
              count: 25,
              image: null
            },
            {
              title: t('music.original_works'),
              description: t('music.original_works_desc'),
              count: musicArticles.filter(a => a.tags.includes(language === 'zh' ? '原创' : 'original')).length,
              image: null
            }
          ].map((playlist) => (
            <div key={playlist.title} className="card">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <MusicIcon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{playlist.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{playlist.description}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{playlist.count}{t('music.songs')}</p>
                </div>
                <Play className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer" size={20} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}