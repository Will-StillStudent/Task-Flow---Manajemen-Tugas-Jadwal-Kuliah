import { apiClient } from '../config/api'
import { initialTasks } from '../data/initialTasks'

// ---------------------------------------------------------------------------
// Normalizer — standarisasi bentuk objek Task dari Supabase
// ---------------------------------------------------------------------------
export const normalizeTask = (item) => {
  if (!item) return null

  return {
    id: String(item.id),
    title: item.title || 'Tanpa Judul',
    course: item.course || 'Umum',
    category: item.category || 'Tugas Teori',
    deadline: item.deadline || new Date().toISOString().split('T')[0],
    priority: item.priority || 'Sedang',
    status: item.status || 'Belum Selesai',
    notes: item.notes || '',
    createdAt: item.created_at || item.createdAt || new Date().toISOString(),
    updatedAt: item.updated_at || item.updatedAt || null,
  }
}

// ---------------------------------------------------------------------------
// TaskService — Service CRUD murni ke Supabase REST API
// Tidak ada fallback local storage; sepenuhnya bergantung pada database Supabase
// ---------------------------------------------------------------------------
class TaskService {
  /**
   * Mengambil semua daftar tugas langsung dari database Supabase
   */
  async getTasks(params = {}) {
    const queryParts = ['select=*']

    if (params.search) {
      queryParts.push(`title=ilike.*${encodeURIComponent(params.search)}*`)
    }

    if (params.category && params.category !== 'Semua') {
      queryParts.push(`category=eq.${encodeURIComponent(params.category)}`)
    }

    if (params.status && params.status !== 'Semua') {
      queryParts.push(`status=eq.${encodeURIComponent(params.status)}`)
    }

    if (params.course && params.course !== 'Semua') {
      queryParts.push(`course=eq.${encodeURIComponent(params.course)}`)
    }

    if (params.sort_by) {
      const order = params.order === 'desc' ? 'desc' : 'asc'
      queryParts.push(`order=${encodeURIComponent(params.sort_by)}.${order}`)
    } else {
      queryParts.push('order=created_at.desc')
    }

    const queryString = queryParts.join('&')
    const data = await apiClient.get(`/rest/v1/tasks?${queryString}`)
    const list = Array.isArray(data) ? data.map(normalizeTask) : []

    return {
      success: true,
      data: list,
    }
  }

  /**
   * Mengambil detail tugas berdasarkan ID dari Supabase
   */
  async getTaskById(id) {
    const data = await apiClient.get(`/rest/v1/tasks?id=eq.${id}&select=*`)
    if (Array.isArray(data) && data.length > 0) {
      return { success: true, data: normalizeTask(data[0]) }
    }
    throw new Error('Tugas tidak ditemukan di database.')
  }

  /**
   * Menambahkan tugas baru ke tabel tasks di Supabase
   */
  async createTask(taskData) {
    const id = taskData.id || `task-${Date.now()}`
    const payload = {
      id,
      title: taskData.title,
      course: taskData.course,
      category: taskData.category || 'Tugas Teori',
      deadline: taskData.deadline,
      priority: taskData.priority || 'Sedang',
      status: taskData.status || 'Belum Selesai',
      notes: taskData.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const res = await apiClient.post('/rest/v1/tasks', payload, {
      headers: { Prefer: 'return=representation' },
    })
    const created = Array.isArray(res) ? res[0] : res
    return { success: true, data: normalizeTask(created || payload) }
  }

  /**
   * Memperbarui tugas di tabel tasks di Supabase
   */
  async updateTask(id, taskData) {
    const payload = {
      updated_at: new Date().toISOString(),
    }
    if (taskData.title !== undefined) payload.title = taskData.title
    if (taskData.course !== undefined) payload.course = taskData.course
    if (taskData.category !== undefined) payload.category = taskData.category
    if (taskData.deadline !== undefined) payload.deadline = taskData.deadline
    if (taskData.priority !== undefined) payload.priority = taskData.priority
    if (taskData.status !== undefined) payload.status = taskData.status
    if (taskData.notes !== undefined) payload.notes = taskData.notes

    const res = await apiClient.patch(`/rest/v1/tasks?id=eq.${id}`, payload, {
      headers: { Prefer: 'return=representation' },
    })
    const updated = Array.isArray(res) ? res[0] : res
    return { success: true, data: normalizeTask(updated) }
  }

  /**
   * Mengubah status tugas di Supabase
   */
  async toggleStatus(id, currentStatus) {
    const nextStatus = currentStatus === 'Selesai' ? 'Belum Selesai' : 'Selesai'
    return this.updateTask(id, { status: nextStatus })
  }

  /**
   * Menghapus tugas dari tabel tasks di Supabase
   */
  async deleteTask(id) {
    await apiClient.delete(`/rest/v1/tasks?id=eq.${id}`)
    return { success: true }
  }

  /**
   * Menanamkan data tugas dummy awal ke database Supabase
   */
  async seedInitialTasks() {
    const payloadList = initialTasks.map((t) => ({
      id: t.id,
      title: t.title,
      course: t.course,
      category: t.category,
      deadline: t.deadline,
      priority: t.priority,
      status: t.status,
      notes: t.notes,
      created_at: t.createdAt,
      updated_at: new Date().toISOString(),
    }))

    await apiClient.post('/rest/v1/tasks', payloadList, {
      headers: {
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
    })

    return { success: true, data: initialTasks.map(normalizeTask) }
  }

  /**
   * Reset data tugas ke 11 tugas awal di Supabase
   */
  async resetTasks() {
    return this.seedInitialTasks()
  }
}

export const taskService = new TaskService()
export default taskService
