import { Calendar, Clock, MapPin, BookOpen, Layers } from 'lucide-react'
import { weeklySchedule } from '../data/scheduleData'

export default function SchedulePage() {
  const totalClasses = weeklySchedule.reduce((acc, curr) => acc + curr.classes.length, 0)

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Jadwal Kuliah Mingguan</h1>
      </div>

      {/* Grid of days */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {weeklySchedule.map((scheduleDay) => {
          const hasClasses = scheduleDay.classes.length > 0

          return (
            <div key={scheduleDay.day} className="card" style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: hasClasses ? 'var(--primary-light)' : 'var(--surface-alt)',
                      color: hasClasses ? 'var(--primary)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                    }}
                  >
                    {scheduleDay.day.slice(0, 2)}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {scheduleDay.day}
                    </h2>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {hasClasses ? `${scheduleDay.classes.length} Mata Kuliah Terjadwal` : 'Tidak Ada Perkuliahan (Belajar Mandiri)'}
                    </span>
                  </div>
                </div>

                {hasClasses && (
                  <span className="badge badge-category" style={{ fontSize: '0.75rem' }}>
                    Aktif
                  </span>
                )}
              </div>

              {hasClasses ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {scheduleDay.classes.map((cls, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--surface-alt)',
                        borderRadius: 'var(--radius)',
                        padding: '14px 16px',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <div>
                        <div className="flex-between" style={{ marginBottom: '6px' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: 'var(--primary)',
                              background: '#fff',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border)',
                            }}
                          >
                            {cls.type}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.35 }}>
                          {cls.course}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} color="var(--primary)" />
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cls.time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="#ef4444" />
                          <span>{cls.room}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Tidak ada jadwal kuliah tatap muka. Waktu luang untuk asistensi praktikum atau pengerjaan proyek mandiri.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

