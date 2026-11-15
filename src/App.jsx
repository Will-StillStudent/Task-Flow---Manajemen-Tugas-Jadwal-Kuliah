import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import PWABadge from './components/PWABadge'
import TaskModal from './components/TaskModal'
import ConfirmModal from './components/ConfirmModal'
import TasksPage from './pages/TasksPage'
import SchedulePage from './pages/SchedulePage'
import StatsPage from './pages/StatsPage'
import ProfilePage from './pages/ProfilePage'
import { useTasks } from './hooks/useTasks'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function App() {
  const [currentTab, setCurrentTab] = useState('tasks') // 'tasks' | 'schedule' | 'stats' | 'profile'
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

  // Menggunakan custom hook useTasks untuk manajemen data Supabase
  const {
    tasks,
    loading,
    error,
    isSyncing,
    refetch,
    createTask,
    updateTask,
    toggleStatus,
    deleteTask,
    resetTasks,
  } = useTasks()

  // PWA Install Prompt State
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isAppInstalled, setIsAppInstalled] = useState(false)

  useEffect(() => {
    // Capture PWA install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    const handleAppInstalled = () => {
      setIsAppInstalled(true)
      setInstallPrompt(null)
    }

    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsAppInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const showToast = (message, isError = false) => {
    setToast({ message, isError })
    setTimeout(() => {
      setToast(null)
    }, 3200)
  }

  // Navigation handler
  const handleSelectTab = (tab) => {
    setCurrentTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Modal open handlers
  const handleOpenCreateModal = () => {
    setTaskToEdit(null)
    setIsTaskModalOpen(true)
  }

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task)
    setIsTaskModalOpen(true)
  }

  // CRUD Operations
  const handleSaveTask = async (formData) => {
    try {
      if (taskToEdit) {
        const res = await updateTask(taskToEdit.id, formData)
        if (res?.success) {
          showToast('Tugas berhasil diperbarui!')
        }
      } else {
        const res = await createTask(formData)
        if (res?.success) {
          showToast('Tugas baru berhasil ditambahkan!')
        }
      }
      setIsTaskModalOpen(false)
      setTaskToEdit(null)
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan tugas.', true)
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleStatus(id)
      if (res?.success && res.data) {
        showToast(
          res.data.status === 'Selesai'
            ? 'Tugas ditandai selesai! ✓'
            : 'Tugas ditandai belum selesai.'
        )
      }
    } catch (err) {
      showToast(err.message || 'Gagal mengubah status tugas.', true)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await deleteTask(deleteTarget.id)
      if (res?.success) {
        showToast('Tugas berhasil dihapus.')
      }
    } catch (err) {
      showToast(err.message || 'Gagal menghapus tugas.', true)
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleResetTasks = async () => {
    if (window.confirm('Reset data tugas ke 11 tugas awal di database?')) {
      try {
        await resetTasks()
        showToast('Data tugas berhasil di-reset.')
      } catch (err) {
        showToast(err.message || 'Gagal mereset data tugas.', true)
      }
    }
  }

  return (
    <div className="app-shell">
      {/* Toast Feedback */}
      {toast && (
        <div
          className="toast-notice"
          role="alert"
          style={{
            borderLeftColor: toast.isError ? '#ef4444' : 'var(--primary)',
          }}
        >
          {toast.isError ? (
            <AlertCircle size={18} color="#ef4444" />
          ) : (
            <CheckCircle2 size={18} color="#22c55e" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Responsive Header & Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Main Container Pages */}
      <main className="main-container">
        {/* Halaman 1: Daftar Tugas (CRUD) */}
        {currentTab === 'tasks' && (
          <TasksPage
            tasks={tasks}
            loading={loading}
            error={error}
            isSyncing={isSyncing}
            onRefetch={refetch}
            onResetTasks={handleResetTasks}
            onOpenCreateModal={handleOpenCreateModal}
            onToggleStatus={handleToggleStatus}
            onEdit={handleOpenEditModal}
            onDelete={(task) => setDeleteTarget(task)}
          />
        )}

        {/* Halaman 2: Jadwal Kuliah Mingguan */}
        {currentTab === 'schedule' && <SchedulePage />}

        {/* Halaman 3: Prioritas & Statistik */}
        {currentTab === 'stats' && (
          <StatsPage
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onNavigateTasks={() => handleSelectTab('tasks')}
          />
        )}

        {/* Halaman 4: Profil Kelompok 24 PPB */}
        {currentTab === 'profile' && <ProfilePage />}
      </main>

      {/* Modal Tambah / Edit Tugas */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setTaskToEdit(null)
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Tugas"
        message={`Apakah Anda yakin ingin menghapus tugas "${deleteTarget?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* PWA Badge: Install Prompt & Offline Banner */}
      <PWABadge />

      {/* Footer Identitas Kelompok */}
      <Footer />
    </div>
  )
}
