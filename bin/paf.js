#!/usr/bin/env node

/**
 * CLI Runner for PAF (Playwright Automation Framework)
 */
const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2).join(' ');
console.log('\x1b[36m%s\x1b[0m', '🚀 Launching PAF (Playwright Automation Framework)...');

try {
  const playwrightCmd = `npx playwright test ${args}`;
  execSync(playwrightCmd, { stdio: 'inherit', cwd: process.cwd() });
} catch (error) {
  process.exit(error.status || 1);
}
