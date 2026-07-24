import { Page, Browser } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { Logger } from '../utils/logger.js';

export interface AgentArtifactPayload {
  testTitle: string;
  status: 'passed' | 'failed' | 'skipped';
  errorDetails?: string;
  suggestedLocatorFix?: string;
  accessibilitySnapshot?: string;
  cdpDebuggerUrl?: string;
}

export class PAFMcpAgent {
  private static artifactDir = path.resolve(process.cwd(), 'test-results/mcp-artifacts');

  /**
   * Captures the live accessibility tree of the active page for AI element inspection
   */
  public static async getAccessibilityTree(page: Page): Promise<string> {
    try {
      const snapshot = await (page as any).accessibility?.snapshot();
      return JSON.stringify(snapshot || { note: 'Accessibility snapshot API' }, null, 2);
    } catch (err) {
      Logger.warn('Could not capture accessibility snapshot:', err);
      return 'Accessibility snapshot unavailable';
    }
  }

  /**
   * Returns Chrome DevTools Protocol (CDP) WebSocket URL for AI agent live browser attach/debug
   */
  public static getCdpDebuggerUrl(browser: Browser): string | null {
    try {
      if ('contexts' in browser && typeof (browser as any).wsEndpoint === 'function') {
        return (browser as any).wsEndpoint();
      }
      return process.env.CDP_DEBUGGER_URL || null;
    } catch {
      return null;
    }
  }

  /**
   * Analyzes Playwright error logs and returns suggested replacement locators
   */
  public static suggestFixForLocator(errorMsg?: string): string | undefined {
    if (!errorMsg) return undefined;

    if (errorMsg.includes('waiting for locator')) {
      return `[Agentic AI Tip]: Target locator timed out. Consider using role-based locator e.g. page.getByRole('button') or page.getByTestId(...) instead of dynamic CSS selectors.`;
    }
    if (errorMsg.includes('strict mode violation')) {
      return `[Agentic AI Tip]: Selector resolved to multiple elements. Refine using .first(), .nth(), or specify parent container context.`;
    }
    return `[Agentic AI Tip]: Inspect accessibility tree snapshot in test-results/mcp-artifacts to find exact ARIA role or label.`;
  }

  /**
   * Emits a structured Agentic AI Markdown artifact to test-results/mcp-artifacts/
   */
  public static emitAgentArtifact(payload: AgentArtifactPayload): string {
    if (!fs.existsSync(this.artifactDir)) {
      fs.mkdirSync(this.artifactDir, { recursive: true });
    }

    const fileName = `agent-artifact-${payload.testTitle.replace(/[^a-z0-9]/gi, '_')}.md`;
    const filePath = path.join(this.artifactDir, fileName);

    const content = `
# 🤖 Antigravity Agentic AI Test Artifact
**Test Title:** \`${payload.testTitle}\`
**Status:** ${payload.status === 'passed' ? '✅ PASSED' : '❌ FAILED'}
**Timestamp:** ${new Date().toISOString()}

${payload.cdpDebuggerUrl ? `> 🔗 **Active CDP Debugger Session:** \`${payload.cdpDebuggerUrl}\`` : ''}

${
  payload.errorDetails
    ? `
### ❌ Failure Log
\`\`\`text
${payload.errorDetails}
\`\`\`
`
    : ''
}

${
  payload.suggestedLocatorFix
    ? `
### 💡 Agent Suggested Fix
> ${payload.suggestedLocatorFix}
`
    : ''
}

${
  payload.accessibilitySnapshot
    ? `
### ♿ Accessibility Tree Snapshot
\`\`\`json
${payload.accessibilitySnapshot.slice(0, 1500)} ...
\`\`\`
`
    : ''
}
`;

    fs.writeFileSync(filePath, content, 'utf-8');
    Logger.info(`Emitted Antigravity AI Agent Artifact: ${filePath}`);
    return filePath;
  }
}
