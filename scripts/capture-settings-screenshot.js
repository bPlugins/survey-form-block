const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function captureScreenshots() {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const phpIni = 'C:\\Users\\suzan\\AppData\\Roaming\\Local\\run\\-Kjg0EOq2\\conf\\php\\php.ini';
    const scriptPath = path.join(__dirname, 'get-auth-cookies.php');
    const stdout = execSync(`php -c "${phpIni}" "${scriptPath}"`, { encoding: 'utf8' });
    const jsonStart = stdout.indexOf('[');
    const cookies = JSON.parse(stdout.substring(jsonStart));

    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--window-size=1240,860',
        ],
        defaultViewport: {
            width: 1240,
            height: 860,
            deviceScaleFactor: 2,
        }
    });

    try {
        const page = await browser.newPage();
        for (const cookie of cookies) {
            await page.setCookie(cookie);
        }

        console.log('Navigating to editor...');
        await page.goto('http://pod.local/wp-admin/post.php?post=14895&action=edit', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        await new Promise(r => setTimeout(r, 4000));

        // Dismiss welcome modals
        await page.evaluate(() => {
            const closeBtn = document.querySelector('button[aria-label="Close dialog"], button[aria-label="Close"]');
            if (closeBtn) closeBtn.click();
        });

        // Open Inspector Controls sidebar and select block
        await page.evaluate(() => {
            if (window.wp && wp.data) {
                try {
                    wp.data.dispatch('core/edit-post')?.openGeneralSidebar('edit-post/block');
                } catch (e) { }
                try {
                    wp.data.dispatch('core/interface')?.enableComplementaryArea('core/edit-post', 'edit-post/block');
                } catch (e) { }

                const blocks = wp.data.select('core/block-editor')?.getBlocks();
                if (blocks && blocks.length > 0) {
                    wp.data.dispatch('core/block-editor')?.selectBlock(blocks[0].clientId);
                }
            }
        });

        await new Promise(r => setTimeout(r, 2000));

        // Activate Design tab
        await page.evaluate(() => {
            const tabs = Array.from(document.querySelectorAll('.svTabPanel button, .bPlTabPanel button'));
            const designTab = tabs.find(t => t.textContent.trim().toLowerCase() === 'design');
            if (designTab) designTab.click();
        });

        await new Promise(r => setTimeout(r, 1500));

        // Ensure the inspector sidebar has a comfortable, readable width and nice styling
        await page.evaluate(() => {
            // Remove WP admin bar for cleaner screenshot presentation
            const adminBar = document.getElementById('wpadminbar');
            if (adminBar) adminBar.style.display = 'none';

            const html = document.documentElement;
            html.style.setProperty('padding-top', '0px', 'important');
            html.style.setProperty('margin-top', '0px', 'important');
            document.body.style.setProperty('padding-top', '0px', 'important');
            document.body.style.setProperty('margin-top', '0px', 'important');

            // Set sidebar width to 320px for crystal-clear readability
            const sidebar = document.querySelector('.interface-interface-skeleton__sidebar');
            if (sidebar) {
                sidebar.style.width = '330px';
                sidebar.style.minWidth = '330px';
            }
        });

        await new Promise(r => setTimeout(r, 1000));

        // Capture raw editor view
        const rawEditorPath = path.join(__dirname, 'raw-editor-design.png');
        await page.screenshot({ path: rawEditorPath });
        console.log('Saved raw editor screenshot to:', rawEditorPath);

        // Capture inspector sidebar only
        const sidebarHandle = await page.$('.interface-interface-skeleton__sidebar') || await page.$('.edit-post-sidebar');
        if (sidebarHandle) {
            const rawSidebarPath = path.join(__dirname, 'raw-sidebar-design.png');
            await sidebarHandle.screenshot({ path: rawSidebarPath });
            console.log('Saved raw sidebar screenshot to:', rawSidebarPath);
        }

        // Now activate General tab to capture fields panel as well
        await page.evaluate(() => {
            const tabs = Array.from(document.querySelectorAll('.svTabPanel button, .bPlTabPanel button'));
            const genTab = tabs.find(t => t.textContent.trim().toLowerCase() === 'general');
            if (genTab) genTab.click();
        });

        await new Promise(r => setTimeout(r, 1500));

        const rawEditorGenPath = path.join(__dirname, 'raw-editor-general.png');
        await page.screenshot({ path: rawEditorGenPath });
        console.log('Saved raw editor general screenshot to:', rawEditorGenPath);

    } finally {
        await browser.close();
    }
}

captureScreenshots().catch(console.error);

