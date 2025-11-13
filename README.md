# ProxVuln

**Vulnerability Management & Reporting Tool** - Aplikasi modern untuk manajemen dan pelaporan temuan kerentanan dari penetration testing.

> ⚡ **Client-side only** - Tidak ada database, semua data disimpan di browser memory dan otomatis dihapus setelah 1 jam.

## 🚀 Quick Start

```bash
# Clone & Install
git clone https://github.com/gethuksec/ProxVuln.git
cd ProxVuln
npm install

# Run
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## ✨ Fitur Utama

- 📥 **Import CSV/Excel** - Upload multiple files dengan drag & drop
- 📊 **Dashboard & Visualisasi** - Executive summary, risk charts, timeline
- 🔍 **Tabel Temuan** - Excel-like view dengan filter & search
- 📄 **Export PDF/HTML** - Report profesional dengan watermark
- 🎨 **Dark Mode** - Toggle light/dark theme
- 📋 **Template Generator** - Download template dengan 10 contoh temuan OWASP Top 10

## 🛠️ Tech Stack

Next.js 14+ | TypeScript | shadcn/ui | Tailwind CSS | Zustand | Recharts | jsPDF

## 📦 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Atau import langsung dari GitHub di [vercel.com](https://vercel.com)

### Docker

```bash
docker build -t proxvuln .
docker run -p 3000:3000 proxvuln
```

**Update `next.config.js`:**
```javascript
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
}
```

### Self-hosted

```bash
npm run build
npm start
```

### Railway / Netlify

Auto-detect Next.js, tidak perlu konfigurasi tambahan.

## 📝 Format File

**CSV/Excel dengan delimiter semicolon (`;`)**

Kolom utama:
- `No.` - ID Vulnerability (TE-01, dll)
- `Nama Kerentanan` - Nama temuan
- `OWASP Risk Rating` - Vector string (format: `vector=(SL:2/M:3/...)`)
- `KI, DI, RI` - Kemungkinan, Dampak, Risiko Inheren
- `KR, DR, RR` - Kemungkinan, Dampak, Risiko Residual
- `Status Mitigasi` - Open, Parsial, Closed
- `Deskripsi`, `Rekomendasi/Mitigasi`, dll

> 💡 **Download template** dari halaman upload untuk melihat format lengkap dengan 10 contoh temuan OWASP Top 10.

## 🎯 Cara Pakai

1. **Download Template** - Klik tombol download di halaman upload
2. **Isi Data** - Gunakan template sebagai referensi
3. **Upload File** - Drag & drop CSV/Excel ke area upload
4. **Lihat Dashboard** - Analisis visualisasi dan statistik
5. **Export Report** - Download PDF atau HTML untuk presentasi

## 📊 Risk Calculation

Menggunakan **OWASP Risk Rating Methodology**:
- **KI, DI, RI** dihitung dari OWASP vector string
- **Risk Matrix**: Kemungkinan × Dampak = Risiko
- **Inheren vs Residual**: Perbandingan sebelum dan setelah remediasi

Risk Levels: **Critical** (Ungu) | **High** (Merah) | **Medium** (Orange) | **Low** (Kuning)

## 🔒 Keamanan

- ✅ No server-side storage
- ✅ Auto-cleanup setelah 1 jam
- ✅ Session-based (hilang saat browser ditutup)
- ✅ Client-side processing only

## 📁 Struktur Proyek

```
├── app/              # Next.js pages
├── components/       # React components
├── lib/             # Core logic (parser, calculator, generator)
├── store/           # Zustand store (in-memory)
└── types/           # TypeScript types
```

## 🛠️ Development

```bash
npm run dev      # Development
npm run build    # Build
npm start        # Production
npm run lint     # Lint
```

## 📄 Lisensi

Copyright (c) 2024 ProxVuln. All rights reserved.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**
