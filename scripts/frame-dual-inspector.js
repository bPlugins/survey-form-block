const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function frameDualInspector() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const rawDesign = fs.readFileSync(path.join(__dirname, 'raw-sidebar-design.png')).toString('base64');
  const rawGeneral = fs.readFileSync(path.join(__dirname, 'raw-sidebar-general.png')).toString('base64');

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
    color: #64748b;
    font-weight: 600;
    letter-spacing: 0.2px;
    padding-right: 36px;
  }
  .window-body {
    flex: 1;
    display: flex;
    background: #f8fafc;
    overflow: hidden;
    gap: 1px;
  }
  .panel-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    overflow: hidden;
    border-right: 1px solid #e2e8f0;
  }
  .panel-column:last-child {
    border-right: none;
  }
  .panel-caption {
    padding: 8px 12px;
    background: #f1f5f9;
    font-size: 11px;
    font-weight: 700;
    color: #334155;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .panel-img-wrap {
    flex: 1;
    overflow: hidden;
  }
  .panel-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
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
      <div class="window-title">Block Inspector Controls — General &amp; Design Settings Panels</div>
    </div>
    <div class="window-body">
      <div class="panel-column">
        <div class="panel-caption">🎨 Design Settings &amp; Theme Presets</div>
        <div class="panel-img-wrap">
          <img src="data:image/png;base64,${rawDesign}" />
        </div>
      </div>
      <div class="panel-column">
        <div class="panel-caption">⚙️ General &amp; Field Configuration</div>
        <div class="panel-img-wrap">
          <img src="data:image/png;base64,${rawGeneral}" />
        </div>
      </div>
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
      deviceScaleFactor: 2,
    }
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    const targetDir = path.resolve(__dirname, '../assets');
    const framedDir = path.join(targetDir, 'framed');

    const dualPath = path.join(targetDir, 'screenshot-inspector-controls.png');
    await page.screenshot({ path: dualPath });
    console.log('Saved dual inspector screenshot to:', dualPath);

  } finally {
    await browser.close();
  }
}

frameDualInspector().catch(console.error);
