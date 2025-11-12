"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { RiskLevel } from "@/types/vulnerability";
import { formatRiskLevel, getRiskColor } from "@/utils/formatters";

interface RiskChartProps {
  riskDistribution: Record<RiskLevel, number>;
}

/**
 * Komponen chart untuk menampilkan distribusi risk level
 */
export default function RiskChart({ riskDistribution }: RiskChartProps) {
  const data = Object.entries(riskDistribution)
    .filter(([_, count]) => count > 0)
    .map(([risk, count]) => ({
      name: formatRiskLevel(risk as RiskLevel),
      value: count,
      color: getRiskColor(risk as RiskLevel),
    }));

  const COLORS = data.map((d) => d.color);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Risk Level</CardTitle>
        <CardDescription>
          Persebaran vulnerabilities berdasarkan tingkat risiko
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) =>
                  value > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => value > 0 ? value : null}
                filterNull={true}
              />
              {/* Custom Legend - Completely remove default legend */}
              <Legend 
                wrapperStyle={{ display: 'none' }}
                iconSize={0}
                formatter={() => null}
              />
              {/* Custom Legend Display - Only show non-zero values */}
              {data.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {data
                    .filter(entry => entry.value > 0)
                    .map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {entry.name}: {entry.value}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            Tidak ada data
          </div>
        )}
      </CardContent>
    </Card>
  );
}

