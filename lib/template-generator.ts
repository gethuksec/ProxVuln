import * as XLSX from "xlsx";
import { parseOWASPVector } from "./csv-parser";
import { calculateOWASPRiskValues } from "./owasp-risk-calculator";

/**
 * Helper: Hitung KI, DI, RI dari vector string
 */
function calculateRiskFromVector(vectorString: string): { ki: string; di: string; ri: string } {
  const vector = parseOWASPVector(vectorString);
  if (vector) {
    return calculateOWASPRiskValues(vector);
  }
  // Fallback jika vector tidak valid
  return { ki: "Sedang", di: "Sedang", ri: "Sedang" };
}

/**
 * Generate CSV template dengan contoh data
 */
export function generateCSVTemplate(): string {
  // Header sesuai format CSV contoh (beberapa field memiliki newline)
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
    "Status\nMitigasi",  // Multi-line header seperti contoh
    "Keterangan remediasi",
    "New Endpoint",
    "KR",
    "DR",
    "RR",
    "Keterangan Retest",
    "Retest #1",
    "Klasifikasi Temuan",
    "Retest #2\n"  // Multi-line header seperti contoh
  ];

  // 10 Temuan berdasarkan OWASP Top 10 dengan data realistis
  // Inheren (KI, DI, RI) = nilai awal sebelum remediasi (dihitung dari vector)
  // Residual (KR, DR, RR) = nilai setelah remediasi dan retest (hanya untuk yang Closed)
  const exampleRows = [
    // 1. Broken Access Control - IDOR (Open - belum retest) - RI: Tinggi (KI: Tinggi, DI: Sedang)
    (() => {
      const vectorStr = "vector=(SL:6/M:6/O:6/S:6/ED:7/EE:7/A:6/ID:7/LC:4/LI:4/LAV:4/LAC:4/FD:4/RD:4/NC:4/PV:4)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-01",
        "Insecure Direct Object Reference (IDOR) pada User Profile",
        "ATHZ-04, BUSL-02",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi tidak melakukan validasi otorisasi yang memadai pada endpoint user profile. Penyerang dapat mengakses data profil user lain dengan memodifikasi parameter userId di URL. Dampak: exposure data pribadi, informasi sensitif, dan potensi identity theft.",
        "1. Implementasikan Role-Based Access Control (RBAC) yang ketat.\n\n2. Validasi ownership resource di setiap request (user hanya bisa akses data miliknya).\n\n3. Gunakan session-based authorization token, bukan user ID dari parameter.\n\n4. Implementasikan audit logging untuk semua akses ke data sensitif.\n\n5. Lakukan penetration testing untuk memastikan kontrol akses bekerja dengan benar.",
        "Backend Dev (Ahmad)",
        "15 Januari 2025",
        "Implementasi RBAC dan validasi ownership",
        "Sedang dalam proses implementasi middleware authorization",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - masih dalam tahap development",
        "Open",
        "High Priority",
        ""
      ];
    })(),
    // 2. Cryptographic Failures - Weak Encryption (Closed - sudah retest) - RI: Sedang (KI: Sedang, DI: Sedang)
    (() => {
      const vectorStr = "vector=(SL:4/M:4/O:4/S:4/ED:5/EE:5/A:4/ID:5/LC:4/LI:4/LAV:4/LAC:4/FD:4/RD:4/NC:4/PV:4)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-02",
        "Sensitive Data Transmitted in Plaintext",
        "CRYP-03, ATHN-01",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi mengirimkan data sensitif (password, credit card number, PII) melalui koneksi HTTP tanpa enkripsi. Data dapat diintercept oleh attacker melalui Man-in-the-Middle (MITM) attack. Dampak: credential theft, financial fraud, privacy violation.",
        "1. Wajibkan penggunaan HTTPS untuk semua komunikasi (enforce TLS 1.2+).\n\n2. Implementasikan HSTS header untuk mencegah downgrade attack.\n\n3. Jangan pernah mengirim password dalam plaintext, selalu gunakan hashing (bcrypt, Argon2).\n\n4. Untuk data kartu kredit, gunakan tokenization atau PCI-DSS compliant payment gateway.\n\n5. Implementasikan certificate pinning untuk aplikasi mobile.",
        "Infra (Rio)",
        "10 Januari 2025",
        "Enforce HTTPS dan implementasi encryption",
        "Selesai: HTTPS sudah diimplementasikan, password hashing sudah di-review dan approved",
        "Tidak ada",
        "Rendah",
        "Rendah",
        "Rendah",
        "Retest dilakukan pada 12 Januari 2025. HTTPS sudah aktif, password hashing sudah diimplementasikan dengan bcrypt. Tidak ditemukan lagi data yang ditransmisikan dalam plaintext.",
        "Closed",
        "Medium Priority",
        ""
      ];
    })(),
    // 3. Injection - SQL Injection (Parsial - belum retest) - RI: Kritis (KI: Tinggi, DI: Tinggi)
    (() => {
      const vectorStr = "vector=(SL:7/M:7/O:7/S:7/ED:8/EE:8/A:7/ID:8/LC:7/LI:7/LAV:7/LAC:7/FD:8/RD:8/NC:7/PV:7)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-03",
        "SQL Injection pada Search Functionality",
        "INPV-01",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi menggunakan raw SQL query tanpa parameterized statement pada fungsi search. Penyerang dapat mengeksekusi arbitrary SQL commands melalui input query. Dampak: data breach, database compromise, data manipulation, potential RCE.",
        "1. Gunakan parameterized queries/prepared statements untuk semua database operations.\n\n2. Implementasikan input validation dan whitelist filtering.\n\n3. Gunakan ORM (Object-Relational Mapping) yang sudah teruji seperti Prisma, TypeORM.\n\n4. Implementasikan least privilege principle untuk database user.\n\n5. Lakukan code review dan static analysis untuk mendeteksi SQL injection patterns.\n\n6. Implementasikan WAF (Web Application Firewall) sebagai defense in depth.",
        "Backend Dev (Ahmad)",
        "5 Januari 2025",
        "Refactor ke parameterized queries",
        "Sedang dalam proses refactoring seluruh query ke prepared statements",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - refactoring masih berlangsung, diperkirakan selesai dalam 2 minggu",
        "Parsial",
        "Critical Priority",
        ""
      ];
    })(),
    // 4. Insecure Design - Business Logic Flaw (Open - belum retest) - RI: Tinggi (KI: Sedang, DI: Tinggi)
    (() => {
      const vectorStr = "vector=(SL:4/M:4/O:4/S:4/ED:5/EE:5/A:4/ID:5/LC:7/LI:7/LAV:7/LAC:7/FD:8/RD:8/NC:7/PV:7)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-04",
        "Business Logic Flaw: Price Manipulation",
        "BUSL-01, BUSL-02",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi hanya melakukan validasi harga di sisi client. Penyerang dapat memodifikasi harga produk melalui browser developer tools atau API request manipulation sebelum checkout. Dampak: financial loss, revenue manipulation, business logic bypass.",
        "1. Selalu validasi harga dan business rules di server-side.\n\n2. Implementasikan integrity check menggunakan HMAC atau digital signature untuk sensitive data.\n\n3. Gunakan server-side session untuk menyimpan cart data, bukan client-side.\n\n4. Implementasikan audit trail untuk semua transaksi.\n\n5. Lakukan server-side re-calculation harga sebelum proses payment.",
        "Backend Dev (Ahmad)",
        "12 Januari 2025",
        "Implementasi server-side validation dan integrity check",
        "Masih dalam tahap design",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - masih dalam tahap design",
        "Open",
        "High Priority",
        ""
      ];
    })(),
    // 5. Security Misconfiguration - Exposed Admin Panel (Closed - sudah retest) - RI: Rendah (KI: Rendah, DI: Rendah)
    (() => {
      const vectorStr = "vector=(SL:2/M:2/O:2/S:2/ED:2/EE:2/A:2/ID:2/LC:2/LI:2/LAV:2/LAC:2/FD:2/RD:2/NC:2/PV:2)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-05",
        "Security Misconfiguration: Exposed Admin Interface",
        "CONF-05, CONF-02",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Admin panel dan sensitive endpoints dapat diakses secara publik tanpa autentikasi yang memadai. File .env dan phpmyadmin juga ter-expose. Dampak: unauthorized access, configuration exposure, potential system compromise.",
        "1. Restrict akses admin panel menggunakan IP whitelist atau VPN.\n\n2. Implementasikan strong authentication (2FA/MFA) untuk admin access.\n\n3. Hapus atau protect file .env, backup files, dan development tools dari production.\n\n4. Gunakan environment variables untuk sensitive configuration.\n\n5. Implementasikan rate limiting dan monitoring untuk admin endpoints.\n\n6. Lakukan security scanning untuk mendeteksi exposed files.",
        "Infra (Rio)",
        "8 Januari 2025",
        "Restrict admin access dan remove exposed files",
        "Selesai: Admin panel sudah di-restrict dengan IP whitelist, .env sudah dipindahkan, phpmyadmin sudah dihapus",
        "Tidak ada",
        "Rendah",
        "Rendah",
        "Rendah",
        "Retest dilakukan pada 9 Januari 2025. Admin panel sudah di-restrict dengan IP whitelist, .env sudah di-secure, phpmyadmin sudah dihapus dari production. Tidak ditemukan lagi exposed files.",
        "Closed",
        "Medium Priority",
        ""
      ];
    })(),
    // 6. Vulnerable and Outdated Components (Parsial - belum retest) - RI: Sedang (KI: Sedang, DI: Sedang)
    (() => {
      const vectorStr = "vector=(SL:4/M:4/O:4/S:4/ED:5/EE:5/A:4/ID:5/LC:4/LI:4/LAV:4/LAC:4/FD:4/RD:4/NC:4/PV:4)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-06",
        "Outdated Dependencies dengan Known Vulnerabilities",
        "CONF-02",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi menggunakan library dan framework yang outdated dengan known CVEs (Common Vulnerabilities and Exposures). Beberapa dependencies memiliki critical vulnerabilities yang dapat dieksploitasi. Dampak: potential RCE, data breach, system compromise.",
        "1. Lakukan audit dependencies menggunakan npm audit atau Snyk.\n\n2. Update semua dependencies ke versi terbaru yang aman.\n\n3. Implementasikan automated dependency scanning dalam CI/CD pipeline.\n\n4. Gunakan Dependabot atau Renovate untuk automated dependency updates.\n\n5. Hapus dependencies yang tidak digunakan.\n\n6. Monitor security advisories untuk dependencies yang digunakan.",
        "DevOps (Budi)",
        "18 Januari 2025",
        "Update dependencies dan implementasi automated scanning",
        "Sedang dalam proses update dependencies, beberapa breaking changes perlu di-handle",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - update masih berlangsung",
        "Parsial",
        "High Priority",
        ""
      ];
    })(),
    // 7. Authentication Failures - Weak Password Policy (Closed - sudah retest) - RI: Rendah (KI: Sedang, DI: Rendah)
    (() => {
      const vectorStr = "vector=(SL:4/M:4/O:4/S:4/ED:5/EE:5/A:4/ID:5/LC:2/LI:2/LAV:2/LAC:2/FD:2/RD:2/NC:2/PV:2)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-07",
        "Weak Authentication: Insufficient Password Policy",
        "ATHN-05, ATHN-06",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi tidak menerapkan password policy yang kuat. Password dapat berupa kata-kata umum, tanpa complexity requirements, dan tidak ada account lockout mechanism. Dampak: credential stuffing, brute force attacks, account takeover.",
        "1. Implementasikan strong password policy: minimum 12 karakter, kombinasi uppercase, lowercase, number, special character.\n\n2. Gunakan password strength meter untuk user guidance.\n\n3. Implementasikan account lockout setelah 5 failed attempts (temporary lockout 30 menit).\n\n4. Implementasikan rate limiting pada login endpoint.\n\n5. Gunakan password hashing yang kuat (bcrypt dengan cost factor 12+ atau Argon2).\n\n6. Implementasikan password history untuk mencegah reuse password lama.",
        "Backend Dev (Ahmad)",
        "14 Januari 2025",
        "Implementasi strong password policy dan account lockout",
        "Selesai: Password policy sudah diimplementasikan, account lockout sudah di-test dan approved",
        "Tidak ada",
        "Rendah",
        "Rendah",
        "Rendah",
        "Retest dilakukan pada 15 Januari 2025. Password policy sudah aktif, account lockout sudah diimplementasikan dan tested. Tidak ditemukan lagi weak password atau brute force vulnerability.",
        "Closed",
        "Medium Priority",
        ""
      ];
    })(),
    // 8. Software and Data Integrity Failures - Unsigned Updates (Open - belum retest) - RI: Rendah (KI: Rendah, DI: Sedang)
    (() => {
      const vectorStr = "vector=(SL:2/M:2/O:2/S:2/ED:2/EE:2/A:2/ID:2/LC:4/LI:4/LAV:4/LAC:4/FD:4/RD:4/NC:4/PV:4)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-08",
        "Insecure Deserialization: Unsigned Data Objects",
        "INPV-06, BUSL-03",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi menerima dan memproses serialized data objects tanpa validasi integrity. Penyerang dapat memodifikasi serialized data untuk injection attacks atau RCE. Dampak: remote code execution, data manipulation, system compromise.",
        "1. Jangan menerima serialized objects dari untrusted sources.\n\n2. Implementasikan digital signature atau HMAC untuk memverifikasi integrity data.\n\n3. Gunakan data format yang aman seperti JSON dengan strict schema validation.\n\n4. Implementasikan allowlist untuk class/type yang boleh di-deserialize.\n\n5. Isolate deserialization process dalam sandbox environment.\n\n6. Implementasikan logging dan monitoring untuk deserialization operations.",
        "Backend Dev (Ahmad)",
        "6 Januari 2025",
        "Implementasi integrity check dan secure deserialization",
        "Masih dalam tahap research dan design",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - masih dalam tahap research",
        "Open",
        "Critical Priority",
        ""
      ];
    })(),
    // 9. Security Logging and Monitoring Failures (Parsial - belum retest) - RI: Rendah (KI: Rendah, DI: Rendah)
    (() => {
      const vectorStr = "vector=(SL:2/M:2/O:2/S:2/ED:2/EE:2/A:2/ID:2/LC:2/LI:2/LAV:2/LAC:2/FD:2/RD:2/NC:2/PV:2)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-09",
        "Insufficient Logging and Monitoring",
        "ERRH-01",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi tidak melakukan logging yang memadai untuk security events. Failed login attempts, privilege escalations, dan suspicious activities tidak tercatat. Dampak: inability to detect attacks, lack of forensic evidence, compliance violations.",
        "1. Implementasikan comprehensive security event logging: failed logins, privilege changes, data access, API calls.\n\n2. Centralize logs menggunakan SIEM atau log aggregation tool (ELK stack, Splunk).\n\n3. Implementasikan real-time alerting untuk suspicious activities.\n\n4. Retain logs sesuai compliance requirements (minimum 90 hari).\n\n5. Implementasikan log integrity protection (tamper-proof logging).\n\n6. Lakukan regular log review dan analysis.",
        "DevOps (Budi)",
        "16 Januari 2025",
        "Implementasi comprehensive logging dan monitoring",
        "Sedang dalam proses setup ELK stack dan konfigurasi alerting",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - ELK stack masih dalam setup",
        "Parsial",
        "Medium Priority",
        ""
      ];
    })(),
    // 10. Server-Side Request Forgery (SSRF) (Parsial - belum retest) - RI: Sedang (KI: Rendah, DI: Tinggi)
    (() => {
      const vectorStr = "vector=(SL:2/M:2/O:2/S:2/ED:2/EE:2/A:2/ID:2/LC:7/LI:7/LAV:7/LAC:7/FD:8/RD:8/NC:7/PV:7)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-10",
        "Server-Side Request Forgery (SSRF) pada Image Upload",
        "INPV-19",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi menerima URL dari user untuk fetch image dari external source tanpa validasi. Penyerang dapat memanipulasi URL untuk melakukan request ke internal network, cloud metadata services, atau localhost. Dampak: internal network scanning, cloud metadata access, potential data exfiltration.",
        "1. Validasi dan sanitize semua URL input dari user.\n\n2. Implementasikan allowlist untuk domain yang diizinkan (jangan gunakan blacklist).\n\n3. Gunakan whitelist untuk allowed protocols (hanya HTTP/HTTPS).\n\n4. Block access ke private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1).\n\n5. Implementasikan timeout untuk external requests.\n\n6. Gunakan isolated network atau proxy untuk fetch external resources.\n\n7. Implementasikan rate limiting untuk prevent abuse.",
        "Backend Dev (Ahmad)",
        "7 Januari 2025",
        "Implementasi URL validation dan network isolation",
        "Sedang dalam proses implementasi URL validator dan network restrictions",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - URL validator sudah diimplementasikan, network isolation sedang dalam testing",
        "Parsial",
        "Critical Priority",
        ""
      ];
    })()
  ];

  // Helper: Escape CSV value (handle quotes dan newlines)
  function escapeCSVValue(value: string): string {
    if (!value) return "";
    // Jika mengandung newline, quote, atau semicolon, wrap dengan quotes
    if (value.includes("\n") || value.includes('"') || value.includes(";")) {
      // Escape quotes dengan double quotes
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  // Helper: Format row untuk CSV dengan proper escaping
  function formatCSVRow(row: string[]): string {
    return row.map(escapeCSVValue).join(";");
  }

  // Gabungkan header dan semua contoh data
  const csvContent = [
    formatCSVRow(headers),
    ...exampleRows.map(row => formatCSVRow(row))
  ].join("\n");

  return csvContent;
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

/**
 * Generate Excel template dengan contoh data
 */
export function generateExcelTemplate(): void {
  // Header sesuai format CSV contoh (untuk Excel, newline akan di-render sebagai line break)
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
    "Status\nMitigasi",  // Multi-line header seperti contoh
    "Keterangan remediasi",
    "New Endpoint",
    "KR",
    "DR",
    "RR",
    "Keterangan Retest",
    "Retest #1",
    "Klasifikasi Temuan",
    "Retest #2\n"  // Multi-line header seperti contoh
  ];

  // Gunakan exampleRows yang sama dengan CSV (sudah dihitung dari vector)
  const exampleRows = [
    // 1. Broken Access Control - IDOR (Open - belum retest)
    (() => {
      const vectorStr = "vector=(SL:3/M:4/O:3/S:3/ED:6/EE:6/A:4/ID:7/LC:3/LI:3/LAV:2/LAC:3/FD:3/RD:3/NC:2/PV:3)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-01",
        "Insecure Direct Object Reference (IDOR) pada User Profile",
        "ATHZ-04, BUSL-02",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi tidak melakukan validasi otorisasi yang memadai pada endpoint user profile. Penyerang dapat mengakses data profil user lain dengan memodifikasi parameter userId di URL. Dampak: exposure data pribadi, informasi sensitif, dan potensi identity theft.",
        "1. Implementasikan Role-Based Access Control (RBAC) yang ketat.\n\n2. Validasi ownership resource di setiap request (user hanya bisa akses data miliknya).\n\n3. Gunakan session-based authorization token, bukan user ID dari parameter.\n\n4. Implementasikan audit logging untuk semua akses ke data sensitif.\n\n5. Lakukan penetration testing untuk memastikan kontrol akses bekerja dengan benar.",
        "Backend Dev (Ahmad)",
        "15 Januari 2025",
        "Implementasi RBAC dan validasi ownership",
        "Sedang dalam proses implementasi middleware authorization",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - masih dalam tahap development",
        "Open",
        "High Priority",
        ""
      ];
    })(),
    // 2. Cryptographic Failures - Weak Encryption (Closed - sudah retest) - RI: Sedang (KI: Sedang, DI: Sedang)
    (() => {
      const vectorStr = "vector=(SL:4/M:4/O:4/S:4/ED:5/EE:5/A:4/ID:5/LC:4/LI:4/LAV:4/LAC:4/FD:4/RD:4/NC:4/PV:4)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-02",
        "Sensitive Data Transmitted in Plaintext",
        "CRYP-03, ATHN-01",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi mengirimkan data sensitif (password, credit card number, PII) melalui koneksi HTTP tanpa enkripsi. Data dapat diintercept oleh attacker melalui Man-in-the-Middle (MITM) attack. Dampak: credential theft, financial fraud, privacy violation.",
        "1. Wajibkan penggunaan HTTPS untuk semua komunikasi (enforce TLS 1.2+).\n\n2. Implementasikan HSTS header untuk mencegah downgrade attack.\n\n3. Jangan pernah mengirim password dalam plaintext, selalu gunakan hashing (bcrypt, Argon2).\n\n4. Untuk data kartu kredit, gunakan tokenization atau PCI-DSS compliant payment gateway.\n\n5. Implementasikan certificate pinning untuk aplikasi mobile.",
        "Infra (Rio)",
        "10 Januari 2025",
        "Enforce HTTPS dan implementasi encryption",
        "Selesai: HTTPS sudah diimplementasikan, password hashing sudah di-review dan approved",
        "Tidak ada",
        "Rendah",
        "Rendah",
        "Rendah",
        "Retest dilakukan pada 12 Januari 2025. HTTPS sudah aktif, password hashing sudah diimplementasikan dengan bcrypt. Tidak ditemukan lagi data yang ditransmisikan dalam plaintext.",
        "Closed",
        "Medium Priority",
        ""
      ];
    })(),
    // 3. Injection - SQL Injection (Parsial - belum retest) - RI: Kritis (KI: Tinggi, DI: Tinggi)
    (() => {
      const vectorStr = "vector=(SL:7/M:7/O:7/S:7/ED:8/EE:8/A:7/ID:8/LC:7/LI:7/LAV:7/LAC:7/FD:8/RD:8/NC:7/PV:7)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-03",
        "SQL Injection pada Search Functionality",
        "INPV-01",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi menggunakan raw SQL query tanpa parameterized statement pada fungsi search. Penyerang dapat mengeksekusi arbitrary SQL commands melalui input query. Dampak: data breach, database compromise, data manipulation, potential RCE.",
        "1. Gunakan parameterized queries/prepared statements untuk semua database operations.\n\n2. Implementasikan input validation dan whitelist filtering.\n\n3. Gunakan ORM (Object-Relational Mapping) yang sudah teruji seperti Prisma, TypeORM.\n\n4. Implementasikan least privilege principle untuk database user.\n\n5. Lakukan code review dan static analysis untuk mendeteksi SQL injection patterns.\n\n6. Implementasikan WAF (Web Application Firewall) sebagai defense in depth.",
        "Backend Dev (Ahmad)",
        "5 Januari 2025",
        "Refactor ke parameterized queries",
        "Sedang dalam proses refactoring seluruh query ke prepared statements",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - refactoring masih berlangsung, diperkirakan selesai dalam 2 minggu",
        "Parsial",
        "Critical Priority",
        ""
      ];
    })(),
    // 4. Insecure Design - Business Logic Flaw (Open - belum retest) - RI: Tinggi (KI: Sedang, DI: Tinggi)
    (() => {
      const vectorStr = "vector=(SL:4/M:4/O:4/S:4/ED:5/EE:5/A:4/ID:5/LC:7/LI:7/LAV:7/LAC:7/FD:8/RD:8/NC:7/PV:7)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-04",
        "Business Logic Flaw: Price Manipulation",
        "BUSL-01, BUSL-02",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi hanya melakukan validasi harga di sisi client. Penyerang dapat memodifikasi harga produk melalui browser developer tools atau API request manipulation sebelum checkout. Dampak: financial loss, revenue manipulation, business logic bypass.",
        "1. Selalu validasi harga dan business rules di server-side.\n\n2. Implementasikan integrity check menggunakan HMAC atau digital signature untuk sensitive data.\n\n3. Gunakan server-side session untuk menyimpan cart data, bukan client-side.\n\n4. Implementasikan audit trail untuk semua transaksi.\n\n5. Lakukan server-side re-calculation harga sebelum proses payment.",
        "Backend Dev (Ahmad)",
        "12 Januari 2025",
        "Implementasi server-side validation dan integrity check",
        "Masih dalam tahap design",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - masih dalam tahap design",
        "Open",
        "High Priority",
        ""
      ];
    })(),
    // 5. Security Misconfiguration - Exposed Admin Panel (Closed - sudah retest) - RI: Rendah (KI: Rendah, DI: Rendah)
    (() => {
      const vectorStr = "vector=(SL:2/M:2/O:2/S:2/ED:2/EE:2/A:2/ID:2/LC:2/LI:2/LAV:2/LAC:2/FD:2/RD:2/NC:2/PV:2)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-05",
        "Security Misconfiguration: Exposed Admin Interface",
        "CONF-05, CONF-02",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Admin panel dan sensitive endpoints dapat diakses secara publik tanpa autentikasi yang memadai. File .env dan phpmyadmin juga ter-expose. Dampak: unauthorized access, configuration exposure, potential system compromise.",
        "1. Restrict akses admin panel menggunakan IP whitelist atau VPN.\n\n2. Implementasikan strong authentication (2FA/MFA) untuk admin access.\n\n3. Hapus atau protect file .env, backup files, dan development tools dari production.\n\n4. Gunakan environment variables untuk sensitive configuration.\n\n5. Implementasikan rate limiting dan monitoring untuk admin endpoints.\n\n6. Lakukan security scanning untuk mendeteksi exposed files.",
        "Infra (Rio)",
        "8 Januari 2025",
        "Restrict admin access dan remove exposed files",
        "Selesai: Admin panel sudah di-restrict dengan IP whitelist, .env sudah dipindahkan, phpmyadmin sudah dihapus",
        "Tidak ada",
        "Rendah",
        "Rendah",
        "Rendah",
        "Retest dilakukan pada 9 Januari 2025. Admin panel sudah di-restrict dengan IP whitelist, .env sudah di-secure, phpmyadmin sudah dihapus dari production. Tidak ditemukan lagi exposed files.",
        "Closed",
        "Medium Priority",
        ""
      ];
    })(),
    // 6. Vulnerable and Outdated Components (Parsial - belum retest) - RI: Sedang (KI: Sedang, DI: Sedang)
    (() => {
      const vectorStr = "vector=(SL:4/M:4/O:4/S:4/ED:5/EE:5/A:4/ID:5/LC:4/LI:4/LAV:4/LAC:4/FD:4/RD:4/NC:4/PV:4)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-06",
        "Outdated Dependencies dengan Known Vulnerabilities",
        "CONF-02",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi menggunakan library dan framework yang outdated dengan known CVEs (Common Vulnerabilities and Exposures). Beberapa dependencies memiliki critical vulnerabilities yang dapat dieksploitasi. Dampak: potential RCE, data breach, system compromise.",
        "1. Lakukan audit dependencies menggunakan npm audit atau Snyk.\n\n2. Update semua dependencies ke versi terbaru yang aman.\n\n3. Implementasikan automated dependency scanning dalam CI/CD pipeline.\n\n4. Gunakan Dependabot atau Renovate untuk automated dependency updates.\n\n5. Hapus dependencies yang tidak digunakan.\n\n6. Monitor security advisories untuk dependencies yang digunakan.",
        "DevOps (Budi)",
        "18 Januari 2025",
        "Update dependencies dan implementasi automated scanning",
        "Sedang dalam proses update dependencies, beberapa breaking changes perlu di-handle",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - update masih berlangsung",
        "Parsial",
        "High Priority",
        ""
      ];
    })(),
    // 7. Authentication Failures - Weak Password Policy (Closed - sudah retest) - RI: Rendah (KI: Sedang, DI: Rendah)
    (() => {
      const vectorStr = "vector=(SL:4/M:4/O:4/S:4/ED:5/EE:5/A:4/ID:5/LC:2/LI:2/LAV:2/LAC:2/FD:2/RD:2/NC:2/PV:2)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-07",
        "Weak Authentication: Insufficient Password Policy",
        "ATHN-05, ATHN-06",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi tidak menerapkan password policy yang kuat. Password dapat berupa kata-kata umum, tanpa complexity requirements, dan tidak ada account lockout mechanism. Dampak: credential stuffing, brute force attacks, account takeover.",
        "1. Implementasikan strong password policy: minimum 12 karakter, kombinasi uppercase, lowercase, number, special character.\n\n2. Gunakan password strength meter untuk user guidance.\n\n3. Implementasikan account lockout setelah 5 failed attempts (temporary lockout 30 menit).\n\n4. Implementasikan rate limiting pada login endpoint.\n\n5. Gunakan password hashing yang kuat (bcrypt dengan cost factor 12+ atau Argon2).\n\n6. Implementasikan password history untuk mencegah reuse password lama.",
        "Backend Dev (Ahmad)",
        "14 Januari 2025",
        "Implementasi strong password policy dan account lockout",
        "Selesai: Password policy sudah diimplementasikan, account lockout sudah di-test dan approved",
        "Tidak ada",
        "Rendah",
        "Rendah",
        "Rendah",
        "Retest dilakukan pada 15 Januari 2025. Password policy sudah aktif, account lockout sudah diimplementasikan dan tested. Tidak ditemukan lagi weak password atau brute force vulnerability.",
        "Closed",
        "Medium Priority",
        ""
      ];
    })(),
    // 8. Software and Data Integrity Failures - Unsigned Updates (Open - belum retest) - RI: Rendah (KI: Rendah, DI: Sedang)
    (() => {
      const vectorStr = "vector=(SL:2/M:2/O:2/S:2/ED:2/EE:2/A:2/ID:2/LC:4/LI:4/LAV:4/LAC:4/FD:4/RD:4/NC:4/PV:4)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-08",
        "Insecure Deserialization: Unsigned Data Objects",
        "INPV-06, BUSL-03",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi menerima dan memproses serialized data objects tanpa validasi integrity. Penyerang dapat memodifikasi serialized data untuk injection attacks atau RCE. Dampak: remote code execution, data manipulation, system compromise.",
        "1. Jangan menerima serialized objects dari untrusted sources.\n\n2. Implementasikan digital signature atau HMAC untuk memverifikasi integrity data.\n\n3. Gunakan data format yang aman seperti JSON dengan strict schema validation.\n\n4. Implementasikan allowlist untuk class/type yang boleh di-deserialize.\n\n5. Isolate deserialization process dalam sandbox environment.\n\n6. Implementasikan logging dan monitoring untuk deserialization operations.",
        "Backend Dev (Ahmad)",
        "6 Januari 2025",
        "Implementasi integrity check dan secure deserialization",
        "Masih dalam tahap research dan design",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - masih dalam tahap research",
        "Open",
        "Critical Priority",
        ""
      ];
    })(),
    // 9. Security Logging and Monitoring Failures (Parsial - belum retest) - RI: Rendah (KI: Rendah, DI: Rendah)
    (() => {
      const vectorStr = "vector=(SL:2/M:2/O:2/S:2/ED:2/EE:2/A:2/ID:2/LC:2/LI:2/LAV:2/LAC:2/FD:2/RD:2/NC:2/PV:2)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-09",
        "Insufficient Logging and Monitoring",
        "ERRH-01",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi tidak melakukan logging yang memadai untuk security events. Failed login attempts, privilege escalations, dan suspicious activities tidak tercatat. Dampak: inability to detect attacks, lack of forensic evidence, compliance violations.",
        "1. Implementasikan comprehensive security event logging: failed logins, privilege changes, data access, API calls.\n\n2. Centralize logs menggunakan SIEM atau log aggregation tool (ELK stack, Splunk).\n\n3. Implementasikan real-time alerting untuk suspicious activities.\n\n4. Retain logs sesuai compliance requirements (minimum 90 hari).\n\n5. Implementasikan log integrity protection (tamper-proof logging).\n\n6. Lakukan regular log review dan analysis.",
        "DevOps (Budi)",
        "16 Januari 2025",
        "Implementasi comprehensive logging dan monitoring",
        "Sedang dalam proses setup ELK stack dan konfigurasi alerting",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - ELK stack masih dalam setup",
        "Parsial",
        "Medium Priority",
        ""
      ];
    })(),
    // 10. Server-Side Request Forgery (SSRF) (Parsial - belum retest) - RI: Sedang (KI: Rendah, DI: Tinggi)
    (() => {
      const vectorStr = "vector=(SL:2/M:2/O:2/S:2/ED:2/EE:2/A:2/ID:2/LC:7/LI:7/LAV:7/LAC:7/FD:8/RD:8/NC:7/PV:7)";
      const risk = calculateRiskFromVector(vectorStr);
      return [
        "TE-10",
        "Server-Side Request Forgery (SSRF) pada Image Upload",
        "INPV-19",
        "Objek#1",
        vectorStr,
        "Web",
        risk.ki,
        risk.di,
        risk.ri,
        "Aplikasi menerima URL dari user untuk fetch image dari external source tanpa validasi. Penyerang dapat memanipulasi URL untuk melakukan request ke internal network, cloud metadata services, atau localhost. Dampak: internal network scanning, cloud metadata access, potential data exfiltration.",
        "1. Validasi dan sanitize semua URL input dari user.\n\n2. Implementasikan allowlist untuk domain yang diizinkan (jangan gunakan blacklist).\n\n3. Gunakan whitelist untuk allowed protocols (hanya HTTP/HTTPS).\n\n4. Block access ke private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1).\n\n5. Implementasikan timeout untuk external requests.\n\n6. Gunakan isolated network atau proxy untuk fetch external resources.\n\n7. Implementasikan rate limiting untuk prevent abuse.",
        "Backend Dev (Ahmad)",
        "7 Januari 2025",
        "Implementasi URL validation dan network isolation",
        "Sedang dalam proses implementasi URL validator dan network restrictions",
        "Tidak ada",
        "None",
        "None",
        "None",
        "Belum dilakukan retest - URL validator sudah diimplementasikan, network isolation sedang dalam testing",
        "Parsial",
        "Critical Priority",
        ""
      ];
    })()
  ];

  // Buat workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleRows]);

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

