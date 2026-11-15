import { CheckSquare, Calendar, BarChart2, Users, PlusCircle } from 'lucide-react'

export default function Header({ currentTab, onSelectTab, onOpenCreateModal }) {
  const tabs = [
    { id: 'tasks', label: 'Daftar Tugas', icon: CheckSquare },
    { id: 'schedule', label: 'Jadwal Kuliah', icon: Calendar },
    { id: 'stats', label: 'Prioritas & Statistik', icon: BarChart2 },
    { id: 'profile', label: 'Profil Kelompok', icon: Users },
  ]

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div
          className="brand-wrap"
          onClick={() => onSelectTab('tasks')}
        >
          <div className="brand-icon">
            <CheckSquare size={22} />
          </div>
          <div>
            <div className="brand-title">TaskFlow Teknik</div>
            <div className="brand-subtitle">Manajemen Tugas &amp; Jadwal Kuliah</div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <nav className="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ marginLeft: '8px' }}
            onClick={onOpenCreateModal}
          >
            <PlusCircle size={15} />
            <span>+ Tambah Tugas</span>
          </button>
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(tab.id)}
              >
                <Icon size={19} />
                <span>{tab.label}</span>
              </button>
            )
          })}
          <button
            type="button"
            className="mobile-nav-item"
            style={{ color: 'var(--primary)' }}
            onClick={onOpenCreateModal}
          >
            <PlusCircle size={19} />
            <span>+ Tugas</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
