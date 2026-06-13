'use client'

import { useState, useEffect } from 'react'
import { AnalyticsCard, AnalyticsGrid } from '@/components/ui/analytics-card'
import { ResponsiveTable } from '@/components/ui/responsive-table'

interface DashboardStats {
  totalStudents: number
  activeClassrooms: number
  completedExams: number
  avgEngagement: number
  studentGrowth: number
  classroomTrend: number
  examCompletionRate: number
  engagementTrend: number
}

interface ActivityItem {
  id: string
  user: string
  action: string
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

export function EnhancedAnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setStats({
        totalStudents: 1240,
        activeClassrooms: 42,
        completedExams: 156,
        avgEngagement: 87,
        studentGrowth: 12,
        classroomTrend: 8,
        examCompletionRate: 92,
        engagementTrend: -3,
      })

      setActivities([
        {
          id: '1',
          user: 'Ahmed Hassan',
          action: 'Completed Exam - English 101',
          timestamp: '2 hours ago',
          status: 'completed',
        },
        {
          id: '2',
          user: 'Fatima Ali',
          action: 'Submitted Homework - Math',
          timestamp: '5 hours ago',
          status: 'completed',
        },
        {
          id: '3',
          user: 'Mohamed Ibrahim',
          action: 'Joined Classroom - Physics',
          timestamp: '1 day ago',
          status: 'completed',
        },
        {
          id: '4',
          user: 'Layla Noor',
          action: 'Missed Exam - Biology',
          timestamp: '2 days ago',
          status: 'pending',
        },
      ])

      setLoading(false)
    }, 500)
  }, [timeRange])

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const analyticsCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: '👥',
      trend: { value: stats.studentGrowth, direction: 'up' as const },
      subtitle: `+${stats.studentGrowth}% this month`,
    },
    {
      title: 'Active Classrooms',
      value: stats.activeClassrooms,
      icon: '🚪',
      trend: { value: stats.classroomTrend, direction: 'up' as const },
      subtitle: `+${stats.classroomTrend} new classrooms`,
    },
    {
      title: 'Completed Exams',
      value: stats.completedExams,
      icon: '📝',
      trend: { value: stats.examCompletionRate, direction: 'up' as const },
      subtitle: `${stats.examCompletionRate}% completion rate`,
    },
    {
      title: 'Avg. Engagement',
      value: `${stats.avgEngagement}%`,
      icon: '📊',
      trend: { value: Math.abs(stats.engagementTrend), direction: stats.engagementTrend >= 0 ? 'up' : 'down' },
      subtitle: `${Math.abs(stats.engagementTrend)}% from last week`,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Platform performance and engagement metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:border-gold focus:border-gold outline-none"
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <AnalyticsGrid cards={analyticsCards} columns={4} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Enrollment Trend */}
        <div className="card">
          <h3 className="font-bold text-navy mb-4">Student Enrollment Trend</h3>
          <div className="h-48 flex items-end gap-2">
            {[120, 145, 168, 182, 205, 228, 240].map((value, i) => (
              <div
                key={i}
                className="flex-1 bg-gold/60 hover:bg-gold rounded-t-lg transition cursor-pointer group relative"
                style={{ height: `${(value / 240) * 100}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs font-bold text-gray-700 whitespace-nowrap bg-gold/20 px-2 py-1 rounded">
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-4">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Exam Pass Rate */}
        <div className="card">
          <h3 className="font-bold text-navy mb-4">Exam Performance</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">English</span>
                <span className="font-bold text-gold">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gold rounded-full h-2" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Math</span>
                <span className="font-bold text-gold">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gold rounded-full h-2" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Science</span>
                <span className="font-bold text-gold">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gold rounded-full h-2" style={{ width: '88%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">History</span>
                <span className="font-bold text-gold">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gold rounded-full h-2" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="font-bold text-navy mb-4">Recent Activity</h3>
        <ResponsiveTable
          columns={[
            { key: 'user', label: 'User', render: user => <span className="font-medium">{user}</span> },
            { key: 'action', label: 'Action', render: action => <span className="text-gray-700">{action}</span> },
            {
              key: 'status',
              label: 'Status',
              render: status => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              ),
            },
            { key: 'timestamp', label: 'Time', render: ts => <span className="text-gray-500 text-sm">{ts}</span> },
          ]}
          data={activities}
          keyExtractor={(item, idx) => item.id || idx}
        />
      </div>
    </div>
  )
}
