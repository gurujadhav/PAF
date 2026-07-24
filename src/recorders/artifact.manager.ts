import fs from 'fs';
import path from 'path';
import { Logger } from '../utils/logger.js';

export interface ArtifactDetails {
  testTitle: string;
  videoPath?: string;
  tracePath?: string;
  screenshots: string[];
}

export class ArtifactManager {
  private static resultsDir = path.resolve(process.cwd(), 'test-results');

  /**
   * Scans and aggregates test artifacts (videos, trace files, screenshots) for a given test.
   */
  public static getArtifactsForTest(testTitleSanitized: string): ArtifactDetails {
    const details: ArtifactDetails = {
      testTitle: testTitleSanitized,
      screenshots: [],
    };

    if (!fs.existsSync(this.resultsDir)) {
      return details;
    }

    try {
      const dirs = fs.readdirSync(this.resultsDir);
      for (const dirName of dirs) {
        if (dirName.toLowerCase().includes(testTitleSanitized.toLowerCase().replace(/[^a-z0-9]/gi, '-'))) {
          const fullDirPath = path.join(this.resultsDir, dirName);
          if (fs.lstatSync(fullDirPath).isDirectory()) {
            const files = fs.readdirSync(fullDirPath);

            for (const file of files) {
              const fullFilePath = path.join(fullDirPath, file);
              if (file.endsWith('.webm') || file.endsWith('.mp4')) {
                details.videoPath = fullFilePath;
              } else if (file.endsWith('.zip') || file.includes('trace')) {
                details.tracePath = fullFilePath;
              } else if (file.endsWith('.png') || file.endsWith('.jpg')) {
                details.screenshots.push(fullFilePath);
              }
            }
          }
        }
      }
    } catch (error) {
      Logger.error(`Error scanning artifacts for test "${testTitleSanitized}":`, error);
    }

    return details;
  }

  /**
   * Helper to ensure output directory exists
   */
  public static ensureDirExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}
