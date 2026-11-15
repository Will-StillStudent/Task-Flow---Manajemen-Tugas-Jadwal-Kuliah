import { useState, useEffect, useCallback } from 'react'
import taskService from '../services/taskService'

/**
 * Custom Hook useTasks — Mengelola state data tugas langsung dari Supabase
 */
export function useTasks(params = {}) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const paramKey = JSON.stringify(params)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await taskService.getTasks(params)

      if (response.success) {
        setTasks(response.data || [])
      } else {
        setError(response.message || 'Gagal memuat daftar tugas dari database.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data dari database Supabase.')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Tambah Tugas
  const createTask = async (taskData) => {
    try {
      setIsSyncing(true)
      const res = await taskService.createTask(taskData)
      if (res.success && res.data) {
        setTasks((prev) => [res.data, ...prev.filter((t) => t.id !== res.data.id)])
        return res
      }
      throw new Error(res.message || 'Gagal menambahkan tugas')
    } finally {
      setIsSyncing(false)
    }
  }

  // Edit / Update Tugas
  const updateTask = async (id, taskData) => {
    try {
      setIsSyncing(true)
      const res = await taskService.updateTask(id, taskData)
      if (res.success && res.data) {
        setTasks((prev) => prev.map((t) => (t.id === String(id) ? res.data : t)))
        return res
      }
      throw new Error(res.message || 'Gagal memperbarui tugas')
    } finally {
      setIsSyncing(false)
    }
  }

  // Toggle Selesai / Belum Selesai
  const toggleStatus = async (id) => {
    const target = tasks.find((t) => t.id === String(id))
    if (!target) return null

    try {
      setIsSyncing(true)
      const res = await taskService.toggleStatus(id, target.status)
      if (res.success && res.data) {
        setTasks((prev) => prev.map((t) => (t.id === String(id) ? res.data : t)))
        return res
      }
      throw new Error(res.message || 'Gagal mengubah status tugas')
    } finally {
      setIsSyncing(false)
    }
  }

  // Hapus Tugas
  const deleteTask = async (id) => {
    try {
      setIsSyncing(true)
      const res = await taskService.deleteTask(id)
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t.id !== String(id)))
        return res
      }
      throw new Error(res.message || 'Gagal menghapus tugas')
    } finally {
      setIsSyncing(false)
    }
  }

  // Reset Tugas ke 11 Data Awal di Supabase
  const resetTasks = async () => {
    try {
      setLoading(true)
      const res = await taskService.resetTasks()
      if (res.success && res.data) {
        setTasks(res.data)
        return res
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    tasks,
    setTasks,
    loading,
    error,
    isSyncing,
    refetch: fetchTasks,
    createTask,
    updateTask,
    toggleStatus,
    deleteTask,
    resetTasks,
  }
}

export default useTasks
