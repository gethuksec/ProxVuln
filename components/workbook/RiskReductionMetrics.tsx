"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import InfoTooltip from "@/components/ui/info-tooltip";
import { Vulnerability } from "@/types/vulnerability";
import { formatRiskLevel, getRiskColor } from "@/utils/formatters";
import { RiskLevel } from "@/types/vulnerability";

interface RiskReductionMetricsProps {
  vulnerabilities: Vulnerability[];
  averageRiskReduction: number;
}

/**
 * Komponen untuk menampilkan metrik penurunan risiko
 * Menunjukkan efektivitas mitigasi secara agregat
 */
export default function RiskReductionMetrics({
  vulnerabilities,
  averageRiskReduction,
}: RiskReductionMetricsProps) {
  // Hitung statistik penurunan risiko
  const withResidual = vulnerabilities.filter(
    (v) => v.initialRiskLevel && v.retestRiskLevel
  );
  
  const reduced = withResidual.filter(
    (v) => {
      const inherenScore = riskLevelToScore(v.initialRiskLevel!);
      const residualScore = riskLevelToScore(v.retestRiskLevel!);
      return residualScore < inherenScore;
    }
  );

  const eliminated = withResidual.filter(
    (v) => v.retestRiskLevel === "Low" && v.initialRiskLevel !== "Low"
  );

  const noChange = withResidual.filter(
    (v) => {
      const inherenScore = riskLevelToScore(v.initialRiskLevel!);
      const residualScore = riskLevelToScore(v.retestRiskLevel!);
      return residualScore === inherenScore;
    }
  );

  function riskLevelToScore(risk: RiskLevel): number {
    const scores: Record<RiskLevel, number> = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };
    return scores[risk] || 0;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Metrik Penurunan Risiko</CardTitle>
            <CardDescription>
              Analisis efektivitas mitigasi dalam mengurangi risiko
            </CardDescription>
          </div>
          <InfoTooltip
            title="Risk Reduction Metrics"
            content={`Metrik ini menunjukkan efektivitas program remediasi:

1. Rata-rata Penurunan:
   - Menghitung rata-rata % penurunan risiko dari semua vulnerabilities yang sudah diretest
   - Formula: Average dari ((Inheren - Residual) / Inheren) × 100%

2. Berhasil Dikurangi:
   - Jumlah vulnerabilities yang risk level-nya turun setelah mitigasi
   - Menunjukkan berapa banyak yang berhasil diperbaiki

3. Tereliminasi:
   - Vulnerabilities yang risk level-nya turun menjadi Low
   - Menunjukkan vulnerabilities yang sudah sangat aman

4. Belum Berubah:
   - Vulnerabilities yang risk level-nya sama antara Inheren dan Residual
   - Perlu perhatian lebih karena mitigasi belum efektif`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Average Risk Reduction */}
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Rata-rata Penurunan
              </p>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {averageRiskReduction}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              dari {withResidual.length} vulnerabilities
            </p>
          </div>

          {/* Reduced */}
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Berhasil Dikurangi
              </p>
            </div>
            <p className="text-3xl font-bold text-green-600">{reduced.length}</p>
            <p className="text-xs text-slate-500 mt-1">
              {withResidual.length > 0
                ? Math.round((reduced.length / withResidual.length) * 100)
                : 0}% dari total
            </p>
          </div>

          {/* Eliminated */}
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Minus className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tereliminasi
              </p>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {eliminated.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Risiko menjadi Low
            </p>
          </div>

          {/* No Change */}
          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Belum Berubah
              </p>
            </div>
            <p className="text-3xl font-bold text-amber-600">{noChange.length}</p>
            <p className="text-xs text-slate-500 mt-1">
              Perlu perhatian
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

