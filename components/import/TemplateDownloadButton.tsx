"use client";

import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import { downloadCSVTemplate, generateExcelTemplate } from "@/lib/template-generator";

interface TemplateDownloadButtonProps {
  type: "csv" | "excel";
}

/**
 * Komponen tombol untuk download template CSV atau Excel
 */
export default function TemplateDownloadButton({ type }: TemplateDownloadButtonProps) {
  const handleDownload = () => {
    if (type === "csv") {
      downloadCSVTemplate();
    } else {
      generateExcelTemplate();
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {type === "csv" ? (
        <>
          <FileText className="h-4 w-4" />
          Download CSV Template
        </>
      ) : (
        <>
          <FileSpreadsheet className="h-4 w-4" />
          Download Excel Template
        </>
      )}
    </Button>
  );
}

