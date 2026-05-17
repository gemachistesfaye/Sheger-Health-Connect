const puppeteer = require('./frontend/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const OUT_DIR = path.join(__dirname, 'docs', 'images');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const wait = (ms) => new Promise(r => setTimeout(r, ms));

const shot = async (page, filename) => {
  await wait(3000);
  await page.screenshot({ path: path.join(OUT_DIR, filename), fullPage: false });
  console.log(`✅ Saved: ${filename}`);
};

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // headless for fast background capture
    defaultViewport: { width: 1440, height: 820 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  try {
    console.log('🔑 Logging in as patient_selam on local dev server...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await wait(2000);
    
    const pInputs = await page.$$('input');
    await pInputs[0].click({ clickCount: 3 }); await pInputs[0].type('patient_selam');
    await pInputs[1].click({ clickCount: 3 }); await pInputs[1].type('Password@123');
    await page.click('button[type="submit"]');
    await wait(5000);

    const patientUrl = page.url();
    console.log('Patient URL:', patientUrl);
    await shot(page, 'img9_patient_dashboard.png');

    console.log('\n🎉 Patient screenshot captured successfully!');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await browser.close();
  }
})();
