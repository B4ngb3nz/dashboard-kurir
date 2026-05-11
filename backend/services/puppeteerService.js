const puppeteer = require("puppeteer");

let browser;
let page;
let cookieCache = "";

async function initBrowser() {

  if (browser) return;

  browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: [
      "--start-maximized",
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  page = await browser.newPage();
}

async function getKibanaCookie() {

  await initBrowser();

  console.log("🔐 Membuka Kibana...");

  await page.goto(
    "https://board.mile.app/login",
    {
      waitUntil: "networkidle2",
      timeout: 120000
    }
  );

  // tunggu render angular
  await new Promise(resolve =>
    setTimeout(resolve, 10000)
  );

  // DEBUG
  await page.screenshot({
    path: "login-debug.png",
    fullPage: true
  });

  // ketik manual via evaluate
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

    // trigger angular event
    userInput.dispatchEvent(
      new Event("input", { bubbles: true })
    );

    passInput.dispatchEvent(
      new Event("input", { bubbles: true })
    );

  },
    "upt",
    "posind3m4s"
  );

  console.log("✅ Username & password diisi");

  // klik login
  await page.evaluate(() => {
    document.getElementById(
      "opendistro_security.login"
    ).click();
  });

  console.log("🔄 Login...");

  // tunggu redirect
  await new Promise(resolve =>
    setTimeout(resolve, 15000)
  );

  console.log(
    "✅ URL setelah login:",
    await page.url()
  );

  // ambil cookies
  const cookies = await page.cookies();

  cookieCache = cookies
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  console.log("✅ Cookie berhasil diambil");

  return cookieCache;
}

module.exports = {
  getKibanaCookie
};

async function getValidCookie() {

  if (!cookieCache) {
    return await getKibanaCookie();
  }

  return cookieCache;
}

module.exports = {
  getValidCookie
};