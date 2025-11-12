"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkbookData } from "@/types/vulnerability";
import { formatDateTime, getTimeUntilExpiration } from "@/utils/date-helpers";
import { formatRiskLevel, getRiskColor } from "@/utils/formatters";
import { RiskLevel } from "@/types/vulnerability";
import { FileText, Clock, ArrowRight } from "lucide-react";

interface WorkbookListProps {
  workbooks: WorkbookData[];
}

/**
 * Komponen untuk menampilkan daftar workbook yang sudah diimport
 * Menampilkan statistik cepat dan link ke detail
 */
export default function WorkbookList({ workbooks }: WorkbookListProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Workbook Terimport
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workbooks.map((workbook) => (
          <Card
            key={workbook.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/workbook/${workbook.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {workbook.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Diimport: {formatDateTime(workbook.uploadedAt)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {workbook.totalVulnerabilities}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Progress
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {workbook.progressPercentage}%
                    </p>
                  </div>
                </div>

                {/* Risk Distribution */}
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    Distribusi Risk
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(workbook.riskDistribution).map(
                      ([risk, count]) => {
                        if (count === 0) return null;
                        return (
                          <Badge
                            key={risk}
                            style={{
                              backgroundColor: getRiskColor(risk as RiskLevel),
                              color: "white",
                            }}
                          >
                            {formatRiskLevel(risk as RiskLevel)}: {count}
                          </Badge>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Expiration Timer */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span>{getTimeUntilExpiration(workbook.expiresAt)}</span>
                </div>

                {/* View Button */}
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/workbook/${workbook.id}`);
                  }}
                >
                  Lihat Detail
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

