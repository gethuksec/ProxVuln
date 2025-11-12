import Papa from "papaparse";
import { Vulnerability, OWASPRiskVector, RiskLevel } from "@/types/vulnerability";

/**
 * Helper untuk convert risk level ke score
 */
function riskLevelToScore(risk: RiskLevel): number {
  const scores: Record<RiskLevel, number> = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };
  return scores[risk] || 0;
}

/**
 * Parse OWASP Risk Vector string menjadi object
 * Format: vector=(SL:2/M:3/O:3/S:3/ED:7/EE:5/A:3/ID:7/LC:1/LI:1/LAV:1/LAC:1/FD:1/RD:2/NC:1/PV:1)
 */
export function parseOWASPVector(vectorString: string): OWASPRiskVector | null {
  try {
    if (!vectorString || !vectorString.trim()) return null;
    
    // Extract vector part dari string
    const match = vectorString.match(/vector=\(([^)]+)\)/);
    if (!match) return null;

    const vectorPart = match[1];
    const metrics: Partial<OWASPRiskVector> = {};

    // Parse setiap metric (format: KEY:VALUE)
    const pairs = vectorPart.split("/");
    for (const pair of pairs) {
      const [key, value] = pair.split(":");
      if (key && value) {
        const numValue = parseInt(value.trim(), 10);
        if (!isNaN(numValue)) {
          metrics[key.trim() as keyof OWASPRiskVector] = numValue;
        }
      }
    }

    // Validate semua required fields ada
    const requiredFields: (keyof OWASPRiskVector)[] = [
      "SL", "M", "O", "S", "ED", "EE", "A", "ID",
      "LC", "LI", "LAV", "LAC", "FD", "RD", "NC", "PV"
    ];

    const hasAllFields = requiredFields.every(field => metrics[field] !== undefined);
    if (!hasAllFields) return null;

    return metrics as OWASPRiskVector;
  } catch (error) {
    console.error("Error parsing OWASP vector:", error);
    return null;
  }
}

/**
 * Convert risk value string ke RiskLevel
 * RI = Risiko (hasil matrix KI x DI)
 * RR = Risiko Residual (hasil matrix KR x DR)
 */
function convertRiskValueToLevel(riskValue?: string): RiskLevel {
  if (!riskValue) return "Low";
  
  const normalized = riskValue.toLowerCase().trim();
  
  if (normalized.includes("kritis") || normalized.includes("critical")) {
    return "Critical";
  }
  if (normalized.includes("tinggi") || normalized.includes("high")) {
    return "High";
  }
  if (normalized.includes("sedang") || normalized.includes("medium")) {
    return "Medium";
  }
  return "Low";
}

/**
 * Hitung risk level berdasarkan OWASP vector atau risk value
 * Jika ada vector, gunakan untuk kalkulasi
 * Jika tidak, gunakan risk value langsung (RI atau RR)
 */
export function calculateRiskLevel(
  vector?: OWASPRiskVector,
  ki?: string,
  di?: string,
  ri?: string
): RiskLevel {
  // Jika ada vector, gunakan untuk kalkulasi
  if (vector) {
    // Simplified risk calculation berdasarkan OWASP metrics
    const avgScore = (
      vector.SL + vector.M + vector.O + vector.S +
      vector.ED + vector.EE + vector.A + vector.ID +
      vector.LC + vector.LI + vector.LAV + vector.LAC +
      vector.FD + vector.RD + vector.NC + vector.PV
    ) / 16;

    if (avgScore >= 6) return "Critical";
    if (avgScore >= 4.5) return "High";
    if (avgScore >= 3) return "Medium";
    return "Low";
  }

  // Jika tidak ada vector, gunakan RI langsung (RI = hasil matrix KI x DI)
  // RI sudah merupakan risk level hasil perhitungan matrix
  if (ri) {
    return convertRiskValueToLevel(ri);
  }

  // Fallback: jika tidak ada RI, coba hitung dari KI x DI (matrix)
  // Tapi seharusnya RI sudah ada, ini hanya untuk backward compatibility
  const kiValue = ki?.toLowerCase().trim() || "";
  const diValue = di?.toLowerCase().trim() || "";
  
  // Risk Matrix: Kemungkinan (KI) x Dampak (DI) = Risiko (RI)
  // Matrix logic:
  // Kritis x Kritis = Kritis
  // Kritis x Tinggi = Kritis
  // Kritis x Sedang = Tinggi
  // Kritis x Rendah = Sedang
  // Tinggi x Tinggi = Tinggi
  // Tinggi x Sedang = Sedang
  // Tinggi x Rendah = Rendah
  // Sedang x Sedang = Sedang
  // Sedang x Rendah = Rendah
  // Rendah x Rendah = Rendah
  
  const getKemungkinanScore = (val: string): number => {
    if (val.includes("kritis") || val.includes("critical")) return 4;
    if (val.includes("tinggi") || val.includes("high")) return 3;
    if (val.includes("sedang") || val.includes("medium")) return 2;
    return 1;
  };
  
  const getDampakScore = (val: string): number => {
    if (val.includes("kritis") || val.includes("critical")) return 4;
    if (val.includes("tinggi") || val.includes("high")) return 3;
    if (val.includes("sedang") || val.includes("medium")) return 2;
    return 1;
  };
  
  if (kiValue && diValue) {
    const kiScore = getKemungkinanScore(kiValue);
    const diScore = getDampakScore(diValue);
    const riskScore = kiScore * diScore;
    
    // Risk score mapping: 16=Kritis, 12=Tinggi, 9=Sedang, 6=Sedang, 4=Rendah, 3=Rendah, 2=Rendah, 1=Rendah
    if (riskScore >= 12) return "Critical";
    if (riskScore >= 9) return "High";
    if (riskScore >= 4) return "Medium";
    return "Low";
  }
  
  return "Low";
}

