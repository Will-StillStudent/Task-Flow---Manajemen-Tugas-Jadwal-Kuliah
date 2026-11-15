# TaskFlow Teknik - Manajemen Tugas & Jadwal Kuliah PWA

Aplikasi Progressive Web App (PWA) modern untuk manajemen tugas perkuliahan, laporan praktikum, proyek, dan jadwal kuliah mingguan mahasiswa. Terintegrasi dengan database cloud Supabase.

---

## 📱 Fitur Utama

1. **Navigasi Responsif (4 Halaman)**:
   - **Header Navigasi di Desktop** & **Bottom Navigation Bar di Mobile** untuk kenyamanan navigasi di semua ukuran layar.
   - **Halaman 1: Daftar Tugas (CRUD Utama)**:
     - **Tambah Tugas**: Form modal lengkap dengan Judul Tugas, Pilihan Mata Kuliah, Kategori (Tugas Teori / Laporan Praktikum / Proyek), Tanggal Deadline, Prioritas (Tinggi / Sedang / Rendah), dan Catatan.
     - **Pencarian & Filter**: Pencarian real-time (*search bar*), filter Mata Kuliah, filter Status (*Semua / Belum Selesai / Selesai*), dan pengurutan berdasarkan Deadline, Prioritas, atau Judul.
     - **Update & Delete**: Tombol centang sekali klik untuk toggle status selesai/belum selesai, tombol Edit untuk mengubah isi tugas, dan tombol Hapus dengan modal konfirmasi.
     - **Sinkronisasi**: Tombol Refresh untuk mengambil data terbaru dan tombol Reset Dummy untuk memulihkan 11 tugas awal.
   - **Halaman 2: Jadwal Kuliah**:
     - Menampilkan jadwal mata kuliah mingguan (Senin - Sabtu) yang dikelompokkan per hari, lengkap dengan jam, ruangan, dan tipe perkuliahan.
   - **Halaman 3: Prioritas & Statistik**:
     - Ringkasan statistik (Total Tugas, Tugas Belum Selesai, Tugas Selesai, Prioritas Tinggi, Persentase Progres Penyelesaian).
     - Daftar khusus tugas berprioritas **"Tinggi"** yang mendekati deadline secara terurut.
   - **Halaman 4: Profil Kelompok**:
     - Menampilkan kartu identitas Kelompok 24 Praktikum PPB (nama dan NIM) beserta fitur salin NIM.

2. **Dukungan Cloud Database & Mode Offline**:
   - Terhubung dengan database cloud Supabase untuk sinkronisasi data antar perangkat.
   - Dukungan **Offline-First Resilience**: Data otomatis di-cache ke penyimpanan lokal perangkat sehingga aplikasi tetap berfungsi normal saat koneksi terputus.

3. **PWA Standalone & Installable**:
   - Service Worker Workbox untuk pre-caching seluruh aset statis.
   - Web App Manifest (`manifest.webmanifest`) dengan ikon standar dan maskable.
   - Banner prompt instalasi otomatis di perangkat Android, iOS, maupun Desktop.

---

## 🛠️ Stack Teknologi

- **Frontend**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite 8 (`vite`, `@vitejs/plugin-react`)
- **PWA Tool**: `vite-plugin-pwa` (Workbox)
- **Database / API**: Supabase (PostgREST REST API & Axios)
- **Icons**: `lucide-react`
- **Styling**: CSS Variables & Responsive Layout

---

## 💻 Panduan Instalasi & Penggunaan

### 1. Clone Repositori & Install Dependencies
```bash
git clone https://github.com/Will-StillStudent/Task-Flow---Manajemen-Tugas-Jadwal-Kuliah.git
cd Task-Flow---Manajemen-Tugas-Jadwal-Kuliah
npm install
```

### 2. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi Supabase Anda di dalam `.env`:
```env
VITE_API_BASE_URL=https://<project-id-anda>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key-anda>
```

### 3. Setup Database (Opsional)
Jika menggunakan project Supabase baru, jalankan skrip SQL yang tersedia pada file [`supabase_schema.sql`](./supabase_schema.sql) di menu **SQL Editor** pada dashboard Supabase Anda untuk membuat tabel `tasks` beserta data awalnya.

### 4. Menjalankan Aplikasi
Jalankan development server:
```bash
npm run dev
```
Akses `http://localhost:5173/` di browser Anda.

### 5. Build Produksi & Preview PWA
```bash
npm run build
npm run preview
```
