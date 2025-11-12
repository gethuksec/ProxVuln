# ProxVuln - Vulnerability Management & Reporting Tool

Aplikasi modern untuk manajemen dan pelaporan temuan kerentanan dari penetration testing. Aplikasi ini dirancang khusus untuk presentasi dan pelaporan saja - **tidak ada penyimpanan database permanen** karena alasan keamanan.

## 🎯 Fitur Utama

- 📊 **Import File**: Upload multiple file CSV atau Excel (.xlsx/.xls) dengan drag & drop
- 📈 **Visualisasi Data**: Chart distribusi risk, perbandingan inheren vs residual, timeline remediasi
- 🔍 **Pencarian & Filter**: Cari dan filter vulnerabilities berdasarkan risk level, status, dan keyword
- 📄 **Detail Lengkap**: Tampilan detail vulnerability dengan OWASP risk vector visualization
- 📑 **Export Report**: Export ke PDF dan HTML dengan watermark dan formatting profesional
- ⏰ **Auto-cleanup**: Data otomatis dihapus setelah 1 jam (dapat dikonfigurasi)
- 🎨 **UI Modern**: Desain profesional dengan dark mode support
- 📋 **Template Download**: Download template CSV dan Excel dengan contoh data

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router) dengan TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand (in-memory caching)
- **CSV Processing**: PapaParse
- **Excel Processing**: xlsx
- **Charts**: Recharts
- **PDF Export**: jsPDF + jspdf-autotable
- **Icons**: Lucide React
- **File Upload**: React Dropzone
- **Theme**: next-themes (dark mode)

## 📦 Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd worksheet-vulnerability-management
```

2. Install dependencies:
```bash
npm install
# atau
pnpm install
```

3. Jalankan development server:
```bash
npm run dev
# atau
pnpm dev
```

4. Buka browser di [http://localhost:3000](http://localhost:3000)

## 📝 Format File

### CSV Format

File CSV harus menggunakan delimiter semicolon (`;`) dengan struktur berikut:

```csv
No.;Nama Kerentanan;MSTG /WSTG;Jalur lokasi terdampak;OWASP Risk Rating;Objek terdampak;KI;DI;RI;Deskripsi;Rekomendasi/Mitigasi;PJ;Tenggat;Status Mitigasi;Keterangan remediasi;New Endpoint;KR;DR;RR;Keterangan Retest;Retest #1;Klasifikasi Temuan;Retest #2
```

### Excel Format

File Excel (.xlsx/.xls) harus memiliki format yang sama dengan CSV, dengan delimiter semicolon (`;`) untuk kompatibilitas.

### Kolom Utama:

- **No.**: ID Vulnerability (e.g., TE-01) - **Required**
- **Nama Kerentanan**: Nama kerentanan
- **MSTG /WSTG**: Referensi standar testing (MSTG/WSTG codes)
- **Jalur lokasi terdampak**: Lokasi atau endpoint yang terdampak
- **OWASP Risk Rating**: Vector string OWASP (format: `vector=(SL:2/M:3/O:3/...)`)
- **Objek terdampak**: Objek yang terdampak (e.g., Web, Mobile, API)
- **KI, DI, RI**: Initial ratings (Kemungkinan, Dampak, Risiko Inheren) - 1-9 scale
- **KR, DR, RR**: Retest ratings (Kemungkinan, Dampak, Risiko Residual) - 1-9 scale
- **Deskripsi**: Penjelasan detail kerentanan
- **Rekomendasi/Mitigasi**: Langkah-langkah mitigasi
- **PJ**: Person in Charge
- **Tenggat**: Deadline mitigasi
- **Status Mitigasi**: Status (Open, In Progress, Closed)
- **Retest #1**: Status retest (Open/Closed)

> 💡 **Tip**: Download template CSV atau Excel dari halaman upload untuk melihat contoh format yang benar.

## 📁 Struktur Proyek

```
worksheet-vulnerability-management/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout dengan theme provider
│   ├── page.tsx                 # Dashboard/home page
│   ├── workbook/[id]/           # Workbook detail page
│   └── vulnerability/[id]/      # Vulnerability detail page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── import/                  # File upload & template download
│   ├── dashboard/               # Dashboard components
│   ├── workbook/                # Workbook visualization components
│   ├── vulnerability/           # Vulnerability detail components
│   └── export/                  # Export dialog components
├── lib/                         # Core libraries
│   ├── csv-parser.ts           # CSV parsing logic (robust)
│   ├── excel-parser.ts         # Excel parsing logic
│   ├── risk-calculator.ts      # Risk calculation & workbook stats
│   ├── pdf-generator.ts        # PDF export functionality
│   ├── html-generator.ts       # HTML export functionality
│   ├── template-generator.ts   # CSV/Excel template generator
│   └── utils.ts                # Utility functions
├── store/                       # Zustand stores
│   └── vuln-store.ts           # In-memory data store dengan auto-cleanup
├── types/                       # TypeScript type definitions
│   └── vulnerability.ts        # Vulnerability & Workbook types
└── utils/                       # Helper functions
    ├── date-helpers.ts         # Date formatting utilities
    ├── formatters.ts           # Risk level & status formatters
    └── wstg-mapper.ts          # WSTG/MSTG URL mapping
