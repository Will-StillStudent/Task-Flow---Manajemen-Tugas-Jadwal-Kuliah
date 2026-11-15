import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  CheckSquare,
  RefreshCw,
  AlertCircle,
  Loader,
  RotateCcw,
} from 'lucide-react'
import TaskCard from '../components/TaskCard'
import { courseList } from '../data/scheduleData'

export default function TasksPage({
  tasks = [],
  loading = false,
  error = null,
  isSyncing = false,
  onRefetch,
  onResetTasks,
  onOpenCreateModal,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('Semua')
  const [selectedStatus, setSelectedStatus] = useState('Semua')
  const [sortBy, setSortBy] = useState('deadline-asc')

  // Filter & Search logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const query = search.toLowerCase()
        const matchSearch =
          task.title?.toLowerCase().includes(query) ||
          task.notes?.toLowerCase().includes(query) ||
          task.course?.toLowerCase().includes(query)

        const matchCourse =
          selectedCourse === 'Semua' || task.course === selectedCourse

        const matchStatus =
          selectedStatus === 'Semua' || task.status === selectedStatus

        return matchSearch && matchCourse && matchStatus
      })
      .sort((a, b) => {
        if (sortBy === 'deadline-asc') {
          return new Date(a.deadline || 0) - new Date(b.deadline || 0)
        }
        if (sortBy === 'deadline-desc') {
          return new Date(b.deadline || 0) - new Date(a.deadline || 0)
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title)
        }
        if (sortBy === 'priority-desc') {
          const rank = { Tinggi: 3, Sedang: 2, Rendah: 1 }
          return (rank[b.priority] || 0) - (rank[a.priority] || 0)
        }
        return 0
      })
  }, [tasks, search, selectedCourse, selectedStatus, sortBy])

  return (
    <div>
      {/* Page Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h1 className="page-title">Daftar Tugas Mahasiswa</h1>
          {isSyncing && (
            <div style={{ marginTop: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <RefreshCw size={12} className="spin" /> Menyimpan perubahan...
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onRefetch && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onRefetch}
              disabled={loading}
              title="Refresh / Sinkronkan data"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>{loading ? 'Memuat...' : 'Refresh'}</span>
            </button>
          )}

          {onResetTasks && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onResetTasks}
              title="Reset ke 11 data tugas awal"
            >
              <RotateCcw size={14} />
              <span>Reset Dummy</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenCreateModal}
          >
            <Plus size={15} />
            <span>+ Tambah Tugas</span>
          </button>
        </div>
      </div>

      {/* Error state notification if any */}
      {error && (
        <div
          className="card"
          style={{
            backgroundColor: '#fef2f2',
            borderColor: '#fecaca',
            color: '#991b1b',
            marginBottom: '20px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#dc2626" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {error}
            </span>
          </div>
          {onRefetch && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              onClick={onRefetch}
            >
              Coba Lagi
            </button>
          )}
        </div>
      )}

      {/* Filter and Search Panel */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Cari berdasarkan judul tugas, mata kuliah, atau catatan..."
              className="form-input"
              style={{ paddingLeft: '38px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Mata Kuliah:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.825rem', maxWidth: '220px' }}
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="Semua">Semua Mata Kuliah</option>
                {courseList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginLeft: '6px' }}>
                Status:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.825rem' }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="Semua">Semua Status</option>
                <option value="Belum Selesai">⏳ Belum Selesai</option>
                <option value="Selesai">✓ Selesai</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Urutkan:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.825rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="deadline-asc">Deadline Terdekat</option>
                <option value="deadline-desc">Deadline Terjauh</option>
                <option value="priority-desc">Prioritas Tertinggi</option>
                <option value="title-asc">Judul Tugas (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {loading ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <div style={{ width: '40px', height: '40px', color: 'var(--primary)' }}>
            <Loader size={36} className="spin" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Memuat Data Tugas...</h3>
        </div>
      ) : (
        <>
          {/* Counter Info */}
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Menampilkan {filteredTasks.length} dari {tasks.length} tugas
            </p>
          </div>

          {/* Grid of Task Cards */}
          {filteredTasks.length > 0 ? (
            <div className="grid-cards">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '48px 20px',
                borderStyle: 'dashed',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--surface-alt)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckSquare size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                Tidak ada tugas ditemukan
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px' }}>
                {search || selectedCourse !== 'Semua' || selectedStatus !== 'Semua'
                  ? 'Tidak ada tugas yang sesuai dengan kriteria filter atau pencarian Anda.'
                  : 'Belum ada tugas yang tersimpan. Buat tugas baru atau muat data dummy.'}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-primary" onClick={onOpenCreateModal}>
                  <Plus size={16} />
                  <span>Tambah Tugas Sekarang</span>
                </button>
                {onResetTasks && (
                  <button type="button" className="btn btn-secondary" onClick={onResetTasks}>
                    <RotateCcw size={15} />
                    <span>Muat 11 Tugas Dummy</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
