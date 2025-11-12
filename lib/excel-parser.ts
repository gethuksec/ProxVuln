import * as XLSX from "xlsx";
import { parseCSVFile } from "./csv-parser";

/**
 * Parse Excel file (.xlsx, .xls) dan convert ke CSV format
 * Kemudian parse menggunakan CSV parser yang sudah ada
 */
export async function parseExcelFile(
  file: File
): Promise<{ vulnerabilities: any[]; errors: string[] }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Ambil sheet pertama
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert ke CSV string
    const csvString = XLSX.utils.sheet_to_csv(worksheet, {
      FS: ";", // Semicolon delimiter seperti CSV yang digunakan
      blankrows: false,
    });

    // Parse menggunakan CSV parser yang sudah ada
    return parseCSVFile(csvString, file.name);
  } catch (error) {
    return {
      vulnerabilities: [],
      errors: [
        error instanceof Error
          ? `Error parsing Excel file: ${error.message}`
          : "Unknown error parsing Excel file",
      ],
    };
  }
}

