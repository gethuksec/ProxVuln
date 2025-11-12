"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVulnStore } from "@/store/vuln-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VulnerabilityTable from "@/components/workbook/VulnerabilityTable";
import RiskChart from "@/components/workbook/RiskChart";
import RiskComparisonChart from "@/components/workbook/RiskComparisonChart";
import RiskReductionMetrics from "@/components/workbook/RiskReductionMetrics";
import RiskHeatmap from "@/components/workbook/RiskHeatmap";
import RemediationTimeline from "@/components/workbook/RemediationTimeline";
import QuickStats from "@/components/workbook/QuickStats";
import ExecutiveSummary from "@/components/dashboard/ExecutiveSummary";
import StatsCard from "@/components/dashboard/StatsCard";
import ExpirationTimer from "@/components/dashboard/ExpirationTimer";
import ExportDialog from "@/components/export/ExportDialog";
import ExcelView from "@/components/workbook/ExcelView";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { formatDateTime } from "@/utils/date-helpers";
import { ArrowLeft, FileText, Download } from "lucide-react";

/**
 * Halaman detail workbook
 * Menampilkan statistik, chart, dan tabel vulnerability
 */
export default function WorkbookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getWorkbook } = useVulnStore();
  const workbookId = params.id as string;

  const workbook = getWorkbook(workbookId);

  useEffect(() => {
    if (!workbook) {
      router.push("/");
    }
  }, [workbook, router]);

  if (!workbook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">Workbook tidak ditemukan</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Theme Toggle - Top Right */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-slate-600 dark:text-slate-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {workbook.name}
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Diimport: {formatDateTime(workbook.uploadedAt)}
          </p>
        </div>

        {/* Export Button - Paling Atas */}
        <div className="mb-6 flex justify-end">
          <ExportDialog workbook={workbook} />
        </div>

        {/* Expiration Timer */}
        <ExpirationTimer expiresAt={workbook.expiresAt} />

        {/* Executive Summary */}
        <div className="mb-10">
          <ExecutiveSummary workbook={workbook} />
        </div>

        {/* Quick Stats */}
        <div className="mb-10">
          <QuickStats workbook={workbook} />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatsCard
            title="Total Vulnerabilities"
            value={workbook.totalVulnerabilities.toString()}
            description="Total temuan kerentanan"
          />
          <StatsCard
            title="Progress"
            value={`${workbook.progressPercentage}%`}
            description="Vulnerabilities yang sudah ditutup"
          />
          <StatsCard
            title="Open"
            value={workbook.statusDistribution.Open.toString()}
            description="Masih terbuka"
          />
          <StatsCard
            title="Closed"
            value={workbook.statusDistribution.Closed.toString()}
            description="Sudah ditutup"
          />
        </div>

        {/* Risk Reduction Metrics */}
        {workbook.averageRiskReduction && workbook.averageRiskReduction > 0 && (
          <div className="mb-10">
            <RiskReductionMetrics
              vulnerabilities={workbook.vulnerabilities}
              averageRiskReduction={workbook.averageRiskReduction}
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <RiskChart riskDistribution={workbook.riskDistribution} />
          <RiskComparisonChart
            riskDistributionInheren={workbook.riskDistributionInheren}
            riskDistributionResidual={workbook.riskDistributionResidual}
          />
        </div>

        {/* Additional Visualizations */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <RemediationTimeline vulnerabilities={workbook.vulnerabilities} />
        </div>

        {/* Risk Heatmap */}
        <div className="mb-10">
          <RiskHeatmap vulnerabilities={workbook.vulnerabilities} />
        </div>

        {/* Vulnerability Table */}
        <div className="mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Vulnerabilities</CardTitle>
              <CardDescription>
                {workbook.totalVulnerabilities} vulnerabilities ditemukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VulnerabilityTable vulnerabilities={workbook.vulnerabilities} />
            </CardContent>
          </Card>
        </div>

        {/* Excel View - Paling Bawah */}
        <div className="mb-10">
          <ExcelView vulnerabilities={workbook.vulnerabilities} />
        </div>
      </div>
    </div>
  );
}

