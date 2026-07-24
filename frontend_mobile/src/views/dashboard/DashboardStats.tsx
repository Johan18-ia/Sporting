import React from 'react'

interface DashboardStatItem {
  label: string
  value: number | string
  icon: React.ComponentType<any>
  note?: string
}

interface DashboardStatsProps {
  items?: DashboardStatItem[]
  loading?: boolean
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ items = [], loading = false }) => {
  return (
    <div className="stats-grid">
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <div key={index} className="stat-card">
            <div className="stat-card-icon">
              <Icon />
            </div>
            <div className="stat-card-body">
              <h3>{loading ? '—' : item.value}</h3>
              <p>
                {item.label}
                {item.note && <span className="stat-card-note">{item.note}</span>}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DashboardStats
