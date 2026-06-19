// Lists which courses still need full content from BTI. Reads the catalogue
// source files (no build needed) and reports, per course, what's missing
// (learning outcomes, course outline, training hours, fees, certification).
//
// Usage: pnpm courses:audit
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src", "content", "catalogue");

// Crude but dependency-free: count entries and flag those without
// contentStatus: "complete". The detailed per-field gaps live in
// docs/course-content-needed.md (the template BTI fills in).
const files = readdirSync(dir).filter(
  (f) => f.endsWith(".ts") && !["_builder.ts", "departments.ts", "index.ts"].includes(f)
);

let total = 0;
let complete = 0;
const outlineByDept = {};

for (const file of files) {
  const src = readFileSync(path.join(dir, file), "utf8");
  const slugs = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  const completeCount = (src.match(/contentStatus:\s*"complete"/g) ?? []).length;
  total += slugs.length;
  complete += completeCount;
  const outline = slugs.length - completeCount;
  if (outline > 0) {
    outlineByDept[file.replace(".ts", "")] = outline;
  }
}

console.info("BTI course content audit\n" + "=".repeat(40));
console.info(`Total courses:    ${total}`);
console.info(`Fully detailed:   ${complete}`);
console.info(`Need BTI content: ${total - complete}`);
console.info("\nCourses awaiting full content by department file:");
for (const [dept, count] of Object.entries(outlineByDept)) {
  console.info(`  ${dept}: ${count}`);
}
console.info(
  "\nFor each course awaiting content, request from BTI: learning outcomes,"
);
console.info(
  "detailed course outline, training hours, fees, and certification details."
);
console.info("Template: docs/course-content-needed.md");
