'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from './sidebar'
import { TopBar } from './topbar'
import { DashboardPage } from '@/pages/dashboard'

export type PageKey =
  | 'dashboard' | 'classrooms' | 'users' | 'teachers' | 'students' | 'mystudents'
  | 'ce4messenger' | 'examsystem' | 'placementtest' | 'teachereval' | 'dailyperf'
  | 'automessaging' | 'marketing' | 'videoeditor' | 'reports' | 'anticheat'
  | 'subscriptions' | 'liveanalytics' | 'homework' | 'chat' | 'meetlive'
  | 'videoarchive' | 'examroom' | 'aidev' | 'settings'

// Lazy load pages for better initial performance
const ClassroomsPage = dynamic(() => import('@/pages/classrooms').then(mod => ({ default: mod.ClassroomsPage })), {
  loading: () => <LoadingFallback />
})
const MessengerPage = dynamic(() => import('@/pages/messenger').then(mod => ({ default: mod.MessengerPage })), {
  loading: () => <LoadingFallback />
})
const ExamSystemPage = dynamic(() => import('@/pages/exam-system').then(mod => ({ default: mod.ExamSystemPage })), {
  loading: () => <LoadingFallback />
})
const PlacementsPage = dynamic(() => import('@/pages/placements').then(mod => ({ default: mod.PlacementsPage })), {
  loading: () => <LoadingFallback />
})
const TeacherEvalPage = dynamic(() => import('@/pages/teacher-eval').then(mod => ({ default: mod.TeacherEvalPage })), {
  loading: () => <LoadingFallback />
})
const DailyPerfPage = dynamic(() => import('@/pages/daily-perf').then(mod => ({ default: mod.DailyPerfPage })), {
  loading: () => <LoadingFallback />
})
const HomeworkPage = dynamic(() => import('@/pages/homework').then(mod => ({ default: mod.HomeworkPage })), {
  loading: () => <LoadingFallback />
})
const VideoArchivePage = dynamic(() => import('@/pages/video-archive').then(mod => ({ default: mod.VideoArchivePage })), {
  loading: () => <LoadingFallback />
})
const ReportsPage = dynamic(() => import('@/pages/reports').then(mod => ({ default: mod.ReportsPage })), {
  loading: () => <LoadingFallback />
})
const AnticheatPage = dynamic(() => import('@/pages/anticheat').then(mod => ({ default: mod.AnticheatPage })), {
  loading: () => <LoadingFallback />
})
const LiveAnalyticsPage = dynamic(() => import('@/pages/live-analytics').then(mod => ({ default: mod.LiveAnalyticsPage })), {
  loading: () => <LoadingFallback />
})
const SettingsPage = dynamic(() => import('@/pages/settings').then(mod => ({ default: mod.SettingsPage })), {
  loading: () => <LoadingFallback />
})
const UsersPage = dynamic(() => import('@/pages/users').then(mod => ({ default: mod.UsersPage })), {
  loading: () => <LoadingFallback />
})
const AiDevPage = dynamic(() => import('@/pages/ai-dev').then(mod => ({ default: mod.AiDevPage })), {
  loading: () => <LoadingFallback />
})
const MarketingPage = dynamic(() => import('@/pages/marketing').then(mod => ({ default: mod.MarketingPage })), {
  loading: () => <LoadingFallback />
})
const AutoMessagingPage = dynamic(() => import('@/pages/auto-messaging').then(mod => ({ default: mod.AutoMessagingPage })), {
  loading: () => <LoadingFallback />
})
const ClassroomRoom = dynamic(() => import('@/components/classroom/classroom-room').then(mod => ({ default: mod.ClassroomRoom })), {
  loading: () => <LoadingFallback />
})

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading page...</p>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [classroomOpen, setClassroomOpen] = useState<number | null>(null)

  // Memoize page selection to prevent unnecessary re-renders
  const renderedPage = useMemo(() => {
    if (classroomOpen !== null) {
      return <ClassroomRoom roomId={classroomOpen} onClose={() => setClassroomOpen(null)} />
    }

    switch (currentPage) {
      case 'dashboard': return <DashboardPage />
      case 'classrooms': return <ClassroomsPage onEnterClassroom={(id) => setClassroomOpen(id)} />
      case 'users': return <UsersPage />
      case 'ce4messenger': return <MessengerPage />
      case 'examsystem': return <ExamSystemPage />
      case 'placementtest': return <PlacementsPage />
      case 'teachereval': return <TeacherEvalPage />
      case 'dailyperf': return <DailyPerfPage />
      case 'homework': return <HomeworkPage />
      case 'videoarchive': return <VideoArchivePage />
      case 'reports': return <ReportsPage />
      case 'anticheat': return <AnticheatPage />
      case 'liveanalytics': return <LiveAnalyticsPage />
      case 'settings': return <SettingsPage />
      case 'aidev': return <AiDevPage />
      case 'marketing': return <MarketingPage />
      case 'automessaging': return <AutoMessagingPage />
      default: return <DashboardPage />
    }
  }, [currentPage, classroomOpen])

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar
        user={user}
        onLogout={logout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          userRole={user?.role || 'student'}
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page)
            setSidebarOpen(false)
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto custom-scroll bg-background p-4 md:p-6">
          {renderedPage}
        </main>
      </div>
    </div>
  )
}
