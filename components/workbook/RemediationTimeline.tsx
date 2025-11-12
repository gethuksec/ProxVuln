"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Vulnerability } from "@/types/vulnerability";
import { formatDate } from "@/utils/date-helpers";
import { formatStatus } from "@/utils/formatters";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RemediationTimelineProps {
  vulnerabilities: Vulnerability[];
}

/**
 * Komponen Timeline untuk menampilkan progress remediasi
 * Menunjukkan timeline dari initial finding hingga retest
 */
export default function RemediationTimeline({ vulnerabilities }: RemediationTimelineProps) {
  // Group by status
  const byStatus = {
    closed: vulnerabilities.filter(
      (v) => (v.retest1 || v.statusMitigasi)?.toLowerCase().includes("closed")
    ),
    inProgress: vulnerabilities.filter(
      (v) =>
        (v.retest1 || v.statusMitigasi)?.toLowerCase().includes("proses") ||
        (v.retest1 || v.statusMitigasi)?.toLowerCase().includes("progress")
    ),
    open: vulnerabilities.filter(
      (v) =>
        !(v.retest1 || v.statusMitigasi)?.toLowerCase().includes("closed") &&
        !(v.retest1 || v.statusMitigasi)?.toLowerCase().includes("proses")
    ),
  };

  const timelineItems = [
    {
      title: "Initial Finding",
      count: vulnerabilities.length,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Mitigation In Progress",
      count: byStatus.inProgress.length,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
    {
      title: "Retest Completed",
      count: byStatus.closed.length,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remediation Timeline</CardTitle>
        <CardDescription>
          Progress remediasi dari initial finding hingga retest
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineItems.map((item, index) => {
            const Icon = item.icon;
            const percentage =
              vulnerabilities.length > 0
                ? Math.round((item.count / vulnerabilities.length) * 100)
                : 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        item.bgColor
                      )}
                    >
                      <Icon className={cn("h-5 w-5", item.color)} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.count} vulnerabilities
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {percentage}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-500", item.bgColor)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">
            Recent Activity
          </h3>
          <div className="space-y-2">
            {vulnerabilities
              .filter((v) => v.keteranganRemediasi || v.keteranganRetest)
              .slice(0, 5)
              .map((vuln) => (
                <div
                  key={vuln.id}
                  className="text-sm p-2 bg-slate-50 dark:bg-slate-900 rounded"
                >
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {vuln.id}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {vuln.keteranganRetest || vuln.keteranganRemediasi}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

