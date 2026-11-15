import { useState, useEffect } from 'react'
import { X, Save, PlusCircle, Edit3 } from 'lucide-react'
import { courseList } from '../data/scheduleData'

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const isEdit = Boolean(taskToEdit)
  const defaultDeadline = () => new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    title: '',
    course: courseList[0],
    category: 'Tugas Teori',
    deadline: defaultDeadline(),
    priority: 'Sedang',
    notes: '',
    status: 'Belum Selesai',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        course: taskToEdit.course || courseList[0],
        category: taskToEdit.category || 'Tugas Teori',
        deadline: taskToEdit.deadline || defaultDeadline(),
        priority: taskToEdit.priority || 'Sedang',
        notes: taskToEdit.notes || '',
        status: taskToEdit.status || 'Belum Selesai',
      })
    } else {
      setFormData({
        title: '',
        course: courseList[0],
        category: 'Tugas Teori',
        deadline: defaultDeadline(),
        priority: 'Sedang',
        notes: '',
        status: 'Belum Selesai',
      })
    }
    setErrors({})
  }, [taskToEdit, isOpen])

  if (!isOpen) return null

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Judul tugas wajib diisi'
    if (!formData.deadline) newErrors.deadline = 'Tanggal deadline wajib dipilih'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="flex-between" style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isEdit ? <Edit3 size={18} /> : <PlusCircle size={18} />}
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {isEdit ? 'Ubah Rincian Tugas' : 'Tambah Tugas Baru'}
            </h2>
          </div>

          <button
            type="button"
            className="icon-btn"
            style={{ border: 'none', background: 'transparent' }}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Judul Tugas */}
          <div className="form-group">
            <label className="form-label">
              Judul Tugas <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Implementasi Algoritma Dijkstra"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.title}</span>
            )}
          </div>

          {/* Mata Kuliah Dropdown */}
          <div className="form-group">
            <label className="form-label">Mata Kuliah</label>
            <select
              className="form-select"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            >
              {courseList.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* Kategori & Tingkat Prioritas */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kategori Tugas</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Tugas Teori">Tugas Teori</option>
                <option value="Laporan Praktikum">Laporan Praktikum</option>
                <option value="Proyek">Proyek</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tingkat Prioritas</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Tinggi">⚡ Tinggi</option>
                <option value="Sedang">⏳ Sedang</option>
                <option value="Rendah">☕ Rendah</option>
              </select>
            </div>
          </div>

          {/* Tanggal Deadline & Status (Jika Edit) */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Tanggal Deadline <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
              {errors.deadline && (
                <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.deadline}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Status Pengerjaan</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Belum Selesai">⏳ Belum Selesai</option>
                <option value="Selesai">✓ Selesai</option>
              </select>
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div className="form-group">
            <label className="form-label">Catatan / Detail Instruksi</label>
            <textarea
              className="form-textarea"
              placeholder="Instruksi tambahan, format laporan, link repository, atau spesifikasi pengumpulan..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Tugas'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
