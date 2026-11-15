import { CheckCircle2, Circle, Calendar, Clock, Edit2, Trash2, Tag, BookOpen } from 'lucide-react'

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const isDone = task.status === 'Selesai'

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Tinggi':
        return <span className="badge badge-priority-tinggi">⚡ Prioritas Tinggi</span>
      case 'Sedang':
        return <span className="badge badge-priority-sedang">⏳ Prioritas Sedang</span>
      case 'Rendah':
      default:
        return <span className="badge badge-priority-rendah">☕ Prioritas Rendah</span>
    }
  }

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
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        opacity: isDone ? 0.78 : 1,
        background: isDone ? '#fafbfc' : 'var(--surface)',
        borderColor: isDone ? '#cbd5e1' : 'var(--border)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Top Header: Category & Priority */}
      <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
        <span className="badge badge-category" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tag size={11} /> {task.category}
        </span>
        {getPriorityBadge(task.priority)}
      </div>

      {/* Main Content Area: Checkbox + Title + Course */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1, marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => onToggleStatus(task.id)}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDone ? 'var(--status-done-text)' : 'var(--text-muted)',
            cursor: 'pointer',
            paddingTop: '2px',
            flexShrink: 0,
            transition: 'transform 0.15s ease',
          }}
          title={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
        >
          {isDone ? (
            <CheckCircle2 size={24} fill="#dcfce7" color="#16a34a" />
          ) : (
            <Circle size={24} color="#94a3b8" />
          )}
        </button>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              lineHeight: 1.35,
              textDecoration: isDone ? 'line-through' : 'none',
              marginBottom: '6px',
            }}
          >
            {task.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
            <BookOpen size={14} />
            <span>{task.course}</span>
          </div>
        </div>
      </div>

      {/* Notes / Catatan Tugas */}
      {task.notes && (
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.45,
            background: 'var(--surface-alt)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '14px',
            fontStyle: 'italic',
          }}
        >
          "{task.notes}"
        </div>
      )}

      {/* Bottom Bar: Deadline & Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid var(--border)',
          marginTop: 'auto',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: isDone ? 'var(--text-muted)' : '#b91c1c', fontWeight: 600 }}>
          <Calendar size={14} />
          <span>Deadline: {formatDeadline(task.deadline)}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="icon-btn"
            title="Edit Tugas"
            onClick={() => onEdit(task)}
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            className="icon-btn danger"
            title="Hapus Tugas"
            onClick={() => onDelete(task)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

