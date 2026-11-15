import { useMemo } from 'react'
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Layers,
  Calendar,
  BookOpen,
  ArrowRight,
  Circle,
} from 'lucide-react'

export default function StatsPage({ tasks, onToggleStatus, onNavigateTasks }) {
  const stats = useMemo(() => {
    const total = tasks.length
    const selesai = tasks.filter((t) => t.status === 'Selesai').length
    const belumSelesai = tasks.filter((t) => t.status === 'Belum Selesai').length
    const tinggi = tasks.filter((t) => t.priority === 'Tinggi').length
    const sedang = tasks.filter((t) => t.priority === 'Sedang').length
    const rendah = tasks.filter((t) => t.priority === 'Rendah').length

    const finishRate = total > 0 ? Math.round((selesai / total) * 100) : 0

    // Daftar khusus tugas dengan prioritas "Tinggi" yang mendekati deadline
    const urgentHighPriority = tasks
      .filter((t) => t.priority === 'Tinggi')
      .sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0))

    return {
      total,
      selesai,
      belumSelesai,
      tinggi,
      sedang,
      rendah,
      finishRate,
      urgentHighPriority,
    }
  }, [tasks])

  const formatDeadline = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const options = { day: 'numeric', month: 'short', year: 'numeric' }
      return new Date(dateStr).toLocaleDateString('id-ID', options)
    } catch {
      return dateStr
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Prioritas &amp; Statistik Tugas</h1>
      </div>

      {/* Ringkasan Angka (3 Utama + 1 Metrik Lanjutan) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Total Tugas */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius)',
              background: '#eff6ff',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Total Tugas
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.total} Tugas</div>
          </div>
        </div>

        {/* Tugas Belum Selesai */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius)',
              background: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Belum Selesai
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>
              {stats.belumSelesai} Tugas
            </div>
          </div>
        </div>

        {/* Tugas Selesai */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius)',
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Tugas Selesai
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>
              {stats.selesai} Tugas
            </div>
          </div>
        </div>

        {/* Prioritas Tinggi */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius)',
              background: '#fee2e2',
              color: '#b91c1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Prioritas Tinggi
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b91c1c' }}>
              {stats.tinggi} Tugas
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Penyelesaian */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
        <div className="flex-between" style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--primary)" /> Progres Penyelesaian Keseluruhan
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>
            {stats.finishRate}% Selesai
          </span>
        </div>
        <div
          style={{
            height: '10px',
            borderRadius: '999px',
            background: 'var(--surface-alt)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${stats.finishRate}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2563eb, #10b981)',
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* DAFTAR KHUSUS TUGAS PRIORITAS TINGGI YANG MENDEKATI DEADLINE */}
      <div>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#fee2e2',
                color: '#b91c1c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={16} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Tugas Prioritas Tinggi Mendekati Deadline ({stats.urgentHighPriority.length})
            </h2>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onNavigateTasks}
            style={{ color: 'var(--primary)', fontWeight: 700 }}
          >
            <span>Semua Tugas</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {stats.urgentHighPriority.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.urgentHighPriority.map((task) => {
              const isDone = task.status === 'Selesai'

              return (
                <div
                  key={task.id}
                  className="card"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    borderLeft: '5px solid #ef4444',
                    background: isDone ? '#fafbfc' : 'var(--surface)',
                    opacity: isDone ? 0.75 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(task.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: isDone ? 'var(--status-done-text)' : '#94a3b8',
                      }}
                      title={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
                    >
                      {isDone ? (
                        <CheckCircle2 size={24} fill="#dcfce7" color="#16a34a" />
                      ) : (
                        <Circle size={24} />
                      )}
                    </button>

                    <div>
                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          textDecoration: isDone ? 'line-through' : 'none',
                          marginBottom: '3px',
                        }}
                      >
                        {task.title}
                      </h4>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          {task.course}
                        </span>
                        <span>&bull;</span>
                        <span className="badge badge-category" style={{ padding: '2px 6px', fontSize: '0.72rem' }}>
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: isDone ? 'var(--text-muted)' : '#b91c1c',
                        background: isDone ? 'var(--surface-alt)' : '#fee2e2',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <Calendar size={13} />
                      <span>{formatDeadline(task.deadline)}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isDone ? '#16a34a' : '#b45309', fontWeight: 600, marginTop: '4px' }}>
                      {isDone ? '✓ Sudah Selesai' : '⏳ Segera Selesaikan'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div
            className="card"
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              borderStyle: 'dashed',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Tidak ada tugas berprioritas tinggi yang belum selesai. Pekerjaan Anda terkendali!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
