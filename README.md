# ProxVuln - Vulnerability Management & Reporting Tool

Aplikasi modern untuk manajemen dan pelaporan temuan kerentanan dari penetration testing. Aplikasi ini dirancang khusus untuk presentasi dan pelaporan saja - **tidak ada penyimpanan database permanen** karena alasan keamanan.

## 🎯 Fitur Utama

### 📥 Import & Template
- **Multi-format Import**: Upload file CSV atau Excel (.xlsx/.xls) dengan drag & drop
- **Multiple Files**: Support upload multiple files sekaligus
- **Template Generator**: Download template CSV dan Excel dengan **10 contoh temuan OWASP Top 10**
- **Robust Parser**: Parser yang adaptif, menangani multi-line cells, empty values, dan format bervariasi
- **Auto-validation**: Validasi otomatis dengan error handling yang informatif

### 📊 Dashboard & Visualisasi
- **Executive Summary**: Ringkasan eksekutif dengan key metrics dan statistik
- **Quick Stats**: Statistik cepat (Critical & High, Risk Reduction, Remediated, Progress)
- **Risk Distribution**: Pie chart distribusi risk level (filtered, tanpa nilai 0)
- **Risk Comparison**: Bar chart perbandingan risiko inheren vs residual
- **Risk Heatmap**: Visualisasi heatmap vulnerabilities berdasarkan risk level
- **Remediation Timeline**: Timeline progress remediasi dengan status tracking
- **Risk Reduction Metrics**: Metrik pengurangan risiko dari inheren ke residual

### 🔍 Data Management
- **Vulnerability Table**: Tabel lengkap dengan filter, search, dan sorting
- **Excel View**: Tampilan tabel Excel-like dengan sorting dan filtering (Tabel Temuan)
- **Detail View**: Tampilan detail vulnerability dengan informasi lengkap
- **OWASP Risk Vector**: Visualisasi OWASP risk vector dengan radar chart dan bar charts
- **MSTG/WSTG Links**: Referensi clickable ke OWASP Web Security Testing Guide

### 📄 Export & Reporting
- **PDF Export**: 
  - Executive summary dengan narasi lengkap dan formatting profesional
  - Detailed vulnerabilities per page
  - Watermark dengan unique workbook ID (semi-transparent)
  - Background biru elegan
  - Bold text formatting untuk key information
- **HTML Export**: Standalone HTML file dengan responsive design dan watermark

### 🎨 UI/UX Features
- **Dark Mode**: Toggle antara light dan dark theme dengan persistensi
- **Responsive Design**: Optimized untuk desktop, tablet, dan mobile
- **Color Coding**: 
  - Risk levels: Critical (Ungu muda), High (Merah agak muda), Medium (Orange muda), Low (Kuning muda)
  - Status: Open (Merah), Parsial (Amber), Closed (Hijau)
  - KI/DI/RI/KR/DR/RR: Color-coded untuk kemudahan visualisasi
- **Smooth Animations**: Transitions dan hover effects
- **Interactive Charts**: Tooltips, legends, dan filtering (nilai 0 otomatis di-filter)

### ⏰ Data Management
- **Auto-cleanup**: Data otomatis dihapus setelah 1 jam (dapat dikonfigurasi)
- **Session-based**: Data hilang saat browser ditutup
- **Expiration Timer**: Countdown timer untuk setiap workbook
- **No Server Storage**: Semua data disimpan di browser memory

### 🧮 Risk Calculation
- **OWASP Risk Rating Methodology**: Perhitungan berdasarkan OWASP Risk Rating Methodology
- **Dynamic Calculation**: KI, DI, RI dihitung dari OWASP vector string
- **Risk Matrix**: Matrix calculation (Kemungkinan x Dampak = Risiko)
- **Inheren vs Residual**: Perbandingan risiko inheren (KI, DI, RI) dan residual (KR, DR, RR)
- **Risk Reduction**: Perhitungan pengurangan risiko dari inheren ke residual

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router) dengan TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand (in-memory caching dengan auto-cleanup)
- **CSV Processing**: PapaParse (robust parsing dengan error handling)
- **Excel Processing**: xlsx (support .xlsx dan .xls)
- **Charts**: Recharts (PieChart, BarChart, RadarChart)
- **PDF Export**: jsPDF + jspdf-autotable
- **HTML Export**: Custom HTML generator
- **Icons**: Lucide React
- **File Upload**: React Dropzone
- **Theme**: next-themes (dark mode dengan persistensi)

