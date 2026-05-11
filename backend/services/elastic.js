const puppeteer = require("puppeteer");

let browser;
let page;
let cookieCache = "";

async function initBrowser() {

  if (browser) return;

  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--start-maximized",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process"
    ]
  });

  page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
  );
}

async function getKibanaCookie() {

  if (cookieCache) {
    return cookieCache;
  }

  await initBrowser();

  console.log("🔐 Open Kibana");

  await page.goto(
    "https://board.mile.app/login",
    {
      waitUntil: "networkidle2",
      timeout: 120000
    }
  );

  await new Promise(resolve =>
    setTimeout(resolve, 10000)
  );

  // isi username
  await page.type(
    'input[type="text"]',
    "upt"
  );

  // isi password
  await page.type(
    'input[type="password"]',
    "posind3m4s"
  );

  console.log("✅ Login filled");

  // klik login
  await page.click(
    'button[type="submit"], #opendistro_security.login'
  );

  console.log("🔄 Logging in");

  await new Promise(resolve =>
    setTimeout(resolve, 15000)
  );

  console.log(
    "✅ URL:",
    await page.url()
  );

  const cookies =
    await page.cookies();

  cookieCache = cookies
    .map(c =>
      `${c.name}=${c.value}`
    )
    .join("; ");

  console.log("🍪 Cookie saved");

  return cookieCache;
}

module.exports = {
  getKibanaCookie
};