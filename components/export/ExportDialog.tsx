"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkbookData } from "@/types/vulnerability";
import { generateWorkbookPDF } from "@/lib/pdf-generator";
import { generateWorkbookHTML } from "@/lib/html-generator";
import { Download, FileText, File } from "lucide-react";

interface ExportDialogProps {
  workbook: WorkbookData;
}

/**
 * Komponen dialog untuk export workbook ke PDF atau HTML
 */
export default function ExportDialog({ workbook }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "html" | null>(null);

  const handleExportPDF = () => {
    setIsExporting(true);
    setExportType("pdf");
    try {
      generateWorkbookPDF(workbook);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error saat generate PDF. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleExportHTML = () => {
    setIsExporting(true);
    setExportType("html");
    try {
      generateWorkbookHTML(workbook);
    } catch (error) {
      console.error("Error generating HTML:", error);
      alert("Error saat generate HTML. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExportPDF}
        disabled={isExporting}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        {isExporting && exportType === "pdf" ? (
          <>
            <FileText className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Export PDF
          </>
        )}
      </Button>
      <Button
        onClick={handleExportHTML}
        disabled={isExporting}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        {isExporting && exportType === "html" ? (
          <>
            <File className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <File className="h-4 w-4" />
            Export HTML
          </>
        )}
      </Button>
    </div>
  );
}