```

## 🚀 Penggunaan

### 1. Download Template

- Klik tombol "Download CSV Template" atau "Download Excel Template" di halaman upload
- Template berisi contoh 1 temuan dengan format yang benar
- Gunakan sebagai referensi saat mengisi data vulnerability

### 2. Import File

- Drag & drop file CSV atau Excel ke area upload atau klik untuk memilih file
- Multiple files didukung
- Progress indicator untuk setiap file
- Validasi otomatis dan error handling
- Data akan otomatis dihapus setelah 1 jam

### 3. Dashboard

- Lihat daftar semua workbook yang sudah diimport
- Quick stats: total vulnerabilities, progress, risk distribution
- Timer countdown sampai data expired
- Dark mode toggle

### 4. Workbook Detail

- **Executive Summary**: Ringkasan eksekutif dengan key metrics
- **Quick Stats**: Statistik cepat (Critical & High, Risk Reduction, Remediated, Progress)
- **Risk Distribution**: Pie chart distribusi risk level
- **Risk Comparison**: Bar chart perbandingan risiko inheren vs residual
- **Remediation Timeline**: Timeline progress remediasi
- **Risk Heatmap**: Visualisasi heatmap vulnerabilities
- **Vulnerability Table**: Tabel lengkap dengan filter dan search
- **Excel View**: Tampilan tabel Excel-like dengan sorting dan filtering
- **Export**: Export ke PDF atau HTML

### 5. Vulnerability Detail

- Informasi lengkap vulnerability
- OWASP Risk Vector visualization (radar chart + bar charts)
- Rekomendasi dan mitigasi
- Timeline initial → mitigation → retest
- MSTG/WSTG links (clickable)

### 6. Export Report

- **PDF Export**: 
  - Executive summary dengan narasi lengkap
  - Detailed vulnerabilities
  - Watermark dengan unique workbook ID
  - Background biru elegan
  - Formatting profesional dengan bold text
  
- **HTML Export**:
  - Standalone HTML file
  - Responsive design
  - Watermark dengan unique workbook ID
  - Siap untuk presentasi atau sharing

## 🔒 Keamanan

- ✅ **No Server-side Storage**: Semua data disimpan di browser memory
- ✅ **Auto-cleanup**: Data otomatis dihapus setelah 1 jam (default)
- ✅ **Session-based**: Data hilang saat browser ditutup
- ✅ **No External API**: Tidak ada pengiriman data ke server eksternal
- ✅ **Client-side Only**: Semua processing dilakukan di browser

## 🎨 Fitur UI/UX

- **Dark Mode**: Toggle antara light dan dark theme
- **Responsive Design**: Optimized untuk desktop, tablet, dan mobile
- **Smooth Animations**: Transitions dan hover effects
- **Color Coding**: 
  - Risk levels: Critical (Ungu), High (Merah), Medium (Orange), Low (Kuning)
  - Status: Open (Merah), In Progress (Amber), Closed (Hijau)
- **Interactive Charts**: Tooltips, legends, dan filtering
- **Excel-like Table**: Tampilan tabel dengan sorting dan filtering

## 📊 Risk Calculation

### Risk Levels

- **Critical**: Score 4
- **High**: Score 3
- **Medium**: Score 2
- **Low**: Score 1

### Risk Calculation Logic

1. **Calculated Risk**: Dari OWASP vector (jika ada) atau KI/DI/RI
2. **Risk Inheren**: SELALU dari KI, DI, RI (initial ratings)
3. **Risk Residual**: Dari KR, DR, RR (retest ratings) - hanya jika ada nilai
4. **Risk Reduction**: Dihitung dari perbedaan inheren vs residual

### OWASP Risk Rating Format

```
vector=(SL:2/M:3/O:3/S:3/ED:7/EE:5/A:3/ID:7/LC:1/LI:1/LAV:1/LAC:1/FD:1/RD:2/NC:1/PV:1)
```

## 🛠️ Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

## 📋 Catatan Penting

- Data hanya disimpan di memory browser
- Data akan otomatis dihapus setelah 1 jam (default)
- Refresh browser akan menghapus semua data
- Gunakan export PDF/HTML untuk backup data penting
- Template CSV/Excel tersedia untuk memastikan format yang benar

## 🤝 Kontribusi

Proyek ini adalah proprietary software. Untuk kontribusi atau pertanyaan, silakan hubungi pemilik repository.

## 📄 Lisensi

Copyright (c) 2024 ProxVuln. All rights reserved.

Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

**ProxVuln** - Vulnerability Management & Reporting Tool
