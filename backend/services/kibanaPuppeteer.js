const puppeteer = require("puppeteer");

let browser;
let page;
let cookieCache = "";

async function initBrowser() {

  if (browser) return;

  browser = await puppeteer.launch({
    headless: true,
    executablePath:
      process.env.CHROME_BIN
      || undefined,

    args: [

      "--no-sandbox",

      "--disable-setuid-sandbox",

      "--disable-dev-shm-usage",

      "--disable-gpu",

      "--single-process"

    ]

  });

  page = await browser.newPage();
}

async function getKibanaCookie() {

  if (cookieCache) {
    return cookieCache;
  }

  await initBrowser();

  console.log("🔐 Membuka Kibana...");

  await page.goto(
    "https://board.mile.app/login",
    {
      waitUntil: "networkidle2",
      timeout: 120000
    }
  );

  // tunggu render login
  await new Promise(resolve =>
    setTimeout(resolve, 10000)
  );

  // isi login
  await page.evaluate((username, password) => {

    const userInput =
      document.getElementById(
        "opendistro_security.username"
      );

    const passInput =
      document.getElementById(
        "opendistro_security.password"
      );

    userInput.value = username;
    passInput.value = password;

    userInput.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    passInput.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

  },
    "upt",
    "posind3m4s"
  );

  console.log("✅ Login diisi");

  // klik login
  await page.evaluate(() => {

    document.getElementById(
      "opendistro_security.login"
    ).click();

  });

  console.log("🔄 Proses login...");

  // tunggu redirect
  await new Promise(resolve =>
    setTimeout(resolve, 15000)
  );

  console.log(
    "✅ URL:",
    await page.url()
  );

  // ambil cookie
  const cookies =
    await page.cookies();

  cookieCache = cookies
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  console.log(
    "✅ Cookie Kibana berhasil"
  );

  return cookieCache;
}

module.exports = {
  getKibanaCookie
};