'use client'

import { ReactNode } from 'react'

interface AnalyticsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' }
  onClick?: () => void
  className?: string
}

export function AnalyticsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
  className = '',
}: AnalyticsCardProps) {
  const trendColor =
    trend?.direction === 'up' ? 'text-green-500' : trend?.direction === 'down' ? 'text-red-500' : 'text-gray-400'

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer ${className} ${onClick ? 'hover:shadow-lg' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
        </div>
        {icon && <div className="text-2xl flex-shrink-0 ml-2">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div>
          <p className="text-3xl font-bold text-navy">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {trend && (
          <div className={`text-sm font-semibold ${trendColor} flex items-center gap-1`}>
            <span>
              {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}
            </span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

interface AnalyticsGridProps {
  cards: AnalyticsCardProps[]
  columns?: number
}

export function AnalyticsGrid({ cards, columns = 4 }: AnalyticsGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
      {cards.map((card, idx) => (
        <AnalyticsCard key={idx} {...card} />
      ))}
    </div>
  )
}
