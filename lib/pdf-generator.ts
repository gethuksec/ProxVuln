import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { WorkbookData, Vulnerability, RiskLevel } from "@/types/vulnerability";
import { formatDate, formatDateTime } from "@/utils/date-helpers";
import { formatRiskLevel, getRiskColor, formatStatus } from "@/utils/formatters";

/**
 * Helper untuk convert hex color ke RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Draw simple bar chart untuk risk distribution
 */
function drawRiskChart(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  data: Array<{ label: string; value: number; color: string }>
): number {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = (width - 20) / data.length;
  const chartHeight = height - 30;
  
  // Draw bars
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const barX = x + 10 + (index * barWidth) + 5;
    const barY = y + chartHeight - barHeight + 20;
    
    const color = hexToRgb(item.color);
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(barX, barY, barWidth - 10, barHeight, "F");
    
    // Label
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(item.label, barX + (barWidth - 10) / 2, y + height - 5, { align: "center" });
    
    // Value
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text(item.value.toString(), barX + (barWidth - 10) / 2, barY - 3, { align: "center" });
  });
  
  // Y-axis label
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Count", x - 5, y + height / 2, { align: "center", angle: 90 });
  
  return y + height;
}

/**
 * Generate PDF report untuk workbook dengan visualisasi lengkap
 */
