"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseCSVFile } from "@/lib/csv-parser";
import { parseExcelFile } from "@/lib/excel-parser";
import { useVulnStore, createWorkbook } from "@/store/vuln-store";
import { useRouter } from "next/navigation";

interface FileUpload {
  file: File;
  status: "pending" | "processing" | "success" | "error";
  vulnerabilities?: number;
  errors?: string[];
}

/**
 * Komponen untuk upload dan import file CSV
 * Mendukung drag & drop multiple files dengan progress indicator
 */
export default function FileUploader() {
  const router = useRouter();
  const { addWorkbook } = useVulnStore();
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newUploads: FileUpload[] = acceptedFiles.map((file) => ({
      file,
      status: "pending" as const,
    }));

    setUploads(newUploads);
    setIsProcessing(true);

    // Process each file
    for (let i = 0; i < newUploads.length; i++) {
      const upload = newUploads[i];
      setUploads((prev) => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: "processing" };
        return updated;
      });

      try {
        let vulnerabilities: any[] = [];
        let errors: string[] = [];
        
        // Check file extension
        const fileExtension = upload.file.name.split('.').pop()?.toLowerCase();
        
        if (fileExtension === 'csv') {
          // Parse CSV file
          const text = await upload.file.text();
          const result = parseCSVFile(text, upload.file.name);
          vulnerabilities = result.vulnerabilities;
          errors = result.errors;
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          // Parse Excel file
          const result = await parseExcelFile(upload.file);
          vulnerabilities = result.vulnerabilities;
          errors = result.errors;
        } else {
          throw new Error(`Format file tidak didukung. Gunakan CSV atau Excel (.xlsx/.xls)`);
        }

        if (vulnerabilities.length > 0) {
          const workbook = createWorkbook(vulnerabilities, upload.file.name);
          addWorkbook(workbook);

          setUploads((prev) => {
            const updated = [...prev];
            updated[i] = {
              ...updated[i],
              status: "success",
              vulnerabilities: vulnerabilities.length,
              errors: errors.length > 0 ? errors : undefined,
            };
            return updated;
          });

          // Navigate to workbook detail
          setTimeout(() => {
            router.push(`/workbook/${workbook.id}`);
          }, 1000);
        } else {
          throw new Error("Tidak ada vulnerability yang ditemukan dalam file");
        }
      } catch (error) {
        setUploads((prev) => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            status: "error",
            errors: [error instanceof Error ? error.message : "Unknown error"],
          };
          return updated;
        });
      }
    }

    setIsProcessing(false);
  }, [addWorkbook, router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: true,
  });

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-slate-300 dark:border-slate-700 hover:border-primary/50"
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
          {isDragActive
            ? "Lepaskan file di sini"
            : "Drag & drop file CSV atau Excel di sini, atau klik untuk memilih"}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Mendukung multiple files. Format: CSV atau Excel (.xlsx/.xls) dengan delimiter semicolon (;)
        </p>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            File yang diupload:
          </h3>
          {uploads.map((upload, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <File className="h-5 w-5 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {upload.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {upload.status === "pending" && (
                        <Badge variant="outline">Menunggu</Badge>
                      )}
                      {upload.status === "processing" && (
                        <Badge variant="outline" className="animate-pulse">
                          Memproses...
                        </Badge>
                      )}
                      {upload.status === "success" && (
                        <>
                          <Badge className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Berhasil
                          </Badge>
                          {upload.vulnerabilities && (
                            <span className="text-xs text-slate-500">
                              {upload.vulnerabilities} vulnerabilities
                            </span>
                          )}
                        </>
                      )}
                      {upload.status === "error" && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      )}
                    </div>
                    {upload.errors && upload.errors.length > 0 && (
                      <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                        <p className="font-medium">Errors:</p>
                        <ul className="list-disc list-inside">
                          {upload.errors.slice(0, 3).map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {upload.status !== "processing" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUpload(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

