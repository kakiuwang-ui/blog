import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import { LanguageProvider } from './contexts/LanguageContext'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'))
const Blog = lazy(() => import('./pages/Blog'))
const LifeBlog = lazy(() => import('./pages/LifeBlog'))
const TechBlog = lazy(() => import('./pages/TechBlog'))
const Skills = lazy(() => import('./pages/Skills'))
const Videos = lazy(() => import('./pages/Videos'))
const Music = lazy(() => import('./pages/Music'))
const Resume = lazy(() => import('./pages/Resume'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Documents = lazy(() => import('./pages/Documents'))

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/life" element={<LifeBlog />} />
                <Route path="/blog/tech" element={<TechBlog />} />
                <Route path="/blog/:id" element={<ArticleDetail />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/music" element={<Music />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/documents" element={<Documents />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App