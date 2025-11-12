"use client";

import { Card, CardContent } from "@/components/ui/card";
import { WorkbookData } from "@/types/vulnerability";
import { TrendingDown, TrendingUp, Target, Zap } from "lucide-react";
import { formatRiskLevel, getRiskColor } from "@/utils/formatters";
import { RiskLevel } from "@/types/vulnerability";
import { cn } from "@/lib/utils";

interface QuickStatsProps {
  workbook: WorkbookData;
}

/**
 * Komponen Quick Stats dengan animasi dan visual menarik
 * Menampilkan statistik penting dalam format yang eye-catching
 */
export default function QuickStats({ workbook }: QuickStatsProps) {
  const criticalHighCount =
    (workbook.riskDistribution.Critical || 0) +
    (workbook.riskDistribution.High || 0);

  const riskReduction = workbook.averageRiskReduction || 0;
  const closedCount = workbook.statusDistribution.Closed || 0;

  const stats = [
    {
      label: "Critical & High",
      value: criticalHighCount,
      total: workbook.totalVulnerabilities,
      icon: Zap,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      description: "Prioritas tinggi",
    },
    {
      label: "Risk Reduction",
      value: `${riskReduction}%`,
      icon: TrendingDown,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      description: "Efektivitas mitigasi",
      show: riskReduction > 0,
    },
    {
      label: "Remediated",
      value: closedCount,
      total: workbook.totalVulnerabilities,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      description: "Sudah ditutup",
    },
    {
      label: "Progress",
      value: `${workbook.progressPercentage}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      description: "Overall progress",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {stats
        .filter((stat) => {
          // Filter out stats yang show === false
          if (stat.show === false) return false;
          // Filter out stats dengan value 0 (kecuali percentage yang valid)
          if (typeof stat.value === 'number' && stat.value === 0) return false;
          // Filter out percentage yang 0%
          if (typeof stat.value === 'string' && stat.value === '0%') return false;
          return true;
        })
        .map((stat, index) => {
          const Icon = stat.icon;
          const percentage = stat.total && typeof stat.value === 'number'
            ? Math.round((stat.value / stat.total) * 100)
            : null;

          return (
            <Card
              key={index}
              className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300 h-full"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className={stat.bgColor + " p-2 rounded-lg"}>
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  {percentage !== null && percentage > 0 && (
                    <span className="text-xs font-medium text-slate-500">
                      {percentage}%
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {stat.value}
                    {stat.total && typeof stat.value === 'number' && stat.value > 0 && (
                      <span className="text-sm font-normal text-slate-500 ml-1">
                        / {stat.total}
                      </span>
                    )}
                  </p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}

