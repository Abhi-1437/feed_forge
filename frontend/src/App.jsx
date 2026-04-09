import { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedBackground from './components/layout/AnimatedBackground'
import Navbar from './components/layout/Navbar'
import AppSidebar from './components/layout/AppSidebar'
import Dashboard from './pages/DashboardPremium'
import Feeds from './pages/Feeds'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Folders from './pages/Folders'
import Login from './pages/Login'
import Register from './pages/Register'

const AUTH_PATHS = new Set(['/', '/login', '/register'])

function PageTransition({ children, pathname }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const isAuthRoute = useMemo(() => AUTH_PATHS.has(location.pathname), [location.pathname])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen">
        {isAuthRoute ? (
          <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <PageTransition pathname={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </PageTransition>
          </main>
        ) : (
          <div className="flex min-h-screen">
            <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex min-h-screen flex-1 flex-col lg:pl-80">
              <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
              <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                  <PageTransition pathname={location.pathname}>
                    <Routes location={location}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/feeds" element={<Feeds />} />
                      <Route path="/folders" element={<Folders />} />
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/articles/:articleId" element={<ArticleDetail />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </PageTransition>
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
