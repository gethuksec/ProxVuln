"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RiskLevel } from "@/types/vulnerability";
import { formatRiskLevel, getRiskColor } from "@/utils/formatters";
import InfoTooltip from "@/components/ui/info-tooltip";

interface RiskComparisonChartProps {
  riskDistributionInheren: Record<RiskLevel, number>;
  riskDistributionResidual: Record<RiskLevel, number>;
}

/**
 * Komponen chart untuk membandingkan Risk Inheren vs Residual
 * Menunjukkan efektivitas mitigasi dalam mengurangi risiko
 */
export default function RiskComparisonChart({
  riskDistributionInheren,
  riskDistributionResidual,
}: RiskComparisonChartProps) {
  // Filter hanya risk level yang memiliki data (count > 0) di salah satu distribusi
  const data = (["Critical", "High", "Medium", "Low"] as RiskLevel[])
    .filter((risk) => {
      const inheren = riskDistributionInheren[risk] || 0;
      const residual = riskDistributionResidual[risk] || 0;
      return inheren > 0 || residual > 0;
    })
    .map((risk) => {
      const inheren = riskDistributionInheren[risk] || 0;
      const residual = riskDistributionResidual[risk] || 0;
      return {
        risk: formatRiskLevel(risk),
        Inheren: inheren,
        Residual: residual,
      };
    });

  const hasData = data.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Perbandingan Risiko: Inheren vs Residual</CardTitle>
            <CardDescription>
              Visualisasi penurunan risiko setelah implementasi mitigasi
            </CardDescription>
          </div>
          <InfoTooltip
            title="Risk Comparison Chart"
            content={`Chart ini membandingkan distribusi risiko sebelum dan setelah mitigasi:

Risiko Inheren:
- Risiko awal sebelum implementasi mitigasi
- Berdasarkan KI, DI, RI (Kemungkinan Dampak dan Risiko Inheren)
- Menunjukkan kondisi awal sistem

Risiko Residual:
- Risiko setelah implementasi mitigasi
- Berdasarkan KR, DR, RR (Kemungkinan Dampak dan Risiko Residual)
- Menunjukkan kondisi setelah perbaikan

Interpretasi:
- Jika Residual < Inheren = Mitigasi efektif
- Jika Residual = Inheren = Perlu evaluasi ulang mitigasi
- Gap yang besar menunjukkan program remediasi yang sangat efektif`}
          />
        </div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="risk" />
              <YAxis 
                domain={[0, 'auto']}
                tickFormatter={(value) => value > 0 ? value.toString() : ''}
              />
              <Tooltip 
                formatter={(value: number) => value > 0 ? value : null}
                filterNull={true}
              />
              <Legend />
              <Bar
                dataKey="Inheren"
                fill={getRiskColor("High")}
                name="Risiko Inheren"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="Residual"
                fill={getRiskColor("Low")}
                name="Risiko Residual"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-slate-500">
            Tidak ada data
          </div>
        )}
      </CardContent>
    </Card>
  );
}

