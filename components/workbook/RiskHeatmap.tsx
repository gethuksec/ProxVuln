"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Vulnerability, RiskLevel } from "@/types/vulnerability";
import { formatRiskLevel, getRiskColor } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface RiskHeatmapProps {
  vulnerabilities: Vulnerability[];
}

/**
 * Komponen Heatmap untuk visualisasi risiko
 * Menampilkan grid vulnerabilities dengan color coding berdasarkan risk level
 */
export default function RiskHeatmap({ vulnerabilities }: RiskHeatmapProps) {
  // Group vulnerabilities by risk level
  const groupedByRisk: Record<RiskLevel, Vulnerability[]> = {
    Critical: [],
    High: [],
    Medium: [],
    Low: [],
  };

  vulnerabilities.forEach((vuln) => {
    const risk = vuln.calculatedRiskLevel || "Low";
    groupedByRisk[risk].push(vuln);
  });

  const riskOrder: RiskLevel[] = ["Critical", "High", "Medium", "Low"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Heatmap</CardTitle>
        <CardDescription>
          Visualisasi grid vulnerabilities berdasarkan tingkat risiko
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {riskOrder.map((risk) => {
            const vulns = groupedByRisk[risk];
            if (vulns.length === 0) return null;

            return (
              <div key={risk} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getRiskColor(risk) }}
                  />
                  <h3 className="font-semibold text-sm">
                    {formatRiskLevel(risk)} ({vulns.length})
                  </h3>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {vulns.map((vuln) => (
                    <div
                      key={vuln.id}
                      className={cn(
                        "aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all hover:scale-110 hover:shadow-lg cursor-pointer",
                        "text-white"
                      )}
                      style={{
                        backgroundColor: getRiskColor(risk),
                        borderColor: getRiskColor(risk),
                      }}
                      title={`${vuln.id}: ${vuln.namaKerentanan}`}
                    >
                      {vuln.id}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