export function generateWorkbookPDF(workbook: WorkbookData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Background color biru elegan (light blue gradient effect)
  const bgColor = { r: 240, g: 247, b: 255 }; // #F0F7FF - biru elegan

  // Helper untuk draw background
  const drawPageBackground = () => {
    try {
      doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
    } catch (error) {
      console.warn("Background error:", error);
    }
  };

  // Helper untuk draw watermark - dipanggil SETELAH konten ditulis
  const drawWatermark = () => {
    try {
      // Gunakan unique code dari workbook.id
      const watermarkText = workbook.id.toUpperCase();
      
      // Set semi-transparent dengan GState
      doc.saveGraphicsState();
      const gState = doc.GState({ opacity: 0.15 }); // Semi-transparent (15% opacity)
      if (gState) {
        doc.setGState(gState);
      }
      
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(32); // Lebih kecil dari sebelumnya (48)
      doc.setFont("helvetica", "bold");
      const angle = -45;
      const x = pageWidth / 2;
      const y = pageHeight / 2;
      doc.text(watermarkText, x, y, { angle: angle, align: "center" });
      
      doc.restoreGraphicsState();
      // Reset text color
      doc.setTextColor(30, 30, 30);
    } catch (error) {
      // Jika watermark error, skip saja - tidak critical
      console.warn("Watermark error (non-critical):", error);
    }
  };

  // Helper untuk add new page jika perlu
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      drawPageBackground();
      // Jangan panggil watermark di sini - akan dipanggil di akhir untuk semua halaman
      yPosition = 20;
    }
  };

  // Cover Page - dengan background
  drawPageBackground();
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Vulnerability Management Report", pageWidth / 2, 60, { align: "center" });
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(workbook.name, pageWidth / 2, 80, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${formatDateTime(new Date())}`, pageWidth / 2, 100, { align: "center" });
  doc.text(`Total Vulnerabilities: ${workbook.totalVulnerabilities}`, pageWidth / 2, 110, { align: "center" });

  doc.addPage();
  drawPageBackground();
  yPosition = 20;

  // Executive Summary
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Executive Summary", 20, yPosition);
  yPosition += 12;

  // Narasi Executive Summary dengan formatting yang lebih baik
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  
  const criticalHighCount = (workbook.riskDistribution.Critical || 0) + (workbook.riskDistribution.High || 0);
  const closedCount = workbook.statusDistribution.Closed || 0;
  const inProgressCount = workbook.statusDistribution["Parsial"] || 0;
  const openCount = workbook.statusDistribution.Open || 0;
  
  // Paragraph 1: Introduction
  checkNewPage(10);
  doc.setFont("helvetica", "normal");
  const introText = `Laporan ini menyajikan ringkasan eksekutif dari hasil assessment keamanan untuk ${workbook.name}.`;
  const introLines = doc.splitTextToSize(introText, pageWidth - 40);
  introLines.forEach((line: string) => {
    checkNewPage(8);
    doc.text(line, 20, yPosition);
    yPosition += 7;
  });
  yPosition += 5;

  // Paragraph 2: Total Findings
  checkNewPage(10);
  doc.setFont("helvetica", "normal");
  let findingsText = `Total temuan kerentanan yang teridentifikasi adalah ${workbook.totalVulnerabilities} vulnerabilities`;
  if (criticalHighCount > 0) {
    findingsText += `, dengan ${criticalHighCount} di antaranya dikategorikan sebagai risiko Kritis atau Tinggi yang memerlukan penanganan segera.`;
  } else {
    findingsText += `, dengan fokus pada identifikasi dan remediasi kerentanan yang ditemukan.`;
  }
  const findingsLines = doc.splitTextToSize(findingsText, pageWidth - 40);
  findingsLines.forEach((line: string) => {
    checkNewPage(8);
    doc.text(line, 20, yPosition);
    yPosition += 7;
  });
  yPosition += 5;

  // Paragraph 3: Mitigation Status
  checkNewPage(10);
  doc.setFont("helvetica", "bold");
  doc.text("Status Mitigasi", 20, yPosition);
  yPosition += 8;
  doc.setFont("helvetica", "normal");
  
  let statusText = "Status mitigasi menunjukkan bahwa ";
  const statusParts: string[] = [];
  if (closedCount > 0) {
    statusParts.push(`${closedCount} vulnerabilities telah berhasil ditutup (Closed)`);
  }
  if (inProgressCount > 0) {
    statusParts.push(`${inProgressCount} vulnerabilities sedang dalam proses remediasi (Parsial)`);
  }
  if (openCount > 0) {
    statusParts.push(`${openCount} vulnerabilities masih terbuka (Open) dan menunggu penanganan lebih lanjut`);
  }
  
  if (statusParts.length > 0) {
    statusText += statusParts.join(", ");
    const statusLines = doc.splitTextToSize(statusText, pageWidth - 40);
    statusLines.forEach((line: string) => {
      checkNewPage(8);
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    yPosition += 5;
  } else {
    doc.text("Status mitigasi sedang dalam proses evaluasi.", 20, yPosition);
    yPosition += 12;
  }

  // Paragraph 4: Risk Reduction (if available)
  if (workbook.averageRiskReduction && workbook.averageRiskReduction > 0) {
    checkNewPage(10);
    doc.setFont("helvetica", "bold");
    doc.text("Efektivitas Mitigasi", 20, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    const reductionText = `Efektivitas program mitigasi yang telah diimplementasikan menunjukkan penurunan risiko rata-rata sebesar ${workbook.averageRiskReduction}%, yang mengindikasikan bahwa upaya remediasi yang dilakukan telah berhasil mengurangi tingkat risiko dari kondisi inheren ke kondisi residual.`;
    const reductionLines = doc.splitTextToSize(reductionText, pageWidth - 40);
    reductionLines.forEach((line: string) => {
      checkNewPage(8);
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    yPosition += 5;
  }

  // Paragraph 5: Overall Progress
  checkNewPage(10);
  doc.setFont("helvetica", "bold");
  doc.text("Progress Keseluruhan", 20, yPosition);
  yPosition += 8;
  doc.setFont("helvetica", "normal");
  const progressText = `Progress keseluruhan dari program remediasi mencapai ${workbook.progressPercentage}%, yang mencerminkan komitmen organisasi dalam meningkatkan postur keamanan informasi.`;
  const progressLines = doc.splitTextToSize(progressText, pageWidth - 40);
  progressLines.forEach((line: string) => {
    checkNewPage(8);
    doc.text(line, 20, yPosition);
    yPosition += 7;
  });
  yPosition += 5;

  yPosition += 10;

  // Summary Table
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text("Ringkasan Metrik", 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const summaryData = [
    ["Total Vulnerabilities", workbook.totalVulnerabilities.toString()],
    ["Progress", `${workbook.progressPercentage}%`],
    ["Open", workbook.statusDistribution.Open.toString()],
    ["Parsial", workbook.statusDistribution["Parsial"].toString()],
    ["Closed", workbook.statusDistribution.Closed.toString()],
  ];

  if (workbook.averageRiskReduction && workbook.averageRiskReduction > 0) {
    summaryData.push(["Average Risk Reduction", `${workbook.averageRiskReduction}%`]);
  }

  autoTable(doc, {
    startY: yPosition,
    head: [["Metrik", "Nilai"]],
    body: summaryData,
    theme: "striped",
    headStyles: { fillColor: [30, 30, 30] },
    margin: { left: 20, right: 20 },
    styles: { fontSize: 9 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Risk Distribution Chart
  checkNewPage(80);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Risk Distribution", 20, yPosition);
  yPosition += 10;

  const riskChartData = (["Critical", "High", "Medium", "Low"] as RiskLevel[])
    .filter(risk => (workbook.riskDistribution[risk] || 0) > 0)
    .map(risk => ({
      label: formatRiskLevel(risk),
      value: workbook.riskDistribution[risk] || 0,
      color: getRiskColor(risk),
    }));

  if (riskChartData.length > 0) {
    yPosition = drawRiskChart(doc, 20, yPosition, pageWidth - 40, 60, riskChartData);
    yPosition += 10;
  }

  // Risk Distribution Table
  checkNewPage(40);
  const riskData = Object.entries(workbook.riskDistribution)
    .filter(([_, count]) => count > 0)
    .map(([risk, count]) => [formatRiskLevel(risk as RiskLevel), count.toString()]);

  autoTable(doc, {
    startY: yPosition,
    head: [["Risk Level", "Count"]],
    body: riskData,
    theme: "striped",
    headStyles: { fillColor: [30, 30, 30] },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Risk Comparison (Inheren vs Residual)
  if (workbook.riskDistributionInheren && workbook.riskDistributionResidual) {
    checkNewPage(100);
    doc.setFontSize(16);
    doc.text("Risk Comparison: Inheren vs Residual", 20, yPosition);
    yPosition += 10;

    // Comparison Chart
    const comparisonData = (["Critical", "High", "Medium", "Low"] as RiskLevel[])
      .filter(risk => 
        (workbook.riskDistributionInheren[risk] || 0) > 0 || 
        (workbook.riskDistributionResidual[risk] || 0) > 0
      )
      .map(risk => ({
        label: formatRiskLevel(risk),
        inheren: workbook.riskDistributionInheren[risk] || 0,
        residual: workbook.riskDistributionResidual[risk] || 0,
        color: getRiskColor(risk),
      }));

    if (comparisonData.length > 0) {
      const maxValue = Math.max(
        ...comparisonData.map(d => Math.max(d.inheren, d.residual)),
        1
      );
      const barWidth = (pageWidth - 60) / comparisonData.length;
      const chartHeight = 50;
      const barHeight = chartHeight - 20;

      comparisonData.forEach((item, index) => {
        const x = 20 + 10 + (index * barWidth);
        const baseY = yPosition + 20;

        // Inheren bar
        const inherenBarHeight = (item.inheren / maxValue) * barHeight;
        const inherenColor = hexToRgb(getRiskColor("High"));
        doc.setFillColor(inherenColor.r, inherenColor.g, inherenColor.b);
        doc.rect(x, baseY + barHeight - inherenBarHeight, (barWidth - 20) / 2, inherenBarHeight, "F");

        // Residual bar
        const residualBarHeight = (item.residual / maxValue) * barHeight;
        const residualColor = hexToRgb(getRiskColor("Low"));
        doc.setFillColor(residualColor.r, residualColor.g, residualColor.b);
        doc.rect(x + (barWidth - 20) / 2 + 2, baseY + barHeight - residualBarHeight, (barWidth - 20) / 2, residualBarHeight, "F");

        // Label
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        doc.text(item.label, x + (barWidth - 20) / 2, baseY + barHeight + 8, { align: "center" });

        // Values
        doc.setFontSize(7);
        doc.setTextColor(30, 30, 30);
        if (item.inheren > 0) {
          doc.text(`I:${item.inheren}`, x + (barWidth - 20) / 4, baseY + barHeight - inherenBarHeight - 3, { align: "center" });
        }
        if (item.residual > 0) {
          doc.text(`R:${item.residual}`, x + (barWidth - 20) * 3 / 4, baseY + barHeight - residualBarHeight - 3, { align: "center" });
        }
      });

      // Legend
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text("I = Inheren, R = Residual", pageWidth / 2, yPosition + chartHeight + 5, { align: "center" });
      yPosition += chartHeight + 15;
    }

    // Comparison Table
    checkNewPage(40);
    const comparisonTableData = (["Critical", "High", "Medium", "Low"] as RiskLevel[])
      .filter(risk => 
        (workbook.riskDistributionInheren[risk] || 0) > 0 || 
        (workbook.riskDistributionResidual[risk] || 0) > 0
      )
      .map(risk => [
        formatRiskLevel(risk),
        (workbook.riskDistributionInheren[risk] || 0).toString(),
        (workbook.riskDistributionResidual[risk] || 0).toString(),
      ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Risk Level", "Inheren", "Residual"]],
      body: comparisonTableData,
      theme: "striped",
      headStyles: { fillColor: [30, 30, 30] },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Status Distribution
  checkNewPage(60);
  doc.setFontSize(16);
  doc.text("Status Distribution", 20, yPosition);
  yPosition += 10;

  const statusData = [
    ["Open", workbook.statusDistribution.Open.toString()],
    ["Parsial", workbook.statusDistribution["Parsial"].toString()],
    ["Closed", workbook.statusDistribution.Closed.toString()],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [["Status", "Count"]],
    body: statusData,
    theme: "striped",
    headStyles: { fillColor: [30, 30, 30] },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Risk Reduction Summary (if available)
  if (workbook.averageRiskReduction && workbook.averageRiskReduction > 0) {
    checkNewPage(40);
    doc.setFontSize(16);
    doc.text("Risk Reduction Summary", 20, yPosition);
    yPosition += 10;

    const reductionData = [
      ["Average Risk Reduction", `${workbook.averageRiskReduction}%`],
      ["Vulnerabilities with Retest", workbook.vulnerabilities.filter(v => v.retestRiskLevel).length.toString()],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: reductionData,
      theme: "striped",
      headStyles: { fillColor: [30, 30, 30] },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Detailed Vulnerabilities
  workbook.vulnerabilities.forEach((vuln, index) => {
    // For first vulnerability, check if we need new page
    // For subsequent vulnerabilities, always start on new page
    if (index > 0) {
      doc.addPage();
      drawPageBackground();
      yPosition = 20;
    } else {
      // Check if we need a new page for first vulnerability
      checkNewPage(100);
    }

    // Vulnerability Header
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(`${vuln.id}: ${vuln.namaKerentanan}`, 20, yPosition);
    yPosition += 10;

    // Risk Level Badge
    const riskLevel = vuln.calculatedRiskLevel || "Low";
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    const riskColor = hexToRgb(getRiskColor(riskLevel));
    doc.setFillColor(riskColor.r, riskColor.g, riskColor.b);
    doc.roundedRect(20, yPosition - 5, 40, 8, 2, 2, "F");
    doc.text(formatRiskLevel(riskLevel), 25, yPosition);
    yPosition += 15;

    // Basic Info Table
    const basicInfo = [
      ["MSTG/WSTG", vuln.mstgWstg || "-"],
      ["Objek Terdampak", vuln.objekTerdampak || "-"],
      ["Status", formatStatus(vuln.retest1 || vuln.statusMitigasi)],
      ["Person in Charge", vuln.pj || "-"],
      ["Deadline", vuln.tenggat || "-"],
    ];

    if (vuln.initialRiskLevel) {
      basicInfo.push(["Risk Inheren", formatRiskLevel(vuln.initialRiskLevel)]);
    }
    if (vuln.retestRiskLevel) {
      basicInfo.push(["Risk Residual", formatRiskLevel(vuln.retestRiskLevel)]);
      if (vuln.riskReductionPercentage !== undefined) {
        basicInfo.push(["Risk Reduction", `${vuln.riskReductionPercentage}%`]);
      }
    }

    autoTable(doc, {
      startY: yPosition,
      body: basicInfo,
      theme: "plain",
      styles: { fontSize: 9 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: "auto" },
      },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Description
    checkNewPage(40);
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text("Deskripsi:", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const descriptionLines = doc.splitTextToSize(vuln.deskripsi || "-", pageWidth - 40);
    descriptionLines.forEach((line: string) => {
      checkNewPage(10);
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });

    yPosition += 5;

    // Recommendations
    checkNewPage(40);
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text("Rekomendasi/Mitigasi:", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const recLines = doc.splitTextToSize(vuln.rekomendasiMitigasi || "-", pageWidth - 40);
    recLines.forEach((line: string) => {
      checkNewPage(10);
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });

    yPosition += 10;
  });

  // Footer dan watermark pada setiap halaman
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Tulis footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages} - ProxVuln Report`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      formatDate(new Date(), "dd MMMM yyyy"),
      pageWidth - 20,
      pageHeight - 10,
      { align: "right" }
    );
    
    // Watermark dipanggil terakhir dengan warna sangat terang
    drawWatermark();
  }

  // Save PDF
  doc.save(`${workbook.name}-report-${Date.now()}.pdf`);
}

