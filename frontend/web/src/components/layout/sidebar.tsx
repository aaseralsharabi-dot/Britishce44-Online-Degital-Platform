'use client'

import { useState } from 'react'
import { PageKey } from './dashboard-layout'

interface NavItem {
  page: PageKey
  icon: string
  label: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

interface SidebarProps {
  userRole: string
  currentPage: PageKey
  onNavigate: (page: PageKey) => void
  isOpen: boolean
  onClose: () => void
}

const adminSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { page: 'dashboard', icon: '🏠', label: 'Dashboard' },
      { page: 'classrooms', icon: '🚪', label: 'Classrooms (240)' },
    ],
  },
  {
    title: 'Management',
    items: [
      { page: 'users', icon: '👥', label: 'Manage Users' },
      { page: 'teachers', icon: '👩‍🏫', label: 'Teachers (6)' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { page: 'ce4messenger', icon: '💬', label: 'CE4 Messenger' },
      { page: 'automessaging', icon: '🤖', label: 'Auto-Messaging' },
    ],
  },
  {
    title: 'Learning',
    items: [
      { page: 'examsystem', icon: '📝', label: 'Exam System (100)' },
      { page: 'placementtest', icon: '🎯', label: 'Placement Test' },
      { page: 'homework', icon: '📄', label: 'Homework Dropbox' },
      { page: 'videoarchive', icon: '🎞️', label: 'Video Archive' },
    ],
  },
  {
    title: 'Analytics & Reports',
    items: [
      { page: 'teachereval', icon: '⭐', label: 'AI Teacher Eval' },
      { page: 'dailyperf', icon: '📋', label: 'Daily Performance' },
      { page: 'reports', icon: '📊', label: 'Triple Reports' },
      { page: 'liveanalytics', icon: '📈', label: 'Live Analytics' },
    ],
  },
  {
    title: 'Tools & Features',
    items: [
      { page: 'marketing', icon: '📢', label: 'Marketing Suite' },
      { page: 'videoeditor', icon: '🎬', label: 'AI Video Editor' },
      { page: 'anticheat', icon: '🛡️', label: 'Anti-Cheat Monitor' },
      { page: 'aidev', icon: '🧠', label: 'AI Dev Assistant' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { page: 'settings', icon: '⚙️', label: 'Platform Settings' },
    ],
  },
]

const teacherSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { page: 'dashboard', icon: '🏠', label: 'Dashboard' },
      { page: 'classrooms', icon: '🚪', label: 'Classrooms' },
    ],
  },
  {
    title: 'Learning',
    items: [
      { page: 'homework', icon: '📄', label: 'Homework Dropbox' },
      { page: 'videoarchive', icon: '🎞️', label: 'Video Archive' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { page: 'dailyperf', icon: '📋', label: 'My Performance' },
      { page: 'reports', icon: '📊', label: 'My Reports' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { page: 'ce4messenger', icon: '💬', label: 'CE4 Messenger' },
    ],
  },
]

const studentSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { page: 'dashboard', icon: '🏠', label: 'My Dashboard' },
      { page: 'classrooms', icon: '🚪', label: 'Classrooms' },
    ],
  },
  {
    title: 'Learning',
    items: [
      { page: 'examsystem', icon: '📝', label: 'My Exams' },
      { page: 'placementtest', icon: '🎯', label: 'Placement Test' },
      { page: 'homework', icon: '📄', label: 'Homework Dropbox' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { page: 'ce4messenger', icon: '💬', label: 'CE4 Messenger' },
    ],
  },
]

function SidebarSection({ section, currentPage, onNavigate }: {
  section: NavSection
  currentPage: PageKey
  onNavigate: (page: PageKey) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wide hover:text-gold transition"
      >
        <span>{section.title}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="space-y-0.5 px-2 py-1">
          {section.items.map(item => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all text-left
                ${currentPage === item.page
                  ? 'bg-gold/15 text-gold font-semibold border-l-3 border-gold'
                  : 'text-gray-700 hover:bg-gold/5 hover:text-gold'
                }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1 truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ userRole, currentPage, onNavigate, isOpen, onClose }: SidebarProps) {
  const sections = userRole === 'admin' ? adminSections
    : userRole === 'teacher' ? teacherSections
    : userRole === 'supervisor' ? adminSections
    : studentSections

  return (
    <>
      <aside className={`
        w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto custom-scroll
        transition-all duration-300 z-20 lg:translate-x-0
        ${isOpen ? 'translate-x-0 fixed lg:relative' : '-translate-x-full lg:translate-x-0'}
        h-full lg:h-auto shadow-2xl lg:shadow-none
      `}>
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-navy font-black text-xs">B</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-navy text-sm">Britishce44</p>
              <p className="text-[8px] text-gray-400 leading-tight">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 space-y-2 px-1">
          {sections.map((section, idx) => (
            <SidebarSection
              key={idx}
              section={section}
              currentPage={currentPage}
              onNavigate={(page) => {
                onNavigate(page)
                onClose()
              }}
            />
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 text-[10px] text-gray-400 text-center space-y-1">
          <p>© 2025 Britishce44 · v4.4</p>
          <p>The First British Center Online</p>
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-10 lg:hidden" onClick={onClose} />
      )}
    </>
  )
}