## 📦 Instalasi

### Prerequisites

- Node.js 18+ atau lebih baru
- npm, yarn, atau pnpm

### Setup Lokal

1. **Clone repository:**
```bash
git clone <repository-url>
cd worksheet-vulnerability-management
```

2. **Install dependencies:**
```bash
npm install
# atau
pnpm install
# atau
yarn install
```

3. **Jalankan development server:**
```bash
npm run dev
# atau
pnpm dev
# atau
yarn dev
```

4. **Buka browser di [http://localhost:3000](http://localhost:3000)**

## 🚀 Deployment

### Vercel (Recommended)

Vercel adalah platform yang paling mudah untuk deploy Next.js aplikasi:

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

Atau langsung push ke GitHub dan import project di [vercel.com](https://vercel.com)

3. **Environment Variables** (jika diperlukan):
   - Tidak ada environment variables yang diperlukan untuk aplikasi ini
   - Semua data disimpan di client-side

### Docker

1. **Buat Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

2. **Update next.config.js untuk output standalone:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
}

module.exports = nextConfig
```

3. **Build dan run:**
```bash
docker build -t proxvuln .
docker run -p 3000:3000 proxvuln
```

### Netlify

1. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Build command:**
```bash
npm run build
```

3. **Publish directory:**
```
.next
```

4. **Deploy:**
```bash
netlify deploy --prod
```

### Self-hosted (Node.js)

1. **Build aplikasi:**
```bash
npm run build
```

2. **Start production server:**
```bash
npm start
```

3. **Setup dengan PM2 (optional):**
```bash
npm install -g pm2
pm2 start npm --name "proxvuln" -- start
pm2 save
pm2 startup
```

### Railway

1. **Connect GitHub repository ke Railway**
2. **Railway akan otomatis detect Next.js dan deploy**
3. **Tidak perlu konfigurasi tambahan**

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
- **MSTG /WSTG**: Referensi standar testing (MSTG/WSTG codes) - clickable links
- **Jalur lokasi terdampak**: Lokasi atau endpoint yang terdampak
- **OWASP Risk Rating**: Vector string OWASP (format: `vector=(SL:2/M:3/O:3/...)`)
- **Objek terdampak**: Objek yang terdampak (e.g., Web, Mobile, API)
- **KI, DI, RI**: Initial ratings (Kemungkinan, Dampak, Risiko Inheren) - dihitung dari vector atau manual
- **KR, DR, RR**: Retest ratings (Kemungkinan, Dampak, Risiko Residual) - hanya untuk yang Closed
- **Deskripsi**: Penjelasan detail kerentanan
- **Rekomendasi/Mitigasi**: Langkah-langkah mitigasi (support multi-line)
- **PJ**: Person in Charge
- **Tenggat**: Deadline mitigasi
- **Status Mitigasi**: Status (Open, Parsial, Closed)
- **Retest #1, Retest #2**: Status retest (Open/Closed)

> 💡 **Tip**: Download template CSV atau Excel dari halaman upload untuk melihat contoh format yang benar dengan **10 temuan OWASP Top 10**.

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
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── theme-toggle.tsx
│   │   └── mstg-wstg-links.tsx
│   ├── import/                  # File upload & template download
│   │   ├── FileUploader.tsx
│   │   └── TemplateDownloadButton.tsx
│   ├── dashboard/               # Dashboard components
│   │   ├── ExecutiveSummary.tsx
│   │   ├── WorkbookList.tsx
│   │   ├── StatsCard.tsx
│   │   └── ExpirationTimer.tsx
│   ├── workbook/                # Workbook visualization components
│   │   ├── QuickStats.tsx
│   │   ├── RiskChart.tsx
│   │   ├── RiskComparisonChart.tsx
│   │   ├── RiskHeatmap.tsx
│   │   ├── RemediationTimeline.tsx
│   │   ├── RiskReductionMetrics.tsx
│   │   ├── VulnerabilityTable.tsx
│   │   └── ExcelView.tsx
│   ├── vulnerability/           # Vulnerability detail components
│   │   ├── DetailCard.tsx
│   │   ├── RiskVectorChart.tsx
│   │   └── RecommendationList.tsx
│   └── export/                  # Export dialog components
│       └── ExportDialog.tsx
├── lib/                         # Core libraries
│   ├── csv-parser.ts           # CSV parsing logic (robust, adaptive)
│   ├── excel-parser.ts         # Excel parsing logic
│   ├── owasp-risk-calculator.ts # OWASP Risk Rating Methodology calculator
│   ├── risk-calculator.ts      # Risk calculation & workbook stats
│   ├── pdf-generator.ts        # PDF export functionality
│   ├── html-generator.ts       # HTML export functionality
│   ├── template-generator.ts   # CSV/Excel template generator (10 temuan)
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
- Template berisi **10 contoh temuan OWASP Top 10** dengan format yang benar
- Setiap temuan memiliki:
  - OWASP vector string yang valid
  - KI, DI, RI yang dihitung dari vector
  - Deskripsi dan rekomendasi yang realistis
  - Status bervariasi (Open, Parsial, Closed)
  - WSTG references yang clickable
- Gunakan sebagai referensi saat mengisi data vulnerability

### 2. Import File

- Drag & drop file CSV atau Excel ke area upload atau klik untuk memilih file
- Multiple files didukung
- Progress indicator untuk setiap file
- Validasi otomatis dan error handling yang informatif
- Parser adaptif yang menangani:
  - Multi-line cells
  - Empty atau missing values
  - Header variations
  - Format inconsistencies
- Data akan otomatis dihapus setelah 1 jam

### 3. Dashboard

- Lihat daftar semua workbook yang sudah diimport
- Quick stats: total vulnerabilities, progress, risk distribution
- Timer countdown sampai data expired
- Dark mode toggle
- Export options (PDF, HTML)

### 4. Workbook Detail

- **Executive Summary**: Ringkasan eksekutif dengan key metrics dan narasi
- **Quick Stats**: Statistik cepat (Critical & High, Risk Reduction, Remediated, Progress)
- **Risk Distribution**: Pie chart distribusi risk level (nilai 0 otomatis di-filter)
- **Risk Comparison**: Bar chart perbandingan risiko inheren vs residual
- **Remediation Timeline**: Timeline progress remediasi dengan status tracking
- **Risk Heatmap**: Visualisasi heatmap vulnerabilities berdasarkan risk level
- **Risk Reduction Metrics**: Metrik pengurangan risiko dari inheren ke residual
- **Vulnerability Table**: Tabel lengkap dengan filter dan search
- **Excel View (Tabel Temuan)**: Tampilan tabel Excel-like dengan sorting dan filtering
- **Export**: Export ke PDF atau HTML

### 5. Vulnerability Detail

- Informasi lengkap vulnerability
- OWASP Risk Vector visualization (radar chart + bar charts)
- Rekomendasi dan mitigasi (formatted dengan line breaks)
- Timeline initial → mitigation → retest
- MSTG/WSTG links (clickable ke OWASP guide)
- Export individual vulnerability ke PDF

### 6. Export Report

- **PDF Export**: 
  - Executive summary dengan narasi lengkap dan formatting profesional
  - Detailed vulnerabilities per page
  - Watermark dengan unique workbook ID (semi-transparent, melintang di tengah)
  - Background biru elegan
  - Bold text formatting untuk key information
  - Tidak ada halaman kosong di antara temuan
  
- **HTML Export**:
  - Standalone HTML file
  - Responsive design
  - Watermark dengan unique workbook ID
  - Siap untuk presentasi atau sharing

## 🔒 Keamanan

- ✅ **No Server-side Storage**: Semua data disimpan di browser memory
- ✅ **Auto-cleanup**: Data otomatis dihapus setelah 1 jam (default, dapat dikonfigurasi)
- ✅ **Session-based**: Data hilang saat browser ditutup
- ✅ **No External API**: Tidak ada pengiriman data ke server eksternal
- ✅ **Client-side Only**: Semua processing dilakukan di browser
- ✅ **No Database**: Tidak ada koneksi database atau penyimpanan permanen

## 🎨 Fitur UI/UX

- **Dark Mode**: Toggle antara light dan dark theme dengan persistensi
- **Responsive Design**: Optimized untuk desktop, tablet, dan mobile
- **Smooth Animations**: Transitions dan hover effects
- **Color Coding**: 
  - Risk levels: Critical (Ungu muda), High (Merah agak muda), Medium (Orange muda), Low (Kuning muda)
  - Status: Open (Merah), Parsial (Amber), Closed (Hijau)
  - KI/DI/RI/KR/DR/RR: Color-coded untuk kemudahan visualisasi
- **Interactive Charts**: Tooltips, legends, dan filtering (nilai 0 otomatis di-filter)
- **Excel-like Table**: Tampilan tabel dengan sorting dan filtering
- **Card Positioning**: Spacing dan layout yang nyaman untuk readability

## 📊 Risk Calculation

### Risk Levels

- **Critical (Kritis)**: Score 4
- **High (Tinggi)**: Score 3
- **Medium (Sedang)**: Score 2
- **Low (Rendah)**: Score 1

### Risk Calculation Logic

1. **OWASP Risk Rating Methodology**: 
   - Perhitungan berdasarkan OWASP Risk Rating Methodology
   - Threat Agent Factors: Skill Level, Motive, Opportunity, Size
   - Vulnerability Factors: Ease of Discovery, Ease of Exploit, Awareness, Intrusion Detection
   - Technical Impact: Loss of Confidentiality, Integrity, Availability, Accountability
   - Business Impact: Financial damage, Reputation damage, Non-compliance, Privacy violation

2. **Dynamic Calculation**: 
   - KI, DI, RI dihitung dari OWASP vector string jika tersedia
   - Fallback ke nilai manual jika vector tidak valid

3. **Risk Matrix**: 
   - Kemungkinan (KI) x Dampak (DI) = Risiko (RI)
   - RI adalah Risk Level langsung (bukan perhitungan terpisah)

4. **Risk Inheren vs Residual**: 
   - Risk Inheren: SELALU dari KI, DI, RI (initial ratings)
   - Risk Residual: Dari KR, DR, RR (retest ratings) - hanya jika ada nilai
   - Risk Reduction: Dihitung dari perbedaan inheren vs residual

### OWASP Risk Rating Format

```
vector=(SL:2/M:3/O:3/S:3/ED:7/EE:5/A:3/ID:7/LC:1/LI:1/LAV:1/LAC:1/FD:1/RD:2/NC:1/PV:1)
```

**Faktor-faktor:**
- **SL**: Skill Level (1-9)
- **M**: Motive (1-9)
- **O**: Opportunity (1-9)
- **S**: Size (1-9)
- **ED**: Ease of Discovery (1-9)
- **EE**: Ease of Exploit (1-9)
- **A**: Awareness (1-9)
- **ID**: Intrusion Detection (1-9)
- **LC**: Loss of Confidentiality (1-9)
- **LI**: Loss of Integrity (1-9)
- **LAV**: Loss of Availability (1-9)
- **LAC**: Loss of Accountability (1-9)
- **FD**: Financial Damage (1-9)
- **RD**: Reputation Damage (1-9)
- **NC**: Non-compliance (1-9)
- **PV**: Privacy Violation (1-9)

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

### Environment Variables

Tidak ada environment variables yang diperlukan. Aplikasi ini fully client-side.

## 📋 Catatan Penting

- Data hanya disimpan di memory browser
- Data akan otomatis dihapus setelah 1 jam (default)
- Refresh browser akan menghapus semua data
- Gunakan export PDF/HTML untuk backup data penting
- Template CSV/Excel tersedia dengan 10 contoh temuan OWASP Top 10
- Parser adaptif menangani berbagai format CSV/Excel
- Nilai 0 otomatis di-filter dari charts untuk readability

## 🤝 Kontribusi

Proyek ini adalah proprietary software. Untuk kontribusi atau pertanyaan, silakan hubungi pemilik repository.

## 📄 Lisensi

Copyright (c) 2024 ProxVuln. All rights reserved.

Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

**ProxVuln** - Vulnerability Management & Reporting Tool

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
