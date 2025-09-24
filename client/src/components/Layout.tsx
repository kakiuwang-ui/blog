import { ReactNode } from 'react'
import Navigation from './Navigation'
import MouseFollower from './MouseFollower'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <MouseFollower />
      <Navigation />
      <main className="lg:ml-64 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}