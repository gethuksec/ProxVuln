"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkbookData } from "@/types/vulnerability";
import { formatRiskLevel, getRiskColor, getStatusColor, getStatusBgColor } from "@/utils/formatters";
import { RiskLevel } from "@/types/vulnerability";
import { Shield, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface ExecutiveSummaryProps {
  workbook: WorkbookData;
}

/**
 * Komponen Executive Summary untuk presentasi ke klien
 * Menampilkan ringkasan eksekutif yang mudah dipahami
 */
export default function ExecutiveSummary({ workbook }: ExecutiveSummaryProps) {
  const criticalCount = workbook.riskDistribution.Critical || 0;
  const highCount = workbook.riskDistribution.High || 0;
  const closedCount = workbook.statusDistribution.Closed || 0;

  return (
    <Card className="border-2 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-slate-600" />
          <CardTitle className="text-2xl">Executive Summary</CardTitle>
        </div>
        <CardDescription>
          Ringkasan eksekutif untuk {workbook.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="text-center p-5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Total Temuan
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {workbook.totalVulnerabilities}
            </p>
          </div>
          {(criticalCount + highCount) > 0 ? (
            <div className="text-center p-5 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 mb-2 flex items-center justify-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Kritis/Tinggi
              </p>
              <p className="text-2xl font-bold text-red-600">
                {criticalCount + highCount}
              </p>
            </div>
          ) : (
            <div className="text-center p-5 bg-slate-50 dark:bg-slate-900 rounded-lg opacity-50 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-400 mb-2 flex items-center justify-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Kritis/Tinggi
              </p>
              <p className="text-2xl font-bold text-slate-400">-</p>
            </div>
          )}
          {closedCount > 0 ? (
            <div className="text-center p-5 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400 mb-2 flex items-center justify-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Ditutup
              </p>
              <p className="text-2xl font-bold text-green-600">{closedCount}</p>
            </div>
          ) : (
            <div className="text-center p-5 bg-slate-50 dark:bg-slate-900 rounded-lg opacity-50 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-400 mb-2 flex items-center justify-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Ditutup
              </p>
              <p className="text-2xl font-bold text-slate-400">-</p>
            </div>
          )}
          <div className="text-center p-5 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
              Progress
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {workbook.progressPercentage}%
            </p>
          </div>
        </div>

        {/* Risk Distribution */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
            Distribusi Risiko
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(workbook.riskDistribution)
              .filter(([_, count]) => count > 0)
              .map(([risk, count]) => (
                <Badge
                  key={risk}
                  style={{
                    backgroundColor: getRiskColor(risk as RiskLevel),
                    color: "white",
                    fontSize: "0.875rem",
                    padding: "0.5rem 1rem",
                  }}
                >
                  {formatRiskLevel(risk as RiskLevel)}: {count}
                </Badge>
              ))}
          </div>
        </div>

        {/* Risk Reduction */}
        {workbook.averageRiskReduction && workbook.averageRiskReduction > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Efektivitas Mitigasi
            </h3>
            <p className="text-3xl font-bold text-green-600 mb-1">
              {workbook.averageRiskReduction}%
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Rata-rata penurunan risiko dari Inheren ke Residual
            </p>
          </div>
        )}

        {/* Status Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
            Status Mitigasi
          </h3>
          <div className="flex flex-wrap gap-4">
            {workbook.statusDistribution.Open > 0 && (
              <div 
                className="text-center p-3 rounded flex-1 min-w-[120px]"
                style={{ backgroundColor: getStatusBgColor("open") }}
              >
                <p 
                  className="text-2xl font-bold"
                  style={{ color: getStatusColor("open") }}
                >
                  {workbook.statusDistribution.Open}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Terbuka</p>
              </div>
            )}
            {workbook.statusDistribution["In Progress"] > 0 && (
              <div 
                className="text-center p-3 rounded flex-1 min-w-[120px]"
                style={{ backgroundColor: getStatusBgColor("in progress") }}
              >
                <p 
                  className="text-2xl font-bold"
                  style={{ color: getStatusColor("in progress") }}
                >
                  {workbook.statusDistribution["In Progress"]}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Dalam Proses</p>
              </div>
            )}
            {workbook.statusDistribution.Closed > 0 && (
              <div 
                className="text-center p-3 rounded flex-1 min-w-[120px]"
                style={{ backgroundColor: getStatusBgColor("closed") }}
              >
                <p 
                  className="text-2xl font-bold"
                  style={{ color: getStatusColor("closed") }}
                >
                  {workbook.statusDistribution.Closed}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Ditutup</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

