import { useState } from 'react'
import { Users, Copy, Check } from 'lucide-react'

export default function ProfilePage() {
  const [copiedNim, setCopiedNim] = useState(null)

  const members = [
    {
      name: 'Muhammad Daffa Ryan Fusta',
      nim: '21120124140106',
      initials: 'DF',
      gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    },
    {
      name: 'Willybrordus Anugrah Gusti',
      nim: '21120124140153',
      initials: 'WG',
      gradient: 'linear-gradient(135deg, #059669, #10b981)',
    },
    {
      name: 'May Triastuti',
      nim: '21120124130088',
      initials: 'MT',
      gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    },
    {
      name: 'Daniel Alfatha Cameroon Prayudia',
      nim: '21120124130077',
      initials: 'DP',
      gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
    },
  ]

  const handleCopy = (nim) => {
    navigator.clipboard.writeText(nim)
    setCopiedNim(nim)
    setTimeout(() => setCopiedNim(null), 2000)
  }

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Header Bagian Atas: Hanya Nama Kelompok dan Mata Kuliah */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#ffffff',
          padding: '24px 28px',
          marginBottom: '24px',
          border: '1px solid #334155',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px', color: '#fff' }}>
          Kel 24 Praktikum PPB
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#cbd5e1', fontWeight: 500 }}>
          Praktikum Pemrograman Perangkat Bergerak
        </p>
      </div>

      {/* Members Section (Nama dan NIM saja) */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="var(--primary)" /> Anggota Kelompok
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '14px',
          }}
        >
          {members.map((member) => {
            const isCopied = copiedNim === member.nim
            return (
              <div
                key={member.nim}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 18px',
                }}
              >
                {/* Initials Avatar */}
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: member.gradient,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {member.initials}
                </div>

                {/* Member Info: Nama dan NIM saja */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      marginBottom: '6px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={member.name}
                  >
                    {member.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <code
                      style={{
                        background: 'var(--surface-alt)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                      }}
                    >
                      {member.nim}
                    </code>
                    <button
                      type="button"
                      className="icon-btn"
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => handleCopy(member.nim)}
                      title="Salin NIM"
                    >
                      {isCopied ? <Check size={14} color="#16a34a" /> : <Copy size={13} />}
                    </button>
                    {isCopied && (
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                        Disalin!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
