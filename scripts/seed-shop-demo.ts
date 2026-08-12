/**
 * Seed the demo storefront with products.
 *
 * The CMS seed (seed-example.ts) only fills articles/taxonomy, so the
 * demo shop rendered "No products yet" while every commerce feature
 * shipped and deployed. This fills in a small catalogue so browse,
 * facets, Thai search, cart, and checkout are all explorable on the
 * public demo.
 *
 * Usage:
 *   pnpm db:seed:shop              # local D1
 *   D1_DB_NAME=khaopad-example-db pnpm db:seed:shop -- --remote
 *
 * Idempotent: every row uses INSERT OR REPLACE on a stable seed id, so
 * re-running after the nightly reset restores the same catalogue.
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const remote = process.argv.includes("--remote");
const target = remote ? "--remote" : "--local";
const dbName = process.env.D1_DB_NAME ?? "khaopad-db";
const now = new Date().toISOString();

const sqlEscape = (s: string) => s.replace(/'/g, "''");

type SeedProduct = {
  id: string;
  slug: string;
  vendor: string;
  productType: string;
  tags: string;
  titleEn: string;
  titleTh: string;
  descEn: string;
  descTh: string;
  priceSatang: number;
  compareAtSatang?: number;
  sku: string;
  onHand: number;
};

const products: SeedProduct[] = [
  {
    id: "seed_prod_tote",
    slug: "canvas-tote-bag",
    vendor: "Khao Goods",
    productType: "Bag",
    tags: "everyday,cotton",
    titleEn: "Canvas Tote Bag",
    titleTh: "กระเป๋าผ้าแคนวาส",
    descEn:
      "A sturdy 12oz cotton canvas tote with reinforced handles. Roomy enough for a laptop, a market run, or both.",
    descTh:
      "กระเป๋าผ้าแคนวาสคอตตอน 12 ออนซ์ หูจับเสริมความแข็งแรง ใส่โน้ตบุ๊กหรือของจากตลาดได้สบาย",
    priceSatang: 45000,
    compareAtSatang: 59000,
    sku: "TOTE-CANVAS",
    onHand: 42,
  },
  {
    id: "seed_prod_tee",
    slug: "everyday-cotton-tee",
    vendor: "Khao Goods",
    productType: "Apparel",
    tags: "everyday,cotton",
    titleEn: "Everyday Cotton Tee",
    titleTh: "เสื้อยืดคอตตอนใส่ประจำวัน",
    descEn:
      "Soft combed cotton in a relaxed cut. Pre-shrunk, so it fits the same after the first wash.",
    descTh:
      "ผ้าคอตตอนหวีนุ่ม ทรงสบาย ผ่านการหดตัวมาแล้ว ซักครั้งแรกก็ยังใส่พอดี",
    priceSatang: 39000,
    sku: "TEE-COTTON",
    onHand: 120,
  },
  {
    id: "seed_prod_mug",
    slug: "stoneware-coffee-mug",
    vendor: "Siam Ceramics",
    productType: "Kitchen",
    tags: "kitchen,ceramic",
    titleEn: "Stoneware Coffee Mug",
    titleTh: "แก้วกาแฟสโตนแวร์",
    descEn:
      "Hand-glazed stoneware, 300ml. Microwave and dishwasher safe; the glaze keeps coffee hot longer than thin porcelain.",
    descTh:
      "สโตนแวร์เคลือบด้วยมือ ความจุ 300 มล. เข้าไมโครเวฟและเครื่องล้างจานได้ เก็บความร้อนได้ดีกว่าพอร์ซเลนบาง",
    priceSatang: 28000,
    sku: "MUG-STONE",
    onHand: 8,
  },
  {
    id: "seed_prod_apron",
    slug: "linen-kitchen-apron",
    vendor: "Siam Ceramics",
    productType: "Kitchen",
    tags: "kitchen,linen",
    titleEn: "Linen Kitchen Apron",
    titleTh: "ผ้ากันเปื้อนลินิน",
    descEn:
      "Washed linen with adjustable neck strap and a deep front pocket. Softens with every wash.",
    descTh: "ลินินฟอกนุ่ม ปรับสายคอได้ มีกระเป๋าหน้าลึก ยิ่งซักยิ่งนุ่ม",
    priceSatang: 68000,
    compareAtSatang: 85000,
    sku: "APRON-LINEN",
    onHand: 25,
  },
  {
    id: "seed_prod_notebook",
    slug: "recycled-paper-notebook",
    vendor: "Khao Goods",
    productType: "Stationery",
    tags: "paper,everyday",
    titleEn: "Recycled Paper Notebook",
    titleTh: "สมุดกระดาษรีไซเคิล",
    descEn:
      "96 dot-grid pages of 100% recycled paper, lay-flat binding. Fountain-pen friendly.",
    descTh:
      "กระดาษรีไซเคิล 100% แบบจุดไข่ปลา 96 หน้า เย็บกี่กางราบ ใช้กับปากกาหมึกซึมได้",
    priceSatang: 18000,
    sku: "NOTE-RECYCLED",
    onHand: 0,
  },
];

const lines: string[] = [];

for (const p of products) {
  const variantId = `${p.id}_v1`;
  const itemId = `${p.id}_inv`;

  lines.push(
    `INSERT OR REPLACE INTO shop_products (id, slug, status, vendor, product_type, tags, seo_title, seo_description, created_at, updated_at, published_at) VALUES (` +
      `'${p.id}', '${p.slug}', 'active', '${sqlEscape(p.vendor)}', '${sqlEscape(p.productType)}', '${sqlEscape(p.tags)}', ` +
      `'${sqlEscape(p.titleEn)}', '${sqlEscape(p.descEn.slice(0, 150))}', '${now}', '${now}', '${now}');`,
  );

  for (const [locale, title, desc] of [
    ["en", p.titleEn, p.descEn],
    ["th", p.titleTh, p.descTh],
  ] as const) {
    lines.push(
      `INSERT OR REPLACE INTO shop_product_localizations (product_id, locale, title, description_markdown) VALUES (` +
        `'${p.id}', '${locale}', '${sqlEscape(title)}', '${sqlEscape(desc)}');`,
    );
  }

  lines.push(
    `INSERT OR REPLACE INTO shop_product_variants (id, product_id, sku, status, title_cached, price_satang, compare_at_satang, requires_shipping, taxable, position) VALUES (` +
      `'${variantId}', '${p.id}', '${p.sku}', 'active', 'Default', ${p.priceSatang}, ` +
      `${p.compareAtSatang ?? "NULL"}, 1, 1, 1);`,
  );

  lines.push(
    `INSERT OR REPLACE INTO shop_inventory_items (id, variant_id, tracked, continue_selling_when_out_of_stock) VALUES (` +
      `'${itemId}', '${variantId}', 1, 0);`,
  );
  lines.push(
    `INSERT OR REPLACE INTO shop_inventory_levels (item_id, location_id, on_hand, reserved) VALUES (` +
      `'${itemId}', 'default', ${p.onHand}, 0);`,
  );
}

// FTS is app-synced (no triggers), so seeded rows must be indexed here or
// storefront search returns nothing for them.
lines.push(
  `DELETE FROM products_fts WHERE product_id IN (${products.map((p) => `'${p.id}'`).join(", ")});`,
);
for (const p of products) {
  for (const [locale, title, desc] of [
    ["en", p.titleEn, p.descEn],
    ["th", p.titleTh, p.descTh],
  ] as const) {
    lines.push(
      `INSERT INTO products_fts (title, description, locale, product_id) VALUES (` +
        `'${sqlEscape(title)}', '${sqlEscape(desc)}', '${locale}', '${p.id}');`,
    );
  }
}

const outDir = join(process.cwd(), "drizzle");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "seed-shop-demo.sql");
writeFileSync(outFile, lines.join("\n") + "\n");

console.log(`[seed-shop-demo] wrote ${outFile}`);
console.log(
  `[seed-shop-demo] applying to ${remote ? "REMOTE" : "LOCAL"} D1 (${dbName})…`,
);

try {
  execSync(`npx wrangler d1 execute ${dbName} ${target} --file=${outFile}`, {
    stdio: "inherit",
  });
  console.log(`[seed-shop-demo] done — ${products.length} products.`);
} catch (err) {
  console.error(
    "[seed-shop-demo] failed:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
}
