const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function frameScreenshot() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  // Read raw editor image as base64
  const rawEditorImg = fs.readFileSync(path.join(__dirname, 'raw-editor-design.png')).toString('base64');
  const rawSidebarImg = fs.readFileSync(path.join(__dirname, 'raw-sidebar-design.png')).toString('base64');

  // HTML template for framed screenshot at 772x537 (official WP guidelines matching screenshot-7.png)
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 772px;
    height: 537px;
    overflow: hidden;
    background: linear-gradient(135deg, #a9e9e6 0%, #f0ede8 50%, #dcd5cc 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .window {
    width: 740px;
    height: 505px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.8);
  }
  .window-header {
    height: 34px;
    background: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 14px;
    gap: 7px;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0;
  }
  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
  }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .window-title {
    margin-left: auto;
    margin-right: auto;
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
    letter-spacing: 0.2px;
    padding-right: 36px;
  }
  .window-body {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  .window-body img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top right;
    display: block;
  }
</style>
</head>
<body>
  <div class="window">
    <div class="window-header">
      <div class="dot dot-red"></div>
      <div class="dot dot-yellow"></div>
      <div class="dot dot-green"></div>
      <div class="window-title">WordPress Block Editor — Survey Form Inspector Controls</div>
    </div>
    <div class="window-body">
      <img src="data:image/png;base64,${rawEditorImg}" />
    </div>
  </div>
</body>
</html>
    `;

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=772,537',
    ],
    defaultViewport: {
      width: 772,
      height: 537,
      deviceScaleFactor: 2, // ultra sharp rendering
    }
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    const targetDir = path.resolve('C:/Users/suzan/Local Sites/pod/app/public/wp-content/plugins/survey-form-block/assets');
    const framedDir = path.join(targetDir, 'framed');

    const screenshot8Path = path.join(targetDir, 'screenshot-8.png');
    const framed8Path = path.join(framedDir, 'framed-screenshot-8.png');
    const settingsPath = path.join(targetDir, 'screenshot-settings.png');

    await page.screenshot({ path: screenshot8Path });
    console.log('Saved screenshot-8 to:', screenshot8Path);

    fs.copyFileSync(screenshot8Path, framed8Path);
    console.log('Saved framed screenshot-8 to:', framed8Path);

    fs.copyFileSync(screenshot8Path, settingsPath);
    console.log('Saved screenshot-settings to:', settingsPath);

  } finally {
    await browser.close();
  }
}

frameScreenshot().catch(console.error);

