export interface TestCaseReportResult {
  title: string;
  status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
  durationMs: number;
  error?: string;
  videoPath?: string;
  tracePath?: string;
}

export interface SummaryReportStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
  environment: string;
  startTime: string;
  testCases: TestCaseReportResult[];
}

export const generateEmailHtmlReport = (stats: SummaryReportStats): string => {
  const passRate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '0';
  const durationSec = (stats.durationMs / 1000).toFixed(2);

  const testRowsHtml = stats.testCases
    .map((tc) => {
      let statusColor = '#10b981'; // green
      let statusBg = 'rgba(16, 185, 129, 0.15)';
      if (tc.status === 'failed' || tc.status === 'timedOut') {
        statusColor = '#ef4444'; // red
        statusBg = 'rgba(239, 68, 68, 0.15)';
      } else if (tc.status === 'skipped') {
        statusColor = '#f59e0b'; // amber
        statusBg = 'rgba(245, 158, 11, 0.15)';
      }

      const durationStr = (tc.durationMs / 1000).toFixed(2) + 's';

      return `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 12px; font-weight: 500; color: #f8fafc;">${tc.title}</td>
          <td style="padding: 12px;">
            <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: ${statusColor}; background-color: ${statusBg}; text-transform: uppercase;">
              ${tc.status}
            </span>
          </td>
          <td style="padding: 12px; color: #94a3b8; font-size: 13px;">${durationStr}</td>
          <td style="padding: 12px; color: #94a3b8; font-size: 12px; font-family: monospace;">
            ${tc.error ? `<div style="color: #f87171; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tc.error}</div>` : 'None'}
          </td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PAF Test Execution Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="650" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 28px 32px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                🚀 PAF Test Execution Summary
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 14px; color: #e0e7ff; opacity: 0.9;">
                Automated Playwright Execution Report • Environment: <strong>${stats.environment}</strong>
              </p>
            </td>
          </tr>

          <!-- Summary Cards Grid -->
          <tr>
            <td style="padding: 24px 32px 12px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="23%" style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                    <div style="font-size: 24px; font-weight: 700; color: #38bdf8;">${stats.total}</div>
                    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-top: 4px; font-weight: 600;">Total Tests</div>
                  </td>
                  <td width="2%"></td>
                  <td width="23%" style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                    <div style="font-size: 24px; font-weight: 700; color: #4ade80;">${stats.passed}</div>
                    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-top: 4px; font-weight: 600;">Passed</div>
                  </td>
                  <td width="2%"></td>
                  <td width="23%" style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                    <div style="font-size: 24px; font-weight: 700; color: #f87171;">${stats.failed}</div>
                    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-top: 4px; font-weight: 600;">Failed</div>
                  </td>
                  <td width="2%"></td>
                  <td width="23%" style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                    <div style="font-size: 24px; font-weight: 700; color: #c084fc;">${passRate}%</div>
                    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-top: 4px; font-weight: 600;">Pass Rate</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Metadata Bar -->
          <tr>
            <td style="padding: 0 32px 20px 32px;">
              <div style="background-color: #0f172a; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #94a3b8; border: 1px solid #334155;">
                ⏱️ <strong>Duration:</strong> ${durationSec}s &nbsp;|&nbsp; 📅 <strong>Time:</strong> ${stats.startTime} &nbsp;|&nbsp; 🎬 <strong>Artifacts:</strong> Videos & Traces attached in GitHub Actions
              </div>
            </td>
          </tr>

          <!-- Test Details Table -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              <h2 style="font-size: 16px; font-weight: 600; color: #f8fafc; margin: 0 0 12px 0;">Test Results Breakdown</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #0f172a; border-radius: 8px; overflow: hidden; border: 1px solid #334155;">
                <thead>
                  <tr style="background-color: #1e293b; text-align: left; border-bottom: 2px solid #334155;">
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #cbd5e1; text-transform: uppercase;">Test Name</th>
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #cbd5e1; text-transform: uppercase;">Status</th>
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #cbd5e1; text-transform: uppercase;">Time</th>
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #cbd5e1; text-transform: uppercase;">Error Details</th>
                  </tr>
                </thead>
                <tbody>
                  ${testRowsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 16px 32px; border-top: 1px solid #334155; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                Generated automatically by <strong>PAF Automation Framework</strong> • Playwright Test Suite
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
