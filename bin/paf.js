#!/usr/bin/env node

/**
 * CLI Runner for PAF (Playwright Automation Framework)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rawArgs = process.argv.slice(2);
const playwrightArgs = [];

let sendEmail = false;
let backupReports = false;

console.log('\x1b[36m%s\x1b[0m', '🚀 Launching PAF (Playwright Automation Framework)...');

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];

  // 1. Tag inclusion: @smoke or --tag @smoke or --tag=smoke
  if (arg.startsWith('@')) {
    playwrightArgs.push('--grep', `"${arg}"`);
  } else if (arg === '--tag' && rawArgs[i + 1]) {
    const tag = rawArgs[++i];
    const formattedTag = tag.startsWith('@') ? tag : `@${tag}`;
    playwrightArgs.push('--grep', `"${formattedTag}"`);
  } else if (arg.startsWith('--tag=')) {
    const tag = arg.split('=')[1];
    const formattedTag = tag.startsWith('@') ? tag : `@${tag}`;
    playwrightArgs.push('--grep', `"${formattedTag}"`);
  }
  
  // 2. Tag exclusion: --skip @smoke or --skip=@smoke or --skipTag @smoke
  else if ((arg === '--skip' || arg === '--skipTag') && rawArgs[i + 1]) {
    const tag = rawArgs[++i];
    const formattedTag = tag.startsWith('@') ? tag : `@${tag}`;
    playwrightArgs.push('--grep-invert', `"${formattedTag}"`);
  } else if (arg.startsWith('--skip=') || arg.startsWith('--skipTag=')) {
    const tag = arg.split('=')[1];
    const formattedTag = tag.startsWith('@') ? tag : `@${tag}`;
    playwrightArgs.push('--grep-invert', `"${formattedTag}"`);
  }

  // 3. Browser selection: --browser chrome | firefox | webkit
  else if (arg === '--browser' && rawArgs[i + 1]) {
    const browser = rawArgs[++i].toLowerCase();
    if (browser === 'chrome' || browser === 'chromium') {
      playwrightArgs.push('--project=Chromium');
    } else if (browser === 'firefox') {
      playwrightArgs.push('--project=Firefox');
    } else if (browser === 'webkit' || browser === 'safari') {
      playwrightArgs.push('--project=WebKit');
    } else {
      playwrightArgs.push(`--project=${browser}`);
    }
  } else if (arg.startsWith('--browser=')) {
    const browser = arg.split('=')[1].toLowerCase();
    if (browser === 'chrome' || browser === 'chromium') {
      playwrightArgs.push('--project=Chromium');
    } else if (browser === 'firefox') {
      playwrightArgs.push('--project=Firefox');
    } else if (browser === 'webkit' || browser === 'safari') {
      playwrightArgs.push('--project=WebKit');
    } else {
      playwrightArgs.push(`--project=${browser}`);
    }
  }

  // 4. Headed / Headless mode
  else if (arg === '--headed') {
    process.env.HEADLESS = 'false';
    playwrightArgs.push('--headed');
  } else if (arg === '--headless') {
    process.env.HEADLESS = 'true';
  }

  // 5. Reports backup flag
  else if (arg === '--reportsBackup' || arg === '--backup') {
    backupReports = true;
  }

  // 6. Email flag
  else if (arg === '--email') {
    sendEmail = true;
    process.env.SEND_MAIL_ON_FINISH = 'true';
  }

  // Pass-through all other Playwright CLI flags
  else {
    playwrightArgs.push(arg);
  }
}

// Handle Reports Backup if requested
if (backupReports) {
  const cwd = process.cwd();
  const reportDir = path.join(cwd, 'playwright-report');
  const resultsDir = path.join(cwd, 'test-results');

  if (fs.existsSync(reportDir) || fs.existsSync(resultsDir)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupTarget = path.join(cwd, 'test-results-backups', `report-backup-${timestamp}`);
    fs.mkdirSync(backupTarget, { recursive: true });

    if (fs.existsSync(reportDir)) {
      fs.cpSync(reportDir, path.join(backupTarget, 'playwright-report'), { recursive: true });
    }
    if (fs.existsSync(resultsDir)) {
      fs.cpSync(resultsDir, path.join(backupTarget, 'test-results'), { recursive: true });
    }
    console.log(`\x1b[32m%s\x1b[0m`, `📦 Backed up previous execution reports to: ${backupTarget}`);
  }
}

// Set email status if not explicitly passed
if (!sendEmail && process.env.SEND_MAIL_ON_FINISH === undefined) {
  process.env.SEND_MAIL_ON_FINISH = 'false';
}

try {
  const playwrightCmd = `npx playwright test ${playwrightArgs.join(' ')}`;
  console.log(`\x1b[90mExecuting: ${playwrightCmd}\x1b[0m`);
  execSync(playwrightCmd, { stdio: 'inherit', cwd: process.cwd(), env: process.env });
} catch (error) {
  process.exit(error.status || 1);
}
