import axios from 'axios'

// ---------------------------------------------------------------------------
// Base URL & Supabase Key Configuration
// Wajib didefinisikan di environment (.env)
// Jika tidak ada variabel environment, program akan langsung berhenti/error.
// ---------------------------------------------------------------------------
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')
const SUPABASE_KEY = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim()

if (!BASE_URL || !SUPABASE_KEY) {
  throw new Error('FATAL: Variabel environment VITE_API_BASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY tidak ditemukan di .env!')
}

// ---------------------------------------------------------------------------
// Axios instance murni ke Supabase REST API
// ---------------------------------------------------------------------------
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  },
  timeout: 10000,
})

// ---------------------------------------------------------------------------
// Interceptor unwrap response & normalisasi error
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred'
    let status = null

    if (error.response) {
      status = error.response.status
      message =
        error.response.data?.message ||
        error.response.data?.msg ||
        error.response.data?.error ||
        error.response.data?.error_description ||
        `Server error (${status})`
    } else if (error.request) {
      message = 'Gagal menghubungi server database Supabase. Periksa koneksi Anda.'
    } else {
      message = error.message || message
    }

    return Promise.reject({
      message,
      status,
      code: error.response?.data?.code,
      raw: error.response?.data,
    })
  },
)

export { apiClient, BASE_URL, SUPABASE_KEY }
export default apiClient
