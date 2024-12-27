import puppeteer, { Browser, Page } from 'puppeteer-core';
import * as fs from 'fs';
import * as path from 'path';

export class PuppeteerService {
  private static outputDir: string = path.join(__dirname, '..', 'output');

  private static executablePath: string =
    process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : '/usr/bin/google-chrome';

  private static async launchBrowser(): Promise<Browser> {
    return puppeteer.launch({
      executablePath: PuppeteerService.executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  private static ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Logs into the site with the specified credentials
   */
  static async loginAndNavigate(
    loginUrl: string,
    username: string,
    password: string,
    protectedUrl: string,
    screenshotName: string,
  ): Promise<void> {
    const browser = await PuppeteerService.launchBrowser();
    const page = await browser.newPage();

    try {
      PuppeteerService.ensureOutputDir();
      const screenshotPath = path.join(this.outputDir, screenshotName);

      await page.goto(loginUrl, { waitUntil: 'networkidle0' });
      console.log('Main page loaded.');

      await page.waitForSelector('#login-button', { timeout: 20000 });
      await page.click('#login-button');
      console.log('Login button clicked.');

      await page.waitForSelector('input[name="email"]', { timeout: 20000 });
      await page.waitForSelector('input[name="password"]', { timeout: 20000 });

      await page.type('input[name="email"]', username);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');

      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      console.log('Login successful, navigating to protected URL.');

      await page.goto(protectedUrl, { waitUntil: 'networkidle0' });
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot saved successfully: ${screenshotPath}`);
    } catch (error) {
      console.error('Error during login and navigation:', error);

      const debugScreenshotPath = path.join(this.outputDir, 'error-debug.png');
      await page.screenshot({ path: debugScreenshotPath, fullPage: true });
      console.log(`Error screenshot saved: ${debugScreenshotPath}`);
    } finally {
      await browser.close();
    }
  }

  /**
   * Creates PDF from HTML content
   */
  static async generatePDF(
    htmlContent: string,
    outputName: string,
  ): Promise<void> {
    const browser = await PuppeteerService.launchBrowser();
    const page = await browser.newPage();

    try {
      PuppeteerService.ensureOutputDir();
      const outputPath = path.join(this.outputDir, outputName);

      await page.setContent(htmlContent);
      await page.pdf({ path: outputPath, format: 'A4' });
      console.log(`PDF created successfully: ${outputPath}`);
    } catch (error) {
      console.error('Error during PDF generation:', error);
    } finally {
      await browser.close();
    }
  }

  /**
   * Takes a screenshot of the page
   */
  static async takeScreenshot(url: string, outputName: string): Promise<void> {
    const browser = await PuppeteerService.launchBrowser();
    const page = await browser.newPage();

    try {
      PuppeteerService.ensureOutputDir();
      const outputPath = path.join(this.outputDir, outputName);

      await page.goto(url, { waitUntil: 'networkidle0' });
      await page.screenshot({ path: outputPath, fullPage: true });
      console.log(`Screenshot saved successfully: ${outputPath}`);
    } catch (error) {
      console.error('Error during screenshot:', error);
    } finally {
      await browser.close();
    }
  }
}
