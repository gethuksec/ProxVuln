import { OWASPRiskVector, RiskLevel } from "@/types/vulnerability";

/**
 * Hitung Kemungkinan (Likelihood) dari OWASP vector
 * Sesuai OWASP Risk Rating Methodology:
 * Likelihood = Average dari semua 8 faktor:
 * - Threat Agent Factors: SL (Skill Level), M (Motive), O (Opportunity), S (Size)
 * - Vulnerability Factors: ED (Ease of Discovery), EE (Ease of Exploit), A (Awareness), ID (Intrusion Detection)
 */
export function calculateLikelihood(vector: OWASPRiskVector): number {
  // Average dari semua 8 faktor likelihood
  const likelihood = (
    vector.SL + vector.M + vector.O + vector.S +  // Threat Agent Factors
    vector.ED + vector.EE + vector.A + vector.ID   // Vulnerability Factors
  ) / 8;
  
  return Math.round(likelihood * 10) / 10; // Round to 1 decimal
}

/**
 * Hitung Dampak (Impact) dari OWASP vector
 * Sesuai OWASP Risk Rating Methodology:
 * Impact = Average dari semua 8 faktor:
 * - Technical Impact Factors: LC (Loss of Confidentiality), LI (Loss of Integrity), 
 *   LAV (Loss of Availability), LAC (Loss of Accountability)
 * - Business Impact Factors: FD (Financial Damage), RD (Reputation Damage), 
 *   NC (Non-compliance), PV (Privacy Violation)
 */
export function calculateImpact(vector: OWASPRiskVector): number {
  // Average dari semua 8 faktor impact
  const impact = (
    vector.LC + vector.LI + vector.LAV + vector.LAC +  // Technical Impact Factors
    vector.FD + vector.RD + vector.NC + vector.PV      // Business Impact Factors
  ) / 8;
  
  return Math.round(impact * 10) / 10; // Round to 1 decimal
}

/**
 * Convert numeric score (0-9) ke Risk Level string
 * Sesuai OWASP Risk Rating Methodology:
 * - 0 to <3 = LOW
 * - 3 to <6 = MEDIUM
 * - 6 to 9 = HIGH
 */
function scoreToRiskLevel(score: number): "Tinggi" | "Sedang" | "Rendah" {
  if (score >= 6) return "Tinggi";  // HIGH (6-9)
  if (score >= 3) return "Sedang";  // MEDIUM (3-<6)
  return "Rendah";                   // LOW (0-<3)
}

/**
 * Hitung Risk Level dari matrix Likelihood x Impact
 * Sesuai OWASP Risk Rating Methodology Risk Matrix:
 * 
 * Impact\Likelihood | LOW (0-<3) | MEDIUM (3-<6) | HIGH (6-9)
 * ------------------|-----------|----------------|----------
 * HIGH (6-9)        | Medium    | High          | Critical
 * MEDIUM (3-<6)     | Low       | Medium        | High
 * LOW (0-<3)        | Note      | Low           | Medium
 */
export function calculateRiskFromMatrix(likelihood: number, impact: number): "Kritis" | "Tinggi" | "Sedang" | "Rendah" {
  const likelihoodLevel = scoreToRiskLevel(likelihood);
  const impactLevel = scoreToRiskLevel(impact);
  
  // Risk Matrix sesuai OWASP Risk Rating Methodology
  // HIGH x HIGH = Critical
  if (likelihoodLevel === "Tinggi" && impactLevel === "Tinggi") return "Kritis";
  
  // HIGH x MEDIUM atau MEDIUM x HIGH = High
  if (likelihoodLevel === "Tinggi" && impactLevel === "Sedang") return "Tinggi";
  if (likelihoodLevel === "Sedang" && impactLevel === "Tinggi") return "Tinggi";
  
  // HIGH x LOW = Medium
  if (likelihoodLevel === "Tinggi" && impactLevel === "Rendah") return "Sedang";
  
  // MEDIUM x MEDIUM = Medium
  if (likelihoodLevel === "Sedang" && impactLevel === "Sedang") return "Sedang";
  
  // MEDIUM x LOW = Low
  if (likelihoodLevel === "Sedang" && impactLevel === "Rendah") return "Rendah";
  
  // LOW x HIGH = Medium
  if (likelihoodLevel === "Rendah" && impactLevel === "Tinggi") return "Sedang";
  
  // LOW x MEDIUM = Low
  if (likelihoodLevel === "Rendah" && impactLevel === "Sedang") return "Rendah";
  
  // LOW x LOW = Note/Low
  if (likelihoodLevel === "Rendah" && impactLevel === "Rendah") return "Rendah";
  
  return "Rendah"; // Default fallback
}

/**
 * Hitung KI, DI, RI dari OWASP vector
 */
export function calculateOWASPRiskValues(vector: OWASPRiskVector): {
  ki: string; // Kemungkinan (Likelihood)
  di: string; // Dampak (Impact)
  ri: string; // Risiko (Risk Level)
} {
  const likelihood = calculateLikelihood(vector);
  const impact = calculateImpact(vector);
  const risk = calculateRiskFromMatrix(likelihood, impact);
  
  return {
    ki: scoreToRiskLevel(likelihood),
    di: scoreToRiskLevel(impact),
    ri: risk,
  };
}