/**
 * Generate PDF untuk single vulnerability
 */
export function generateVulnerabilityPDF(vulnerability: Vulnerability, workbookName: string): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text("Vulnerability Detail Report", pageWidth / 2, 30, { align: "center" });
  
  doc.setFontSize(14);
  doc.text(`${vulnerability.id}: ${vulnerability.namaKerentanan}`, pageWidth / 2, 45, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Workbook: ${workbookName}`, pageWidth / 2, 55, { align: "center" });
  doc.text(`Generated: ${formatDateTime(new Date())}`, pageWidth / 2, 62, { align: "center" });

  yPosition = 75;

  // Risk Level
  const riskLevel = vulnerability.calculatedRiskLevel || "Low";
  const riskColor = hexToRgb(getRiskColor(riskLevel));
  doc.setFillColor(riskColor.r, riskColor.g, riskColor.b);
  doc.roundedRect(20, yPosition, 50, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(formatRiskLevel(riskLevel), 25, yPosition + 7);
  
  yPosition += 20;

  // Basic Information
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Informasi Dasar", 20, yPosition);
  yPosition += 10;

  const basicInfo = [
    ["ID", vulnerability.id],
    ["Nama Kerentanan", vulnerability.namaKerentanan],
    ["MSTG/WSTG", vulnerability.mstgWstg || "-"],
    ["Objek Terdampak", vulnerability.objekTerdampak || "-"],
    ["Jalur Lokasi", vulnerability.jalurLokasiTerdampak || "-"],
    ["Status", formatStatus(vulnerability.retest1 || vulnerability.statusMitigasi)],
    ["Person in Charge", vulnerability.pj || "-"],
    ["Deadline", vulnerability.tenggat || "-"],
  ];

  if (vulnerability.initialRiskLevel) {
    basicInfo.push(["Risk Inheren", formatRiskLevel(vulnerability.initialRiskLevel)]);
  }
  if (vulnerability.retestRiskLevel) {
    basicInfo.push(["Risk Residual", formatRiskLevel(vulnerability.retestRiskLevel)]);
    if (vulnerability.riskReductionPercentage !== undefined) {
      basicInfo.push(["Risk Reduction", `${vulnerability.riskReductionPercentage}%`]);
    }
  }

  autoTable(doc, {
    startY: yPosition,
    body: basicInfo,
    theme: "striped",
    headStyles: { fillColor: [30, 30, 30] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: "auto" },
    },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Description
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Deskripsi", 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const descLines = doc.splitTextToSize(vulnerability.deskripsi || "-", pageWidth - 40);
  descLines.forEach((line: string) => {
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Recommendations
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Rekomendasi/Mitigasi", 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const recLines = doc.splitTextToSize(vulnerability.rekomendasiMitigasi || "-", pageWidth - 40);
  recLines.forEach((line: string) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `ProxVuln Report - ${formatDate(new Date(), "dd MMMM yyyy")}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );

  doc.save(`${vulnerability.id}-report-${Date.now()}.pdf`);
}