/**
 * Normalize value - handle None, N/A, empty, etc.
 */
function normalizeValue(value: string | undefined | null): string {
  if (!value) return "";
  
  const trimmed = value.trim();
  if (!trimmed) return "";
  
  const lower = trimmed.toLowerCase();
  if (lower === "none" || lower === "n/a" || lower === "na" || lower === "-" || lower === "null") {
    return "";
  }
  
  return trimmed;
}

/**
 * Normalize header name untuk handle berbagai variasi
 */
function normalizeHeaderName(header: string): string {
  if (!header) return "";
  
  // Remove newlines and normalize whitespace
  let normalized = header
    .replace(/\r\n/g, " ")
    .replace(/\n/g, " ")
    .replace(/\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  
  // Mapping untuk berbagai variasi nama kolom
  const headerMap: Record<string, string> = {
    "no.": "No.",
    "no": "No.",
    "nama kerentanan": "Nama Kerentanan",
    "mstg /wstg": "MSTG /WSTG",
    "mstg/wstg": "MSTG /WSTG",
    "jalur lokasi terdampak": "Jalur lokasi terdampak",
    "owasp risk rating": "OWASP Risk Rating",
    "objek terdampak": "Objek terdampak",
    "rekomendasi/mitigasi": "Rekomendasi/Mitigasi",
    "status mitigasi": "Status Mitigasi",
    "keterangan remediasi": "Keterangan remediasi",
    "new endpoint": "New Endpoint",
    "keterangan retest": "Keterangan Retest",
    "retest #1": "Retest #1",
    "retest #2": "Retest #2",
    "klasifikasi temuan": "Klasifikasi Temuan",
  };
  
  const lower = normalized.toLowerCase();
  return headerMap[lower] || normalized;
}

/**
 * Get value dari row dengan fallback ke berbagai variasi key
 */
function getFieldValue(row: Record<string, string>, fieldName: string): string {
  // Try exact match
  if (row[fieldName] !== undefined) {
    return normalizeValue(row[fieldName]);
  }
  
  // Try normalized match
  const normalized = normalizeHeaderName(fieldName);
  if (row[normalized] !== undefined) {
    return normalizeValue(row[normalized]);
  }
  
  // Try case-insensitive match
  const lowerField = fieldName.toLowerCase();
  for (const [key, value] of Object.entries(row)) {
    if (normalizeHeaderName(key).toLowerCase() === lowerField) {
      return normalizeValue(value);
    }
  }
  
  return "";
}

/**
 * Check jika row benar-benar kosong
 */
function isRowEmpty(row: Record<string, string>): boolean {
  if (!row || Object.keys(row).length === 0) return true;
  
  const values = Object.values(row);
  if (values.length === 0) return true;
  
  // Check if all values are empty or just whitespace/semicolons
  return values.every(v => {
    if (!v) return true;
    const trimmed = v.trim();
    return trimmed === "" || trimmed === ";" || /^;+$/.test(trimmed);
  });
}

/**
 * Parse CSV row menjadi Vulnerability object
 */
function parseCSVRow(row: Record<string, string>, index: number): Vulnerability | null {
  try {
    // Get ID - required field
    const id = getFieldValue(row, "No.");
    if (!id || id.trim().length === 0) {
      return null; // Skip rows without ID
    }

    const owaspRiskRating = getFieldValue(row, "OWASP Risk Rating");
    const vector = parseOWASPVector(owaspRiskRating);

    const ki = getFieldValue(row, "KI");
    const di = getFieldValue(row, "DI");
    const ri = getFieldValue(row, "RI");

    const vulnerability: Vulnerability = {
      id: id.trim(),
      namaKerentanan: getFieldValue(row, "Nama Kerentanan"),
      mstgWstg: getFieldValue(row, "MSTG /WSTG"),
      jalurLokasiTerdampak: getFieldValue(row, "Jalur lokasi terdampak"),
      owaspRiskRating,
      owaspVector: vector || undefined,
      objekTerdampak: getFieldValue(row, "Objek terdampak"),
      ki,
      di,
      ri,
      deskripsi: getFieldValue(row, "Deskripsi"),
      rekomendasiMitigasi: getFieldValue(row, "Rekomendasi/Mitigasi"),
      pj: getFieldValue(row, "PJ"),
      tenggat: getFieldValue(row, "Tenggat"),
      statusMitigasi: getFieldValue(row, "Status Mitigasi"),
      keteranganRemediasi: getFieldValue(row, "Keterangan remediasi"),
      newEndpoint: getFieldValue(row, "New Endpoint"),
      kr: getFieldValue(row, "KR"),
      dr: getFieldValue(row, "DR"),
      rr: getFieldValue(row, "RR"),
      keteranganRetest: getFieldValue(row, "Keterangan Retest"),
      retest1: getFieldValue(row, "Retest #1"),
      klasifikasiTemuan: getFieldValue(row, "Klasifikasi Temuan"),
      retest2: getFieldValue(row, "Retest #2"),
    };

    // Calculate risk levels
    // RI = Risiko Inheren (hasil matrix KI x DI) = Risk Level
    // RR = Risiko Residual (hasil matrix KR x DR) = Risk Level setelah retest
    
    // Risk Level = langsung dari RI (RI sudah hasil matrix KI x DI)
    vulnerability.calculatedRiskLevel = convertRiskValueToLevel(ri);
    
    // Risk Inheren = langsung dari RI (RI sudah hasil matrix KI x DI)
    vulnerability.initialRiskLevel = convertRiskValueToLevel(ri);
    
    // Risk Residual = langsung dari RR (RR sudah hasil matrix KR x DR)
    // Jika KR/DR/RR = "None" atau kosong, berarti belum ada retest
    const hasResidualData = vulnerability.kr && 
                            vulnerability.dr && 
                            vulnerability.rr &&
                            vulnerability.kr.toLowerCase() !== "none" &&
                            vulnerability.dr.toLowerCase() !== "none" &&
                            vulnerability.rr.toLowerCase() !== "none";
    
    if (hasResidualData) {
      // RR sudah merupakan risk level hasil matrix KR x DR
      vulnerability.retestRiskLevel = convertRiskValueToLevel(vulnerability.rr);
      
      // Calculate risk reduction percentage
      if (vulnerability.initialRiskLevel && vulnerability.retestRiskLevel) {
        const inherenScore = riskLevelToScore(vulnerability.initialRiskLevel);
        const residualScore = riskLevelToScore(vulnerability.retestRiskLevel);
        if (inherenScore > 0) {
          const reduction = ((inherenScore - residualScore) / inherenScore) * 100;
          vulnerability.riskReductionPercentage = Math.max(0, Math.round(reduction));
        }
      }
    }

    return vulnerability;
  } catch (error) {
    console.error(`Error parsing row ${index}:`, error);
    return null;
  }
}

/**
 * Parse CSV file menjadi array of vulnerabilities
 * Robust parser yang handle berbagai format CSV
 */
export function parseCSVFile(
  csvContent: string,
  filename: string
): { vulnerabilities: Vulnerability[]; errors: string[] } {
  const errors: string[] = [];
  const vulnerabilities: Vulnerability[] = [];

  try {
    // Normalize line endings
    let content = csvContent
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    // Parse dengan PapaParse - lebih robust untuk multi-line cells
    const result = Papa.parse<Record<string, string>>(content, {
      header: true,
      delimiter: ";",
      skipEmptyLines: false, // Handle manually
      transformHeader: (header) => normalizeHeaderName(header),
      quotes: true,
      quoteChar: '"',
      escapeChar: '"',
      newline: "\n",
      // Don't throw on errors, just collect them
      transform: (value: string) => {
        return value || "";
      },
    });

    // Log non-critical errors as warnings only
    if (result.errors.length > 0) {
      const criticalErrors = result.errors.filter(e => {
        const msg = e.message.toLowerCase();
        // Ignore common non-critical errors
        return !msg.includes("too few fields") &&
               !msg.includes("too many fields") &&
               !msg.includes("trailing delimiter") &&
               !msg.includes("quoted field") &&
               !msg.includes("missing") &&
               !msg.includes("delimiter");
      });
      
      if (criticalErrors.length > 0) {
        console.warn("CSV parsing warnings:", criticalErrors);
      }
    }

    // Process each row
    result.data.forEach((row, index) => {
      // Skip empty rows
      if (isRowEmpty(row)) {
        return;
      }
      
      // Try to parse the row
      const vuln = parseCSVRow(row, index + 1);
      if (vuln) {
        vulnerabilities.push(vuln);
      }
      // Silently skip rows that can't be parsed (no ID, etc.)
    });

    return { vulnerabilities, errors };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    errors.push(`Failed to parse CSV file ${filename}: ${errorMessage}`);
    console.error("CSV parsing error:", error);
    return { vulnerabilities, errors };
  }
}
