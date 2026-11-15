-- ========================================================================
-- Schema Database Supabase untuk Responsi Modul 5 (TaskFlow Teknik)
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda
-- ========================================================================

-- 1. Buat Tabel tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    course TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Tugas Teori',
    deadline TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Sedang',
    status TEXT NOT NULL DEFAULT 'Belum Selesai',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 3. Buat Policy agar anon/public dapat melakukan CRUD (Read, Insert, Update, Delete)
-- Mirip dengan konfigurasi API pada folder PWA2_PrakPPB
DROP POLICY IF EXISTS "Public access policy for tasks" ON public.tasks;

CREATE POLICY "Public access policy for tasks"
ON public.tasks
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. Aktifkan realtime (opsional, jika ingin mendengarkan perubahan secara live)
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- 5. Masukkan Data Awal (Dummy 11 Tugas)
INSERT INTO public.tasks (id, title, course, category, deadline, priority, status, notes, created_at)
VALUES
('task-1', 'Menyusun Dokumen WBS & Gantt Chart', 'Manajemen Proyek TI', 'Proyek', '2026-11-18', 'Tinggi', 'Belum Selesai', 'Pembagian hierarki deliverable proyek aplikasi mobile dan estimasi waktu per milestone.', '2026-11-01T08:00:00.000Z'),
('task-2', 'Implementasi Metode Newton-Raphson dengan Python', 'Metode Numerik', 'Tugas Teori', '2026-11-20', 'Sedang', 'Belum Selesai', 'Buat script kalkulasi akar persamaan non-linier dan sertakan grafik konvergensi.', '2026-11-02T09:30:00.000Z'),
('task-3', 'Simulasi Antarmuka LCD & Keypad 4x4', 'Teknik Mikroprosesor dan Antarmuka', 'Laporan Praktikum', '2026-11-12', 'Tinggi', 'Selesai', 'Wiring pada simulator Proteus dan kode program inisialisasi pin mikrokontroler.', '2026-11-03T11:00:00.000Z'),
('task-4', 'Integrasi Sensor DHT11 ke Broker MQTT', 'Internet of Things (IoT)', 'Proyek', '2026-11-21', 'Tinggi', 'Belum Selesai', 'Kirim payload JSON suhu & kelembapan ke topic Mosquitto dengan QoS 1.', '2026-11-04T13:15:00.000Z'),
('task-5', 'Analisis Transformasi Fourier Sinyal Diskrit', 'Sinyal dan Sistem', 'Tugas Teori', '2026-11-22', 'Sedang', 'Belum Selesai', 'Perhitungan manual DTFT dari 4 sampel sinyal periodik dan visualisasi spektrum frekuensi.', '2026-11-05T10:00:00.000Z'),
('task-6', 'Program Aritmatika Register 8086', 'Bahasa Pemrograman Rakitan', 'Tugas Teori', '2026-11-10', 'Rendah', 'Selesai', 'Instruksi ADD, SUB, MUL, dan DIV menggunakan emu8086.', '2026-11-06T14:45:00.000Z'),
('task-7', 'Konfigurasi Auto-Scaling & Load Balancer GCP', 'Infrastruktur Awan (Cloud Infrastructure)', 'Laporan Praktikum', '2026-11-24', 'Tinggi', 'Belum Selesai', 'Setup Instance Group berbasis CPU utilization threshold 70% dan forwarding rule.', '2026-11-07T16:20:00.000Z'),
('task-8', 'Studi Kasus Inheritance & Polymorphism Java', 'Pemrograman Berorientasi Objek (N)', 'Tugas Teori', '2026-11-14', 'Sedang', 'Selesai', 'Diagram kelas UML sistem manajemen inventaris dan override method displayInfo().', '2026-11-08T08:30:00.000Z'),
('task-9', 'Desain UI/UX Aplikasi Mobile Responsif', 'Pemrograman Perangkat Bergerak', 'Proyek', '2026-11-26', 'Sedang', 'Belum Selesai', 'High-fidelity wireframe di Figma dengan sistem navigasi mobile bottom bar dan dark mode.', '2026-11-09T12:00:00.000Z'),
('task-10', 'Esai Analisis Ketahanan Nasional di Era Digital', 'Kewarganegaraan', 'Tugas Teori', '2026-11-15', 'Rendah', 'Selesai', 'Analisis tantangan kedaulatan siber dan ancaman disinformasi media sosial.', '2026-11-10T15:10:00.000Z'),
('task-11', 'Laporan Praktikum Modul 5 & Deploy PWA ke Vercel', 'Praktikum Pemrograman Perangkat Bergerak', 'Laporan Praktikum', '2026-11-19', 'Tinggi', 'Belum Selesai', 'Konfigurasi Service Worker, audit Lighthouse PWA score 100, dan dokumentasi responsi.', '2026-11-11T17:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

