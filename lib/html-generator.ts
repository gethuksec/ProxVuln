import { WorkbookData, Vulnerability, RiskLevel } from "@/types/vulnerability";
import { formatDate, formatDateTime } from "@/utils/date-helpers";
import { formatRiskLevel, getRiskColor, formatStatus } from "@/utils/formatters";

/**
 * Generate HTML report untuk workbook
 */
export function generateWorkbookHTML(workbook: WorkbookData): void {
  const htmlContent = generateHTMLContent(workbook);
  
  // Create blob dan download
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${workbook.name}-report-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate HTML content untuk workbook
 */
function generateHTMLContent(workbook: WorkbookData): string {
  const criticalHighCount = (workbook.riskDistribution.Critical || 0) + (workbook.riskDistribution.High || 0);
  const closedCount = workbook.statusDistribution.Closed || 0;
  const inProgressCount = workbook.statusDistribution["Parsial"] || 0;
  const openCount = workbook.statusDistribution.Open || 0;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vulnerability Management Report - ${workbook.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background: #f0f7ff;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1e293b;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header h2 {
      color: #475569;
      font-size: 20px;
      font-weight: normal;
    }
    .meta {
      text-align: center;
      color: #64748b;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }
    .stat-label {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #1e293b;
    }
    .risk-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 15px;
    }
    .badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      color: white;
      font-size: 14px;
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background: #f1f5f9;
      font-weight: 600;
      color: #1e293b;
    }
    tr:hover {
      background: #f8fafc;
    }
    .vulnerability-item {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #3b82f6;
    }
    .vulnerability-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .vulnerability-id {
      font-size: 18px;
      font-weight: bold;
      color: #1e293b;
    }
    .risk-level {
      padding: 6px 12px;
      border-radius: 6px;
      color: white;
      font-size: 12px;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      color: #64748b;
      font-size: 12px;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 60px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.05);
      z-index: -1;
      pointer-events: none;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="watermark">${workbook.id.toUpperCase()}</div>
  <div class="container">
    <div class="header">
      <h1>Vulnerability Management Report</h1>
      <h2>${workbook.name}</h2>
    </div>
    
    <div class="meta">
      <p>Generated: ${formatDateTime(new Date())}</p>
      <p>Total Vulnerabilities: ${workbook.totalVulnerabilities}</p>
    </div>

    <div class="section">
      <div class="section-title">Executive Summary</div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Temuan</div>
          <div class="stat-value">${workbook.totalVulnerabilities}</div>
        </div>
        ${criticalHighCount > 0 ? `
        <div class="stat-card" style="border-left-color: #ef4444;">
          <div class="stat-label">Kritis/Tinggi</div>
          <div class="stat-value" style="color: #ef4444;">${criticalHighCount}</div>
        </div>
        ` : ''}
        ${closedCount > 0 ? `
        <div class="stat-card" style="border-left-color: #10b981;">
          <div class="stat-label">Ditutup</div>
          <div class="stat-value" style="color: #10b981;">${closedCount}</div>
        </div>
        ` : ''}
        <div class="stat-card" style="border-left-color: #3b82f6;">
          <div class="stat-label">Progress</div>
          <div class="stat-value" style="color: #3b82f6;">${workbook.progressPercentage}%</div>
        </div>
      </div>
      
      <div style="margin-top: 20px;">
        <h3 style="font-size: 16px; margin-bottom: 10px;">Distribusi Risiko</h3>
        <div class="risk-badges">
          ${Object.entries(workbook.riskDistribution)
            .filter(([_, count]) => count > 0)
            .map(([risk, count]) => {
              const color = getRiskColor(risk as RiskLevel);
              return `<span class="badge" style="background-color: ${color};">${formatRiskLevel(risk as RiskLevel)}: ${count}</span>`;
            })
            .join('')}
        </div>
      </div>

      <div style="margin-top: 20px;">
        <h3 style="font-size: 16px; margin-bottom: 10px;">Status Mitigasi</h3>
        <div class="risk-badges">
          ${openCount > 0 ? `<span class="badge" style="background-color: #dc2626;">Terbuka: ${openCount}</span>` : ''}
          ${inProgressCount > 0 ? `<span class="badge" style="background-color: #f59e0b;">Parsial: ${inProgressCount}</span>` : ''}
          ${closedCount > 0 ? `<span class="badge" style="background-color: #10b981;">Ditutup: ${closedCount}</span>` : ''}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Detailed Vulnerabilities</div>
      ${workbook.vulnerabilities.map((vuln) => generateVulnerabilityHTML(vuln)).join('')}
    </div>

    <div class="footer">
      <p>ProxVuln Report - Generated on ${formatDate(new Date(), "dd MMMM yyyy")}</p>
      <p>Workbook ID: ${workbook.id}</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate HTML untuk single vulnerability
 */
function generateVulnerabilityHTML(vuln: Vulnerability): string {
  const riskLevel = vuln.calculatedRiskLevel || "Low";
  const riskColor = getRiskColor(riskLevel);
  
  return `
    <div class="vulnerability-item">
      <div class="vulnerability-header">
        <div class="vulnerability-id">${vuln.id}: ${vuln.namaKerentanan || "-"}</div>
        <span class="risk-level" style="background-color: ${riskColor};">${formatRiskLevel(riskLevel)}</span>
      </div>
      <table>
        <tr>
          <th style="width: 200px;">MSTG/WSTG</th>
          <td>${vuln.mstgWstg || "-"}</td>
        </tr>
        <tr>
          <th>Objek Terdampak</th>
          <td>${vuln.objekTerdampak || "-"}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>${formatStatus(vuln.retest1 || vuln.statusMitigasi || "-")}</td>
        </tr>
        <tr>
          <th>Deskripsi</th>
          <td>${(vuln.deskripsi || "-").replace(/\n/g, "<br>")}</td>
        </tr>
        <tr>
          <th>Rekomendasi/Mitigasi</th>
          <td>${(vuln.rekomendasiMitigasi || "-").replace(/\n/g, "<br>")}</td>
        </tr>
      </table>
    </div>
  `;
}

