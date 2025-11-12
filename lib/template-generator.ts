import * as XLSX from "xlsx";

/**
 * Generate CSV template dengan contoh data
 */
export function generateCSVTemplate(): string {
  const headers = [
    "No.",
    "Nama Kerentanan",
    "MSTG /WSTG",
    "Jalur lokasi terdampak",
    "OWASP Risk Rating",
    "Objek terdampak",
    "KI",
    "DI",
    "RI",
    "Deskripsi",
    "Rekomendasi/Mitigasi",
    "PJ",
    "Tenggat",
    "Status Mitigasi",
    "Keterangan remediasi",
    "New Endpoint",
    "KR",
    "DR",
    "RR",
    "Keterangan Retest",
    "Retest #1",
    "Klasifikasi Temuan",
    "Retest #2"
  ];

  // Contoh data dengan 1 temuan
  const exampleRow = [
    "TE-01",
    "HSTS Header not implemented",
    "CONF-07",
    "Objek#1",
    "vector=(SL:2/M:3/O:3/S:3/ED:7/EE:5/A:3/ID:7/LC:1/LI:1/LAV:1/LAC:1/FD:1/RD:2/NC:1/PV:1)",
    "Web",
    "Rendah",
    "Rendah",
    "Rendah",
    "HSTS (HTTP Strict Transport Security) adalah mekanisme keamanan berbasis header HTTP yang memastikan komunikasi antara browser dan server hanya menggunakan HTTPS. Tanpa HSTS, pengguna rentan terhadap serangan SSL stripping, downgrade ke HTTP, dan Man-in-the-Middle (MITM).",
    "1. Tambahkan header HSTS dengan max-age=31536000 (1 tahun) pada konfigurasi server.\n2. Aktifkan redirect otomatis ke HTTPS untuk memastikan semua koneksi aman.\n3. Pastikan HSTS diaktifkan pada semua subdomain menggunakan includeSubDomains.",
    "Infra (Rio)",
    "20 Desember 2024",
    "Menerapkan HSTS Header",
    "Selesai tanpa kendala",
    "Tidak ada",
    "None",
    "None",
    "None",
    "Sudah menerapkan HSTS Header",
    "Closed",
    "",
    ""
  ];

  // Gabungkan header dan contoh data
  const csvContent = [
    headers.join(";"),
    exampleRow.join(";")
  ].join("\n");

  return csvContent;
}

/**
 * Generate Excel template dengan contoh data
 */
export function generateExcelTemplate(): void {
  const headers = [
    "No.",
    "Nama Kerentanan",
    "MSTG /WSTG",
    "Jalur lokasi terdampak",
    "OWASP Risk Rating",
    "Objek terdampak",
    "KI",
    "DI",
    "RI",
    "Deskripsi",
    "Rekomendasi/Mitigasi",
    "PJ",
    "Tenggat",
    "Status Mitigasi",
    "Keterangan remediasi",
    "New Endpoint",
    "KR",
    "DR",
    "RR",
    "Keterangan Retest",
    "Retest #1",
    "Klasifikasi Temuan",
    "Retest #2"
  ];

  // Contoh data dengan 1 temuan
  const exampleRow = [
    "TE-01",
    "HSTS Header not implemented",
    "CONF-07",
    "Objek#1",
    "vector=(SL:2/M:3/O:3/S:3/ED:7/EE:5/A:3/ID:7/LC:1/LI:1/LAV:1/LAC:1/FD:1/RD:2/NC:1/PV:1)",
    "Web",
    "Rendah",
    "Rendah",
    "Rendah",
    "HSTS (HTTP Strict Transport Security) adalah mekanisme keamanan berbasis header HTTP yang memastikan komunikasi antara browser dan server hanya menggunakan HTTPS. Tanpa HSTS, pengguna rentan terhadap serangan SSL stripping, downgrade ke HTTP, dan Man-in-the-Middle (MITM).",
    "1. Tambahkan header HSTS dengan max-age=31536000 (1 tahun) pada konfigurasi server.\n2. Aktifkan redirect otomatis ke HTTPS untuk memastikan semua koneksi aman.\n3. Pastikan HSTS diaktifkan pada semua subdomain menggunakan includeSubDomains.",
    "Infra (Rio)",
    "20 Desember 2024",
    "Menerapkan HSTS Header",
    "Selesai tanpa kendala",
    "Tidak ada",
    "None",
    "None",
    "None",
    "Sudah menerapkan HSTS Header",
    "Closed",
    "",
    ""
  ];

  // Buat workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);

  // Set column widths untuk readability
  const colWidths = [
    { wch: 8 },   // No.
    { wch: 35 },  // Nama Kerentanan
    { wch: 15 },  // MSTG /WSTG
    { wch: 20 },  // Jalur lokasi terdampak
    { wch: 60 },  // OWASP Risk Rating
    { wch: 15 },  // Objek terdampak
    { wch: 8 },   // KI
    { wch: 8 },   // DI
    { wch: 8 },   // RI
    { wch: 50 },  // Deskripsi
    { wch: 50 },  // Rekomendasi/Mitigasi
    { wch: 15 },  // PJ
    { wch: 18 },  // Tenggat
    { wch: 18 },  // Status Mitigasi
    { wch: 25 },  // Keterangan remediasi
    { wch: 15 },  // New Endpoint
    { wch: 8 },   // KR
    { wch: 8 },   // DR
    { wch: 8 },   // RR
    { wch: 30 },  // Keterangan Retest
    { wch: 12 },  // Retest #1
    { wch: 20 },  // Klasifikasi Temuan
    { wch: 12 }   // Retest #2
  ];
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Template");

  // Download file
  try {
    XLSX.writeFile(wb, "Template_Vulnerability_Management.xlsx");
  } catch (error) {
    console.error("Error generating Excel template:", error);
    throw new Error("Gagal membuat file Excel template");
  }
}

/**
 * Download CSV template
 */
export function downloadCSVTemplate(): void {
  const csvContent = generateCSVTemplate();
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "Template_Vulnerability_Management.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

