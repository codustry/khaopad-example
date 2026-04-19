/**
 * Example seed — Thai fried rice showcase content for khaopad-example.
 *
 * Creates:
 *   - 1 admin user placeholder (register via CMS to activate a password)
 *   - 1 category: "Thai Cuisine"
 *   - 5 tags: rice, street-food, quick, vegetarian, spicy
 *   - 5 published articles about khao pad variants (EN + TH bodies)
 *
 * Usage:
 *   pnpm db:seed:example              # local D1
 *   pnpm db:seed:example -- --remote  # production D1
 *
 * Re-runnable: every INSERT uses OR IGNORE on stable IDs.
 * The admin user is a placeholder — no password set. After the first deploy,
 * visit /register on the live cms.* subdomain to create the real first admin
 * (Better Auth signup is gated to before-first-admin only).
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const remote = process.argv.includes("--remote");
const target = remote ? "--remote" : "--local";
const dbName = process.env.D1_DB_NAME ?? "khaopad-db";
const now = new Date().toISOString();

const userId = "seed_user_admin";

const categoryId = "seed_cat_thai";
const catLocEn = "seed_cat_thai_en";
const catLocTh = "seed_cat_thai_th";

// Stable tag IDs so the article↔tag join is deterministic.
const tagIds = {
  rice: "seed_tag_rice",
  street: "seed_tag_street_food",
  quick: "seed_tag_quick",
  veg: "seed_tag_vegetarian",
  spicy: "seed_tag_spicy",
} as const;

const tagDefs: Array<{
  id: string;
  slug: string;
  en: string;
  th: string;
}> = [
  { id: tagIds.rice, slug: "rice", en: "Rice", th: "ข้าว" },
  { id: tagIds.street, slug: "street-food", en: "Street Food", th: "อาหารริมทาง" },
  { id: tagIds.quick, slug: "quick", en: "Quick", th: "ทำเร็ว" },
  { id: tagIds.veg, slug: "vegetarian", en: "Vegetarian", th: "มังสวิรัติ" },
  { id: tagIds.spicy, slug: "spicy", en: "Spicy", th: "เผ็ด" },
];

type ArticleSeed = {
  id: string;
  slug: string;
  titleEn: string;
  titleTh: string;
  excerptEn: string;
  excerptTh: string;
  bodyEn: string;
  bodyTh: string;
  tags: readonly string[];
};

// Keep markdown bodies short but realistic so the "edit on cms → see on www" loop
// is genuinely satisfying. Escaped newlines (\n) stay as literal \n in SQL string.
const articles: ArticleSeed[] = [
  {
    id: "seed_art_classic",
    slug: "classic-khao-pad",
    titleEn: "Classic Khao Pad",
    titleTh: "ข้าวผัดต้นตำรับ",
    excerptEn: "The foundational Thai fried rice — garlic, egg, and day-old jasmine rice.",
    excerptTh: "ข้าวผัดสูตรพื้นฐาน ด้วยกระเทียม ไข่ และข้าวหอมมะลิค้างคืน",
    bodyEn: `# Classic Khao Pad

The dish that defines a Thai home kitchen. The secret is **day-old rice** — fresh rice steams, yesterday's rice fries.

## Ingredients

- 3 cups day-old jasmine rice
- 2 eggs
- 3 cloves garlic, minced
- 2 tbsp light soy sauce
- 1 tsp sugar
- White pepper, to taste
- Cucumber and lime wedges to serve

## Method

1. Heat oil over high heat until shimmering.
2. Add garlic; fry 10 seconds.
3. Crack eggs directly into the wok, scramble briefly.
4. Add rice, breaking up clumps.
5. Season with soy, sugar, pepper. Toss hard.
6. Serve with cucumber and lime.`,
    bodyTh: `# ข้าวผัดต้นตำรับ

เมนูประจำครัวไทยทุกบ้าน เคล็ดลับอยู่ที่ **ข้าวค้างคืน** — ข้าวใหม่จะเหนียว ข้าวเก่าจะร่วนและผัดอร่อย

## วัตถุดิบ

- ข้าวหอมมะลิค้างคืน 3 ถ้วย
- ไข่ไก่ 2 ฟอง
- กระเทียมสับ 3 กลีบ
- ซีอิ๊วขาว 2 ช้อนโต๊ะ
- น้ำตาล 1 ช้อนชา
- พริกไทยขาว ตามชอบ
- แตงกวาและมะนาวเสิร์ฟ

## วิธีทำ

1. ตั้งกระทะให้ร้อนจัด ใส่น้ำมัน
2. ใส่กระเทียมผัด 10 วินาที
3. ตอกไข่ลงกระทะ คนพอสุก
4. ใส่ข้าว ใช้ตะหลิวตีให้ร่วน
5. ปรุงด้วยซีอิ๊ว น้ำตาล พริกไทย ผัดไฟแรง
6. เสิร์ฟพร้อมแตงกวาและมะนาว`,
    tags: [tagIds.rice, tagIds.quick, tagIds.street],
  },
  {
    id: "seed_art_shrimp",
    slug: "khao-pad-goong",
    titleEn: "Khao Pad Goong (Shrimp Fried Rice)",
    titleTh: "ข้าวผัดกุ้ง",
    excerptEn: "Sweet, plump prawns tossed through garlicky jasmine rice.",
    excerptTh: "กุ้งสด ๆ หวานฉ่ำ ผัดกับข้าวและกระเทียมหอม",
    bodyEn: `# Khao Pad Goong

The seafood version that rules Bangkok lunch menus. Prawn heads go in first — their fat perfumes the oil.

## What matters

- Use whole prawns if you can. Peel before serving.
- Fish sauce, not soy, for the seafood edge.
- A squeeze of lime right before eating.`,
    bodyTh: `# ข้าวผัดกุ้ง

เวอร์ชันซีฟู้ดยอดฮิตของร้านอาหารกลางวันในกรุงเทพ ใส่หัวกุ้งลงก่อน เพื่อให้มันกุ้งหอมในน้ำมัน

## เคล็ดลับ

- ใช้กุ้งทั้งตัวถ้าทำได้ ปอกก่อนเสิร์ฟ
- ใช้น้ำปลา ไม่ใช่ซีอิ๊ว เพื่อรสซีฟู้ด
- บีบมะนาวก่อนกิน`,
    tags: [tagIds.rice, tagIds.street],
  },
  {
    id: "seed_art_pineapple",
    slug: "khao-pad-sapparot",
    titleEn: "Pineapple Fried Rice",
    titleTh: "ข้าวผัดสับปะรด",
    excerptEn: "Curry-gold rice with cashews, raisins, and juicy pineapple chunks.",
    excerptTh: "ข้าวผัดสีเหลืองทองกลิ่นผงกะหรี่ เม็ดมะม่วงหิมพานต์ ลูกเกด และสับปะรด",
    bodyEn: `# Pineapple Fried Rice

A tourist favorite for a reason — the sweet/savory balance is perfect. Yellow curry powder does the color work.

Tip: serve inside the hollowed-out pineapple shell for the full effect.`,
    bodyTh: `# ข้าวผัดสับปะรด

เมนูที่นักท่องเที่ยวชอบเป็นพิเศษ ด้วยความสมดุลของรสหวาน-เค็ม สีเหลืองจากผงกะหรี่

เคล็ดลับ: เสิร์ฟในเปลือกสับปะรดที่คว้านแล้ว เพิ่มความน่ากิน`,
    tags: [tagIds.rice, tagIds.quick],
  },
  {
    id: "seed_art_veg",
    slug: "khao-pad-jay",
    titleEn: "Khao Pad Jay (Vegetarian)",
    titleTh: "ข้าวผัดเจ",
    excerptEn: "All the punch of classic khao pad — zero animal products.",
    excerptTh: "ข้าวผัดรสจัดจ้านแบบดั้งเดิม ไม่มีส่วนผสมจากสัตว์",
    bodyEn: `# Khao Pad Jay

Made during the October Vegetarian Festival and year-round for Buddhist observance. Uses soy sauce instead of fish sauce, tofu instead of egg.

No garlic or onion if cooking strictly *jay*.`,
    bodyTh: `# ข้าวผัดเจ

ทำในช่วงเทศกาลกินเจเดือนตุลาคม และตลอดปีสำหรับผู้ถือศีล ใช้ซีอิ๊วแทนน้ำปลา เต้าหู้แทนไข่

ถ้ากินเจแบบเคร่ง งดกระเทียมและหอมใหญ่`,
    tags: [tagIds.rice, tagIds.veg],
  },
  {
    id: "seed_art_krapao",
    slug: "khao-pad-krapao",
    titleEn: "Khao Pad Krapao",
    titleTh: "ข้าวผัดกะเพรา",
    excerptEn: "Holy-basil stir-fry folded into fried rice — the lunch of champions.",
    excerptTh: "ข้าวผัดใบกะเพรารสจัด อาหารกลางวันโปรดของคนไทย",
    bodyEn: `# Khao Pad Krapao

When you can't decide between pad krapao and khao pad, do both. Thai bird's-eye chilies are non-negotiable.

Top with a crispy fried egg (**khai dao**).`,
    bodyTh: `# ข้าวผัดกะเพรา

ถ้าเลือกไม่ถูกระหว่างผัดกะเพรากับข้าวผัด ทำรวมกันเลย พริกขี้หนูสวนขาดไม่ได้

โปะด้วยไข่ดาวกรอบ ๆ`,
    tags: [tagIds.rice, tagIds.spicy, tagIds.street],
  },
];

function sqlEscape(s: string) {
  return s.replace(/'/g, "''");
}

const lines: string[] = [
  "-- Khao Pad example seed (Thai fried rice showcase).",
  "-- Safe to re-run: uses INSERT OR IGNORE on deterministic IDs.",
  "",
  `INSERT OR IGNORE INTO users (id, name, email, email_verified, role, created_at, updated_at)`,
  `VALUES ('${userId}', 'Seed Admin', 'admin@khaopad.local', 1, 'super_admin', '${now}', '${now}');`,
  "",
  "-- Category: Thai Cuisine",
  `INSERT OR IGNORE INTO categories (id, slug, created_at) VALUES ('${categoryId}', 'thai-cuisine', '${now}');`,
  `INSERT OR IGNORE INTO category_localizations (id, category_id, locale, name, description) VALUES`,
  `  ('${catLocEn}', '${categoryId}', 'en', 'Thai Cuisine', 'Classic dishes from Thailand''s home and street kitchens.'),`,
  `  ('${catLocTh}', '${categoryId}', 'th', 'อาหารไทย', 'เมนูคลาสสิกจากครัวไทยและริมถนน');`,
  "",
  "-- Tags",
];

for (const t of tagDefs) {
  lines.push(
    `INSERT OR IGNORE INTO tags (id, slug, created_at) VALUES ('${t.id}', '${t.slug}', '${now}');`,
    `INSERT OR IGNORE INTO tag_localizations (id, tag_id, locale, name) VALUES`,
    `  ('${t.id}_en', '${t.id}', 'en', '${sqlEscape(t.en)}'),`,
    `  ('${t.id}_th', '${t.id}', 'th', '${sqlEscape(t.th)}');`,
  );
}

lines.push("", "-- Articles");
for (const a of articles) {
  lines.push(
    `INSERT OR IGNORE INTO articles (id, slug, category_id, author_id, status, published_at, created_at, updated_at)`,
    `VALUES ('${a.id}', '${a.slug}', '${categoryId}', '${userId}', 'published', '${now}', '${now}', '${now}');`,
    `INSERT OR IGNORE INTO article_localizations (id, article_id, locale, title, excerpt, body) VALUES`,
    `  ('${a.id}_en', '${a.id}', 'en', '${sqlEscape(a.titleEn)}', '${sqlEscape(a.excerptEn)}', '${sqlEscape(a.bodyEn)}'),`,
    `  ('${a.id}_th', '${a.id}', 'th', '${sqlEscape(a.titleTh)}', '${sqlEscape(a.excerptTh)}', '${sqlEscape(a.bodyTh)}');`,
  );
  for (const tagId of a.tags) {
    lines.push(
      `INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES ('${a.id}', '${tagId}');`,
    );
  }
}

const sql = lines.join("\n") + "\n";

const outDir = join(process.cwd(), "drizzle");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "seed-example.sql");
writeFileSync(outFile, sql);

console.log(`[seed-example] wrote ${outFile}`);
console.log(
  `[seed-example] applying to ${remote ? "REMOTE" : "LOCAL"} D1 (${dbName})…`,
);

try {
  execSync(`npx wrangler d1 execute ${dbName} ${target} --file=${outFile}`, {
    stdio: "inherit",
  });
  console.log("[seed-example] done.");
} catch (err) {
  console.error(
    "[seed-example] failed:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
}
