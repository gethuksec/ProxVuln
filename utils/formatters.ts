import { RiskLevel } from "@/types/vulnerability";

/**
 * Format risk level ke bahasa Indonesia
 */
export function formatRiskLevel(risk: RiskLevel): string {
  const mapping: Record<RiskLevel, string> = {
    Critical: "Kritis",
    High: "Tinggi",
    Medium: "Sedang",
    Low: "Rendah",
  };
  return mapping[risk] || risk;
}

/**
 * Get color untuk risk level
 * Kritis: Ungu muda (#A78BFA atau #C084FC)
 * Tinggi: Merah agak muda (#F87171 atau #EF4444)
 * Sedang: Orange muda (#FB923C atau #F97316)
 * Rendah: Kuning muda (#FDE047 atau #FCD34D)
 */
export function getRiskColor(risk: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    Critical: "#A78BFA", // Ungu muda untuk Kritis
    High: "#F87171",     // Merah agak muda untuk Tinggi
    Medium: "#FB923C",   // Orange muda untuk Sedang
    Low: "#FDE047",      // Kuning muda untuk Rendah
  };
  return colors[risk] || "#6B7280";
}

/**
 * Get background color untuk risk level (lighter version)
 */
export function getRiskBgColor(risk: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    Critical: "#F3E8FF", // Light purple
    High: "#FEE2E2",     // Light red
    Medium: "#FFEDD5",   // Light orange
    Low: "#FEF9C3",      // Light yellow
  };
  return colors[risk] || "#F3F4F6";
}

/**
 * Format status mitigasi
 */
export function formatStatus(status: string): string {
  const statusLower = status.toLowerCase().trim();
  if (statusLower === "closed") return "Ditutup";
  if (statusLower === "open") return "Terbuka";
  if (statusLower.includes("proses") || statusLower.includes("progress")) return "Dalam Proses";
  return status;
}

/**
 * Get color untuk status mitigasi
 * Terbuka: Merah (#DC2626 atau #EF4444)
 * Dalam Proses: Kuning/amber (#F59E0B)
 * Ditutup: Hijau (#10B981)
 */
export function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase().trim();
  if (statusLower === "closed" || statusLower === "ditutup") return "#10B981"; // Green
  if (statusLower === "open" || statusLower === "terbuka") return "#DC2626"; // Red
  if (statusLower.includes("proses") || statusLower.includes("progress")) return "#F59E0B"; // Amber
  return "#6B7280"; // Gray default
}

/**
 * Get background color untuk status (lighter version)
 */
export function getStatusBgColor(status: string): string {
  const statusLower = status.toLowerCase().trim();
  if (statusLower === "closed" || statusLower === "ditutup") return "#D1FAE5"; // Light green
  if (statusLower === "open" || statusLower === "terbuka") return "#FEE2E2"; // Light red
  if (statusLower.includes("proses") || statusLower.includes("progress")) return "#FEF3C7"; // Light amber
  return "#F3F4F6"; // Light gray
}

/**
 * Get color untuk nilai KI/DI/RI/KR/DR/RR berdasarkan skala 1-9
 * Nilai 1-3: Rendah (kuning muda)
 * Nilai 4-6: Sedang (orange muda)
 * Nilai 7-9: Tinggi (merah agak muda)
 */
export function getRiskValueColor(value: string | number | undefined | null): string {
  if (!value || value === "-" || value === "") return "#6B7280"; // Gray untuk nilai kosong
  
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(numValue) || numValue < 1 || numValue > 9) return "#6B7280"; // Gray untuk nilai invalid
  
  if (numValue >= 7) return "#F87171"; // Merah agak muda untuk tinggi (7-9)
  if (numValue >= 4) return "#FB923C"; // Orange muda untuk sedang (4-6)
  return "#FDE047"; // Kuning muda untuk rendah (1-3)
}

/**
 * Get background color untuk nilai KI/DI/RI/KR/DR/RR (lighter version)
 */
export function getRiskValueBgColor(value: string | number | undefined | null): string {
  if (!value || value === "-" || value === "") return "#F3F4F6"; // Light gray untuk nilai kosong
  
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(numValue) || numValue < 1 || numValue > 9) return "#F3F4F6"; // Light gray untuk nilai invalid
  
  if (numValue >= 7) return "#FEE2E2"; // Light red untuk tinggi (7-9)
  if (numValue >= 4) return "#FFEDD5"; // Light orange untuk sedang (4-6)
  return "#FEF9C3"; // Light yellow untuk rendah (1-3)
}

