import { useState, useEffect } from 'react'
import { Download, WifiOff, X } from 'lucide-react'

export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(() => window.deferredInstallPrompt || null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [installed, setInstalled] = useState(() => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    )
  })
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if prompt was captured early by index.html script
    if (window.deferredInstallPrompt) {
      setInstallPrompt(window.deferredInstallPrompt)
    }

    const handlePromptAvailable = () => {
      if (window.deferredInstallPrompt) {
        setInstallPrompt(window.deferredInstallPrompt)
      }
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault()
      window.deferredInstallPrompt = e
      setInstallPrompt(e)
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
      window.deferredInstallPrompt = null
    }

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('pwa-prompt-available', handlePromptAvailable)
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('pwa-prompt-available', handlePromptAvailable)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Fungsi instalasi PWA langsung memicu download/pasang browser native
  const handleInstallClick = async () => {
    const promptEvent = installPrompt || window.deferredInstallPrompt

    if (promptEvent) {
      // Membuka dialog instalasi resmi browser (Chrome/Edge/Android)
      promptEvent.prompt()
      const choice = await promptEvent.userChoice
      if (choice && choice.outcome === 'accepted') {
        setInstalled(true)
      }
      setInstallPrompt(null)
      window.deferredInstallPrompt = null
    } else {
      // Jika browser belum melepaskan event atau sudah terpasang
      if (installed) {
        alert('Aplikasi TaskFlow Teknik sudah terpasang di perangkat Anda.')
      } else {
        alert(
          'Browser sedang memproses instalasi.\n\n' +
          'Silakan klik ikon Install (komputer dengan panah ke bawah) yang muncul di sebelah kanan bilah URL (Address Bar) browser Anda untuk langsung memasang aplikasi.'
        )
      }
    }
  }

  // Offline status banner
  if (isOffline) {
    return (
      <div className="pwa-banner--offline" role="status">
        <WifiOff size={18} />
        <div>
          <strong>Mode Offline Aktif:</strong> Aplikasi TaskFlow tetap dapat digunakan. Data tugas dan jadwal Anda disimpan di perangkat secara lokal.
        </div>
      </div>
    )
  }

  if (dismissed || installed) return null

  // Card install stay di pojok kanan bawah
  return (
    <aside className="pwa-badge" role="region" aria-label="Install App">
      <div className="pwa-badge-content">
        <Download size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
        <span>Install <strong>TaskFlow Teknik</strong> for offline access.</span>
      </div>
      <div className="pwa-badge-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleInstallClick}
        >
          Install App
        </button>
        <button
          type="button"
          className="icon-btn"
          style={{ border: 'none', background: 'transparent', width: '28px', height: '28px' }}
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          title="Tutup"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  )
}
