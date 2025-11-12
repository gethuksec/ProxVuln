import { Vulnerability, RiskLevel, MitigationStatus, WorkbookData } from "@/types/vulnerability";

/**
 * Konversi risk level ke numeric score untuk perhitungan
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
 * Hitung persentase penurunan risiko dari Inheren ke Residual
 */
export function calculateRiskReduction(
  inheren: RiskLevel,
  residual?: RiskLevel
): number {
  if (!residual) return 0;
  
  const inherenScore = riskLevelToScore(inheren);
  const residualScore = riskLevelToScore(residual);
  
  if (inherenScore === 0) return 0;
  
  const reduction = ((inherenScore - residualScore) / inherenScore) * 100;
  return Math.max(0, Math.round(reduction));
}

/**
 * Hitung statistik untuk workbook
 */
export function calculateWorkbookStats(vulnerabilities: Vulnerability[]): {
  totalVulnerabilities: number;
  riskDistribution: Record<RiskLevel, number>;
  riskDistributionInheren: Record<RiskLevel, number>;
  riskDistributionResidual: Record<RiskLevel, number>;
  statusDistribution: Record<MitigationStatus, number>;
  progressPercentage: number;
  averageRiskReduction: number;
} {
  const totalVulnerabilities = vulnerabilities.length;

  // Risk distribution (current/calculated)
  const riskDistribution: Record<RiskLevel, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };

  // Risk distribution Inheren
  const riskDistributionInheren: Record<RiskLevel, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };

  // Risk distribution Residual
  const riskDistributionResidual: Record<RiskLevel, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };

  // Status distribution
  const statusDistribution: Record<MitigationStatus, number> = {
    Open: 0,
    Closed: 0,
    Parsial: 0,
  };

  let totalRiskReduction = 0;
  let countWithResidual = 0;

  vulnerabilities.forEach((vuln) => {
    // Count risk levels (calculated)
    const riskLevel = vuln.calculatedRiskLevel || "Low";
    riskDistribution[riskLevel] = (riskDistribution[riskLevel] || 0) + 1;

    // Count Inheren risk
    const inherenRisk = vuln.initialRiskLevel || "Low";
    riskDistributionInheren[inherenRisk] = (riskDistributionInheren[inherenRisk] || 0) + 1;

    // Count Residual risk - hanya jika ada retestRiskLevel (ada data KR/DR/RR)
    if (vuln.retestRiskLevel) {
      riskDistributionResidual[vuln.retestRiskLevel] = 
        (riskDistributionResidual[vuln.retestRiskLevel] || 0) + 1;
      
      // Calculate risk reduction
      if (vuln.initialRiskLevel) {
        const reduction = calculateRiskReduction(vuln.initialRiskLevel, vuln.retestRiskLevel);
        totalRiskReduction += reduction;
        countWithResidual++;
      }
    }
    // Jika belum ada residual (tidak ada retest), jangan hitung di residual distribution

    // Count status
    const status = vuln.retest1?.trim().toLowerCase() || vuln.statusMitigasi?.trim().toLowerCase() || "";
    if (status === "closed") {
      statusDistribution.Closed++;
    } else if (status.includes("parsial") || status.includes("partial") || status.includes("proses") || status.includes("progress")) {
      statusDistribution.Parsial++;
    } else if (status === "open") {
      statusDistribution.Open++;
    } else {
      statusDistribution.Open++;
    }
  });

  // Calculate progress percentage (Closed / Total)
  const progressPercentage =
    totalVulnerabilities > 0
      ? Math.round((statusDistribution.Closed / totalVulnerabilities) * 100)
      : 0;

  // Calculate average risk reduction
  const averageRiskReduction = countWithResidual > 0
    ? Math.round(totalRiskReduction / countWithResidual)
    : 0;

  return {
    totalVulnerabilities,
    riskDistribution,
    riskDistributionInheren,
    riskDistributionResidual,
    statusDistribution,
    progressPercentage,
    averageRiskReduction,
  };
}

/**
 * Generate unique ID untuk workbook
 */
export function generateWorkbookId(): string {
  return `wb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract workbook name dari filename
 */
export function extractWorkbookName(filename: string): string {
  // Remove extension dan path
  const name = filename.replace(/\.[^/.]+$/, "").split(/[/\\]/).pop() || filename;
  return name;
}
