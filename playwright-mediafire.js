const { chromium } = require('playwright');

async function mediafire(url) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0; iris50) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36'
    });
    const page = await context.newPage();
    try {
        await page.goto(url);
        const downloadInfo = await page.evaluate(() => {
            const fileNameElement = document.querySelector('.dl-btn-label');
            const fileName = fileNameElement ? fileNameElement.textContent.trim() : '';
            const downloadLinkElement = document.querySelector('#downloadButton');
            const downloadLink = downloadLinkElement ? downloadLinkElement.href : '';
            const fileSizeText = downloadLinkElement ? downloadLinkElement.textContent : '';
            const sizeMatch = fileSizeText.match(/\(([^)]+)\)/);
            const fileSize = sizeMatch ? sizeMatch[1] : '';

            return {
                fileName: fileName,
                downloadLink: downloadLink,
                fileSize: fileSize
            };
        });

        return downloadInfo;
    } catch (error) {
        return { success: false, message: error.message };
        console.error("Error:", error.response ? error.response.data : error.message);
    } finally {
        await browser.close();
    }
}

module.exports = { mediafire };