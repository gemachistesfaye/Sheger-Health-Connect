const puppeteer = require('./frontend/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://sheger-health-connect.vercel.app';
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
    headless: false, // visible so we can debug
    defaultViewport: { width: 1440, height: 820 },
    args: ['--no-sandbox', '--start-maximized']
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(120000);
  page.setDefaultTimeout(60000);

  try {
    // ─── STEP 1: Admin login & keep retrying until Render is up ────
    let loggedIn = false;
    let tries = 0;
    while (!loggedIn && tries < 5) {
      tries++;
      console.log(`🔑 Admin login attempt ${tries}...`);
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 60000 });
      await wait(1500);
      
      const inputs = await page.$$('input');
      if (inputs.length >= 2) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('admin');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('Admin@2026');
        await page.click('button[type="submit"]');
        await wait(8000); // wait for slow Render response
        
        const url = page.url();
        console.log(`  → URL: ${url}`);
        if (!url.includes('/login')) {
          loggedIn = true;
          console.log('✅ Admin logged in!');
        } else {
          console.log(`  ⏳ Still on login, waiting 15s before retry...`);
          await wait(15000);
        }
      }
    }

    if (!loggedIn) {
      console.log('❌ Could not log in as admin after 5 attempts. Render backend may be down.');
      await browser.close();
      return;
    }

    // ─── Screenshot Admin Dashboard ──────────────────────────────
    console.log('📸 Admin Dashboard (fresh)...');
    await shot(page, 'img7_admin_dashboard.png');

    // ─── Navigate to Patients tab ─────────────────────────────────
    console.log('🔍 Looking for Patients sidebar link...');
    const patientNavClicked = await page.evaluate(() => {
      const links = [...document.querySelectorAll('a, button, li, nav *')];
      const found = links.find(el => /patient/i.test(el.textContent));
      if (found) { found.click(); return true; }
      return false;
    });
    console.log('Patient nav clicked:', patientNavClicked);
    await wait(3000);
    await shot(page, 'img8_admin_patients.png');

    // ─── Add Patient via UI ───────────────────────────────────────
    console.log('➕ Looking for Add/New button...');
    const addClicked = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button, a')];
      const found = btns.find(el => /add|new|\+|onboard/i.test(el.textContent));
      if (found) { found.click(); return found.textContent.trim(); }
      return null;
    });
    console.log('Add button clicked:', addClicked);
    await wait(2000);

    // Fill the form
    const allInputs = await page.$$('input');
    for (const inp of allInputs) {
      const ph = await inp.evaluate(el => (el.placeholder || el.name || el.id || '').toLowerCase());
      if (/full.?name|name/i.test(ph)) { await inp.click({ clickCount: 3 }); await inp.type('Selam Girma'); }
      else if (/user/i.test(ph)) { await inp.click({ clickCount: 3 }); await inp.type('patient_selam'); }
      else if (/email/i.test(ph)) { await inp.click({ clickCount: 3 }); await inp.type('selam.girma@sheger.care'); }
      else if (/phone/i.test(ph)) { await inp.click({ clickCount: 3 }); await inp.type('0944444444'); }
      else if (/pass/i.test(ph)) { await inp.click({ clickCount: 3 }); await inp.type('Password@123'); }
    }
    // Set role dropdown to Patient
    const selects = await page.$$('select');
    for (const s of selects) {
      const opts = await s.evaluate(el => [...el.options].map(o => o.value));
      if (opts.some(o => /patient/i.test(o))) await s.select(opts.find(o => /patient/i.test(o)));
    }
    // Submit
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button[type="submit"], button')];
      const sub = btns.find(b => /submit|save|add|create/i.test(b.textContent));
      if (sub) sub.click();
    });
    await wait(5000);
    console.log('Patient creation submitted');

    // ─── Logout admin ─────────────────────────────────────────────
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button, a')];
      const lo = btns.find(b => /logout|sign out|log out/i.test(b.textContent));
      if (lo) lo.click();
    });
    await wait(2000);
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      const confirm = btns.find(b => /confirm|yes|log out/i.test(b.textContent));
      if (confirm) confirm.click();
    });
    await wait(3000);

    // ─── Login as patient ─────────────────────────────────────────
    console.log('🔑 Logging in as patient_selam...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 60000 });
    await wait(2000);
    const pInputs = await page.$$('input');
    await pInputs[0].click({ clickCount: 3 }); await pInputs[0].type('patient_selam');
    await pInputs[1].click({ clickCount: 3 }); await pInputs[1].type('Password@123');
    await page.click('button[type="submit"]');
    await wait(8000);

    const patientUrl = page.url();
    console.log('Patient URL:', patientUrl);
    await shot(page, 'img9_patient_dashboard.png');

    // Appointments tab
    await page.evaluate(() => {
      const links = [...document.querySelectorAll('a, button')];
      const found = links.find(el => /appointment/i.test(el.textContent));
      if (found) found.click();
    });
    await shot(page, 'img9b_patient_appointments.png');

    console.log('\n🎉 All done!');

  } catch (err) {
    console.error('❌ Error:', err.message);
    await page.screenshot({ path: path.join(OUT_DIR, 'img9_patient_dashboard.png') }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
