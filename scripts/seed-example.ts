/**
 * Example seed — Fried Rice Around the World.
 *
 * A tour through 12 fried rice recipes across 7 countries — Thailand, China,
 * Indonesia, Korea, Japan, Peru, USA — with English + Thai bodies for each.
 *
 * Creates:
 *   - 1 admin user placeholder (register via CMS to activate a password)
 *   - 1 category: "Fried Rice"
 *   - 12 tags: 5 recipe descriptors + 7 country regions
 *   - 12 published articles with EN + TH bodies
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

const categoryId = "seed_cat_friedrice";
const catLocEn = "seed_cat_friedrice_en";
const catLocTh = "seed_cat_friedrice_th";

// Stable tag IDs so the article↔tag join is deterministic.
const tagIds = {
  // Recipe descriptors
  rice: "seed_tag_rice",
  street: "seed_tag_street_food",
  quick: "seed_tag_quick",
  veg: "seed_tag_vegetarian",
  spicy: "seed_tag_spicy",
  // Country regions
  thailand: "seed_tag_region_thailand",
  china: "seed_tag_region_china",
  indonesia: "seed_tag_region_indonesia",
  korea: "seed_tag_region_korea",
  japan: "seed_tag_region_japan",
  peru: "seed_tag_region_peru",
  usa: "seed_tag_region_usa",
} as const;

const tagDefs: Array<{
  id: string;
  slug: string;
  en: string;
  th: string;
}> = [
  // Descriptors
  { id: tagIds.rice, slug: "rice", en: "Rice", th: "ข้าว" },
  { id: tagIds.street, slug: "street-food", en: "Street Food", th: "อาหารริมทาง" },
  { id: tagIds.quick, slug: "quick", en: "Quick", th: "ทำเร็ว" },
  { id: tagIds.veg, slug: "vegetarian", en: "Vegetarian", th: "มังสวิรัติ" },
  { id: tagIds.spicy, slug: "spicy", en: "Spicy", th: "เผ็ด" },
  // Regions
  { id: tagIds.thailand, slug: "thailand", en: "Thailand", th: "ไทย" },
  { id: tagIds.china, slug: "china", en: "China", th: "จีน" },
  { id: tagIds.indonesia, slug: "indonesia", en: "Indonesia", th: "อินโดนีเซีย" },
  { id: tagIds.korea, slug: "korea", en: "Korea", th: "เกาหลี" },
  { id: tagIds.japan, slug: "japan", en: "Japan", th: "ญี่ปุ่น" },
  { id: tagIds.peru, slug: "peru", en: "Peru", th: "เปรู" },
  { id: tagIds.usa, slug: "usa", en: "USA", th: "สหรัฐอเมริกา" },
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
  // ── Thailand ──────────────────────────────────────────
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
    tags: [tagIds.rice, tagIds.quick, tagIds.street, tagIds.thailand],
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
    tags: [tagIds.rice, tagIds.street, tagIds.thailand],
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
    tags: [tagIds.rice, tagIds.quick, tagIds.thailand],
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
    tags: [tagIds.rice, tagIds.veg, tagIds.thailand],
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
    tags: [tagIds.rice, tagIds.spicy, tagIds.street, tagIds.thailand],
  },

  // ── China ─────────────────────────────────────────────
  {
    id: "seed_art_yangzhou",
    slug: "yangzhou-fried-rice",
    titleEn: "Yangzhou Fried Rice",
    titleTh: "ข้าวผัดหยางโจว",
    excerptEn: "The Cantonese-restaurant classic — ham, shrimp, peas, and scrambled egg.",
    excerptTh: "ข้าวผัดคลาสสิกจากภัตตาคารกวางตุ้ง แฮม กุ้ง ถั่วลันเตา และไข่",
    bodyEn: `# Yangzhou Fried Rice

The most-copied Chinese fried rice in the world. The trick isn't the ingredients — it's **wok hei**, the smoky char you get only with a screaming-hot wok and a cook who never lets the rice sit still.

## Traditional mix-ins

- Char siu (Chinese BBQ pork) or ham
- Cooked shrimp, small
- Green peas
- Scrambled egg, added last
- Scallion for finish`,
    bodyTh: `# ข้าวผัดหยางโจว

ข้าวผัดจีนที่ถูกลอกสูตรมากที่สุดในโลก เคล็ดลับไม่ได้อยู่ที่วัตถุดิบ แต่อยู่ที่ **จิงเจี่ยว** (烧镬气) กลิ่นควันไฟจากกระทะร้อนจัด ที่ต้องผัดไม่หยุด

## ส่วนผสมดั้งเดิม

- หมูแดง (ชาซิว) หรือแฮม
- กุ้งลวกตัวเล็ก
- ถั่วลันเตา
- ไข่คนใส่ทีหลัง
- ต้นหอมโรยหน้า`,
    tags: [tagIds.rice, tagIds.china],
  },
  {
    id: "seed_art_egg",
    slug: "egg-fried-rice",
    titleEn: "Egg Fried Rice (Dan Chao Fan)",
    titleTh: "ข้าวผัดไข่",
    excerptEn: "The most humble fried rice — three ingredients, endless technique.",
    excerptTh: "ข้าวผัดที่เรียบง่ายที่สุด — สามส่วนผสม แต่ต้องอาศัยฝีมือ",
    bodyEn: `# Egg Fried Rice

The dish every Chinese cook is judged on. Just rice, egg, and scallion. If those three don't taste like the sum of their parts squared, you've done it wrong.

**Golden fried rice** technique: coat every grain with beaten egg *before* it hits the wok.`,
    bodyTh: `# ข้าวผัดไข่ (蛋炒饭)

เมนูที่วัดฝีมือของกุ๊กจีนได้ดีที่สุด ข้าว ไข่ ต้นหอม เท่านั้น ถ้าสามอย่างนี้ไม่ให้รสชาติที่มากกว่าผลรวม แสดงว่ายังไม่ถึง

เทคนิค **ข้าวผัดทองคำ**: คลุกไข่ให้ทั่วเมล็ดข้าวก่อนใส่กระทะ`,
    tags: [tagIds.rice, tagIds.quick, tagIds.veg, tagIds.china],
  },

  // ── Indonesia ─────────────────────────────────────────
  {
    id: "seed_art_nasigoreng",
    slug: "nasi-goreng",
    titleEn: "Nasi Goreng",
    titleTh: "นาซิโกเรง",
    excerptEn: "Indonesia's national dish — sweet-savory rice, fried egg, prawn crackers.",
    excerptTh: "อาหารประจำชาติอินโดนีเซีย ข้าวผัดรสหวาน-เค็ม ไข่ดาว และข้าวเกรียบกุ้ง",
    bodyEn: `# Nasi Goreng

Recognized by UNESCO as one of the world's 50 most delicious foods. The soul of it is **kecap manis** — Indonesian sweet soy sauce — which gives the rice its dark, glossy, molasses-adjacent character.

## The essentials

- Kecap manis (do not substitute)
- Sambal or fresh chili
- Shallots, garlic, and shrimp paste (terasi)
- Fried egg on top
- Prawn crackers (kerupuk) on the side`,
    bodyTh: `# นาซิโกเรง

องค์การยูเนสโกยกให้เป็น 1 ใน 50 อาหารอร่อยที่สุดในโลก หัวใจของเมนูนี้คือ **เกอจัปมานิส** (ซีอิ๊วหวานอินโดฯ) ที่ทำให้ข้าวเป็นสีน้ำตาลเข้ม เงางาม รสคล้ายน้ำเชื่อม

## วัตถุดิบขาดไม่ได้

- เกอจัปมานิส (ห้ามใช้อย่างอื่นแทน)
- ซัมบัลหรือพริกสด
- หอมแดง กระเทียม และกะปิ (เทอราซี)
- ไข่ดาววางบนหน้า
- ข้าวเกรียบกุ้ง (เกอรุปุก) เสิร์ฟข้าง ๆ`,
    tags: [tagIds.rice, tagIds.street, tagIds.spicy, tagIds.indonesia],
  },

  // ── Korea ─────────────────────────────────────────────
  {
    id: "seed_art_kimchi",
    slug: "kimchi-bokkeumbap",
    titleEn: "Kimchi Bokkeumbap",
    titleTh: "กิมจิบกกึมบับ",
    excerptEn: "Aged kimchi + day-old rice + sesame oil = greater than the sum of its parts.",
    excerptTh: "กิมจิเก่า + ข้าวค้างคืน + น้ำมันงา = อร่อยเกินคาด",
    bodyEn: `# Kimchi Bokkeumbap (김치볶음밥)

The dish invented for the sole purpose of using up **overripe kimchi** — the kind so sour it makes your face pucker. Frying it tames the sharpness and layers in umami.

## Non-negotiables

- Kimchi at least 2 weeks old (the older, the better)
- Sesame oil at the finish
- Fried egg on top (yolk runny, always)
- Toasted nori strips`,
    bodyTh: `# กิมจิบกกึมบับ (김치볶음밥)

เมนูที่คิดค้นเพื่อใช้ **กิมจิเปรี้ยว** — เปรี้ยวแบบทำหน้าย่น การผัดช่วยให้รสนุ่มลง และเพิ่มความอูมามิ

## ห้ามขาด

- กิมจิที่หมักอย่างน้อย 2 สัปดาห์ (ยิ่งเก่ายิ่งดี)
- น้ำมันงาโรยตอนท้าย
- ไข่ดาววางบนหน้า (ไข่แดงเยิ้มเสมอ)
- สาหร่ายโรยหน้า`,
    tags: [tagIds.rice, tagIds.quick, tagIds.spicy, tagIds.korea],
  },

  // ── Japan ─────────────────────────────────────────────
  {
    id: "seed_art_chahan",
    slug: "chahan",
    titleEn: "Chahan (Japanese Fried Rice)",
    titleTh: "จาฮัง (ข้าวผัดญี่ปุ่น)",
    excerptEn: "Precise, restrained, glass-like — Japanese fried rice is a discipline.",
    excerptTh: "ประณีต ควบคุมได้ ใสเหมือนแก้ว — ข้าวผัดญี่ปุ่นคือศาสตร์",
    bodyEn: `# Chahan (チャーハン)

Every grain separate. Every ingredient diced to the same size. Salt-based seasoning, not sauce. This is fried rice as engineering.

**Yakimeshi** is the Kansai-region cousin — same technique, slightly different mix-ins.

## Standard mix

- Chashu pork or ham, small dice
- Naganegi (Japanese long onion), fine slice
- Egg, mixed into rice first
- White pepper, salt, dash of soy at the end`,
    bodyTh: `# จาฮัง (チャーハン)

เมล็ดข้าวต้องแยกกันทุกเม็ด วัตถุดิบทุกอย่างต้องหั่นขนาดเท่ากัน ปรุงด้วยเกลือไม่ใช่ซอส นี่คือข้าวผัดในรูปแบบวิศวกรรม

**ยากิเมชิ** คือเวอร์ชันแคนไซ เทคนิคเหมือนกัน แต่วัตถุดิบต่างเล็กน้อย

## ส่วนผสมมาตรฐาน

- ชาชูหรือแฮมหั่นเต๋าเล็ก
- ต้นหอมญี่ปุ่น (นากาเนงิ) หั่นบาง
- ไข่ผสมกับข้าวก่อนผัด
- พริกไทยขาว เกลือ และซีอิ๊วนิดหน่อยตอนท้าย`,
    tags: [tagIds.rice, tagIds.quick, tagIds.japan],
  },

  // ── Peru ──────────────────────────────────────────────
  {
    id: "seed_art_chaufa",
    slug: "arroz-chaufa",
    titleEn: "Arroz Chaufa",
    titleTh: "อาร์โรซชาวฟา",
    excerptEn: "Peruvian-Chinese chifa: fried rice through a Lima wok, soy sauce meets aji.",
    excerptTh: "ชิฟา อาหารเปรู-จีน: ข้าวผัดผ่านกระทะลิมา ซีอิ๊วเจอกับพริกอาฮี",
    bodyEn: `# Arroz Chaufa

Born when Cantonese immigrants arrived in Peru in the 1800s and had to work with local ingredients. The result: fried rice with a distinctly South American accent — **aji amarillo**, ginger, and sometimes hot dogs (yes, really).

Peru has a whole category of Chinese-Peruvian food called *chifa*, and chaufa is its most famous dish.`,
    bodyTh: `# อาร์โรซชาวฟา

กำเนิดเมื่อผู้อพยพชาวกวางตุ้งมาถึงเปรูในยุค 1800 และต้องปรับสูตรใช้วัตถุดิบท้องถิ่น ผลลัพธ์: ข้าวผัดสำเนียงอเมริกาใต้ ใช้ **อาฮีอามาริโย** (พริกเหลืองเปรู) ขิง และบางทีก็มีฮอทดอก (จริง ๆ)

เปรูมีอาหารทั้งกลุ่มที่เรียกว่า *ชิฟา* (จีน-เปรู) และชาวฟาคือเมนูที่โด่งดังที่สุด`,
    tags: [tagIds.rice, tagIds.peru],
  },

  // ── USA ───────────────────────────────────────────────
  {
    id: "seed_art_dirtyrice",
    slug: "cajun-dirty-rice",
    titleEn: "Cajun Dirty Rice",
    titleTh: "ข้าวผัดเคจัน (เดอร์ตี้ไรซ์)",
    excerptEn: "Louisiana's contribution — rice cooked in the pan drippings of everything.",
    excerptTh: "เมนูจากรัฐลุยเซียนา — ข้าวผัดในน้ำมันจากเครื่องในไก่และเบคอน",
    bodyEn: `# Cajun Dirty Rice

Not fried in the Asian sense — this is rice **cooked into** browned meat and its fat, which is why it looks "dirty." Chicken livers, pork sausage, the holy trinity (onion, celery, bell pepper), and enough cayenne to remember it.

Not for the timid. Absolutely for a Sunday afternoon.`,
    bodyTh: `# ข้าวผัดเคจัน (เดอร์ตี้ไรซ์)

ไม่ใช่ข้าวผัดแบบเอเชีย — ข้าวถูก **หุงรวมกับ** เนื้อสัตว์และน้ำมันจากการผัด จึงมีสีเข้ม ตับไก่ ไส้กรอกหมู หอมใหญ่-เซเลอรี่-พริกหวาน (Holy Trinity ของเคจัน) และพริกป่นให้เผ็ดจำได้

ไม่เหมาะกับคนกลัวเผ็ด เหมาะสุด ๆ กับเย็นวันอาทิตย์`,
    tags: [tagIds.rice, tagIds.spicy, tagIds.usa],
  },
];

function sqlEscape(s: string) {
  return s.replace(/'/g, "''");
}

const lines: string[] = [
  "-- Khao Pad example seed (Fried Rice Around the World).",
  "-- Safe to re-run: uses INSERT OR IGNORE on deterministic IDs.",
  "",
  `INSERT OR IGNORE INTO users (id, name, email, email_verified, role, created_at, updated_at)`,
  `VALUES ('${userId}', 'Seed Admin', 'admin@khaopad.local', 1, 'super_admin', '${now}', '${now}');`,
  "",
  "-- Category: Fried Rice",
  `INSERT OR IGNORE INTO categories (id, slug, created_at) VALUES ('${categoryId}', 'fried-rice', '${now}');`,
  `INSERT OR IGNORE INTO category_localizations (id, category_id, locale, name, description) VALUES`,
  `  ('${catLocEn}', '${categoryId}', 'en', 'Fried Rice', 'A tour of fried rice recipes from around the world.'),`,
  `  ('${catLocTh}', '${categoryId}', 'th', 'ข้าวผัด', 'ทัวร์สูตรข้าวผัดจากทั่วโลก');`,
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
