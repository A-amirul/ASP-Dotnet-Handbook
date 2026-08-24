import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("linkedin");
const htmlPath = path.join(root, "cicd-carousel.html");
const pdfPath = path.join(root, "CI-CD-LinkedIn-Carousel.pdf");
const edge =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

if (!fs.existsSync(htmlPath)) {
  console.error("Missing HTML:", htmlPath);
  process.exit(1);
}

if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);

const fileUrl = pathToFileURL(htmlPath).href;
const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-pdf-header-footer",
  "--virtual-time-budget=8000",
  `--print-to-pdf=${pdfPath}`,
  fileUrl,
];

console.log("Rendering PDF via Edge...");
const child = spawn(edge, args, { stdio: "inherit", windowsHide: true });

child.on("exit", (code) => {
  if (!fs.existsSync(pdfPath)) {
    console.error("PDF was not created. Exit code:", code);
    process.exit(1);
  }
  const stats = fs.statSync(pdfPath);
  console.log(`Wrote ${pdfPath} (${Math.round(stats.size / 1024)} KB)`);
});
