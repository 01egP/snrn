import { Controller, Get, Query } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller('reports')
export class ReportsController {
  @Get('screenshot')
  async generateScreenshot(@Query('url') url: string): Promise<string> {
    const screenshotPath = 'screenshot.png';
    await PuppeteerService.takeScreenshot(
      url || 'http://localhost:3001',
      screenshotPath,
    );
    return `Screenshot saved at ${screenshotPath}`;
  }

  @Get('generate-pdf')
  async generatePDF(): Promise<string> {
    const htmlContent =
      '<h1>Sample PDF</h1><p>This is a sample PDF generated with Puppeteer.</p>';
    const outputPath = 'sample.pdf';
    await PuppeteerService.generatePDF(htmlContent, outputPath);
    return `PDF generated at ${outputPath}`;
  }

  @Get('login-screenshot')
  async loginAndCapture(): Promise<string> {
    const loginUrl = process.env.LOGIN_URL || 'http://localhost:3001';
    const email = process.env.EMAIL || 'default@example.com';
    const password = process.env.PASSWORD || 'defaultpassword';
    const protectedUrl =
      process.env.PROTECTED_URL || 'http://localhost:3001/reports';
    const screenshotPath =
      process.env.SCREENSHOT_PATH || 'reports-screenshot.png';

    await PuppeteerService.loginAndNavigate(
      loginUrl,
      email,
      password,
      protectedUrl,
      screenshotPath,
    );
    return `Login and screenshot completed. Screenshot saved at ${screenshotPath}`;
  }
}
