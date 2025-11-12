"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vulnerability } from "@/types/vulnerability";
import { formatRiskLevel, getRiskColor, formatStatus, getStatusColor, getRiskValueColor, getRiskValueBgColor } from "@/utils/formatters";
import { FileSpreadsheet } from "lucide-react";
import MSTGWSTGLinks from "@/components/ui/mstg-wstg-links";

interface ExcelViewProps {
  vulnerabilities: Vulnerability[];
}

/**
 * Komponen Excel-like table view untuk menampilkan vulnerabilities
 * Dengan fitur sorting, filtering, dan export
 */
export default function ExcelView({ vulnerabilities }: ExcelViewProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort data
  let filteredData = vulnerabilities.filter((vuln) => {
    const matchesRisk = filterRisk === "all" || vuln.calculatedRiskLevel === filterRisk;
    const matchesSearch =
      searchQuery === "" ||
      vuln.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.namaKerentanan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  // Apply sorting
  if (sortConfig) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Tabel Temuan
            </CardTitle>
            <CardDescription>
              Tabel data vulnerabilities dalam format spreadsheet
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Cari..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-sm"
          />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-sm"
          >
            <option value="all">Semua Risk Level</option>
            <option value="Critical">Kritis</option>
            <option value="High">Tinggi</option>
            <option value="Medium">Sedang</option>
            <option value="Low">Rendah</option>
          </select>
        </div>

        {/* Excel-like Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th
                  className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 select-none"
                  onClick={() => handleSort("id")}
                >
                  No {sortConfig?.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 select-none"
                  onClick={() => handleSort("namaKerentanan")}
                >
                  Nama Kerentanan {sortConfig?.key === "namaKerentanan" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  MSTG/WSTG
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  Risk Level
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  Status
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  PJ
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  Tenggat
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  KI
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  DI
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  RI
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  KR
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  DR
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">
                  RR
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-3 py-8 text-center text-slate-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredData.map((vuln, index) => {
                  const riskLevel = vuln.calculatedRiskLevel || "Low";
                  return (
                    <tr
                      key={vuln.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      style={{ backgroundColor: index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}
                    >
                      <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-700 font-medium">
                        {vuln.id}
                      </td>
                      <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-700 max-w-xs truncate">
                        {vuln.namaKerentanan}
                      </td>
                      <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-700">
                        <MSTGWSTGLinks mstgWstg={vuln.mstgWstg} className="text-xs" />
                      </td>
                      <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-700">
                        <Badge
                          style={{
                            backgroundColor: getRiskColor(riskLevel),
                            color: "white",
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.5rem",
                          }}
                        >
                          {formatRiskLevel(riskLevel)}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-700">
                        <Badge
                          style={{
                            backgroundColor: getStatusColor(vuln.retest1 || vuln.statusMitigasi),
                            color: "white",
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.5rem",
                          }}
                        >
                          {formatStatus(vuln.retest1 || vuln.statusMitigasi)}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-700">
                        {vuln.pj || "-"}
                      </td>
                      <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-700">
                        {vuln.tenggat || "-"}
                      </td>
                      <td 
                        className="px-3 py-2 border-r border-slate-200 dark:border-slate-700 text-center font-medium"
                        style={{
                          backgroundColor: getRiskValueBgColor(vuln.ki),
                          color: getRiskValueColor(vuln.ki),
                        }}
                      >
                        {vuln.ki || "-"}
                      </td>
                      <td 
                        className="px-3 py-2 border-r border-slate-200 dark:border-slate-700 text-center font-medium"
                        style={{
                          backgroundColor: getRiskValueBgColor(vuln.di),
                          color: getRiskValueColor(vuln.di),
                        }}
                      >
                        {vuln.di || "-"}
                      </td>
                      <td 
                        className="px-3 py-2 border-r border-slate-200 dark:border-slate-700 text-center font-medium"
                        style={{
                          backgroundColor: getRiskValueBgColor(vuln.ri),
                          color: getRiskValueColor(vuln.ri),
                        }}
                      >
                        {vuln.ri || "-"}
                      </td>
                      <td 
                        className="px-3 py-2 border-r border-slate-200 dark:border-slate-700 text-center font-medium"
                        style={{
                          backgroundColor: getRiskValueBgColor(vuln.kr),
                          color: getRiskValueColor(vuln.kr),
                        }}
                      >
                        {vuln.kr || "-"}
                      </td>
                      <td 
                        className="px-3 py-2 border-r border-slate-200 dark:border-slate-700 text-center font-medium"
                        style={{
                          backgroundColor: getRiskValueBgColor(vuln.dr),
                          color: getRiskValueColor(vuln.dr),
                        }}
                      >
                        {vuln.dr || "-"}
                      </td>
                      <td 
                        className="px-3 py-2 text-center font-medium"
                        style={{
                          backgroundColor: getRiskValueBgColor(vuln.rr),
                          color: getRiskValueColor(vuln.rr),
                        }}
                      >
                        {vuln.rr || "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Menampilkan {filteredData.length} dari {vulnerabilities.length} vulnerabilities
        </p>
      </CardContent>
    </Card>
  );
}

