"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVulnStore } from "@/store/vuln-store";
import FileUploader from "@/components/import/FileUploader";
import TemplateDownloadButton from "@/components/import/TemplateDownloadButton";
import WorkbookList from "@/components/dashboard/WorkbookList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Dashboard utama - halaman home
 * Menampilkan upload zone dan daftar workbook yang sudah diimport
 */
export default function HomePage() {
  const router = useRouter();
  const { getAllWorkbooks, startAutoCleanup } = useVulnStore();

  useEffect(() => {
    // Start auto-cleanup saat app dimuat
    startAutoCleanup();
  }, [startAutoCleanup]);

  const workbooks = getAllWorkbooks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Theme Toggle - Top Right */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            ProxVuln
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Vulnerability Management & Reporting Tool
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Import File Vulnerability</CardTitle>
            <CardDescription>
              Upload file CSV atau Excel (.xlsx/.xls) vulnerability untuk memulai analisis. Data akan disimpan di memory browser dan otomatis dihapus setelah 1 jam. Gunakan template di bawah untuk memastikan format file sesuai.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Downloads */}
            <div className="border-t border-b border-slate-200 dark:border-slate-700 py-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Download Template:
              </h3>
              <div className="flex flex-wrap gap-3">
                <TemplateDownloadButton type="csv" />
                <TemplateDownloadButton type="excel" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                Template berisi contoh 10 temuan OWASP Top 10 dengan format yang benar. Silakan gunakan sebagai referensi untuk mengisi data vulnerability Anda.
              </p>
            </div>
            
            {/* File Uploader */}
            <FileUploader />
          </CardContent>
        </Card>

        {/* Workbook List */}
        {workbooks.length > 0 ? (
          <WorkbookList workbooks={workbooks} />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                Belum ada workbook yang diimport. Upload file CSV untuk memulai.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

