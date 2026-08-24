import puppeteer from "puppeteer-core";
import path from "node:path";
import { pathToFileURL } from "node:url";
import fs from "node:fs";

const edge =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const htmlPath = path.resolve("linkedin/cicd-carousel.html");
const outDir = path.resolve("linkedin/previews");
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: edge,
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0" });

const slides = await page.$$(".slide");
for (let i = 0; i < slides.length; i++) {
  const file = path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
  await slides[i].screenshot({ path: file, type: "png" });
  console.log("wrote", file);
}

await browser.close();
