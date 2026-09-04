#!/usr/bin/env node
/**
 * Validate 5-market chain alignment:
 * love-brands ↔ keep-grader dogfood ↔ buy-now script-draft ↔ catalog-sync.
 * Ensures CHI/ATX/MIA/BNA/DEN stay paired by market + yelp_alias.
 * Exit 0 if all 5 markets are fully covered; else 1.
 * No network. No secrets. Not forecasting.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "fixtures", "tool-hunt");

const REQUIRED = [
  { market: "Chicago, IL", love: "chicago-love-brands.json", code: "CHI" },
  { market: "Austin, TX", love: "austin-love-brands.json", code: "ATX" },
  { market: "Miami, FL", love: "miami-love-brands.json", code: "MIA" },
  { market: "Nashville, TN", love: "nashville-love-brands.json", code: "BNA" },
  { market: "Denver, CO", love: "denver-love-brands.json", code: "DEN" },
];

function load(file) {
  return JSON.parse(readFileSync(join(dir, file), "utf8"));
}

function basenameFromRef(ref) {
  return String(ref || "")
    .replace(/^fixtures\/tool-hunt\//, "")
    .replace(/^\.\//, "");
}

const files = readdirSync(dir).sort();
const keepGraders = files.filter(
  (f) => f.startsWith("pain-to-sales-keep-grader-") && f.endsWith(".json")
);
const socialShops = files.filter(
  (f) => f.startsWith("pain-to-sales-social-shop-") && f.endsWith(".json")
);
const scripts = files.filter((f) => f.startsWith("script-draft-") && f.endsWith(".json"));
const catalogs = files.filter((f) => f.startsWith("catalog-sync-") && f.endsWith(".json"));

const coverage = [];

for (const req of REQUIRED) {
  if (!files.includes(req.love)) {
    console.error(`validate-market-coverage: missing love fixture ${req.love}`);
    process.exit(1);
  }
  const love = load(req.love);
  if (love.market !== req.market) {
    console.error(
      `validate-market-coverage: ${req.love} market is "${love.market}", expected "${req.market}"`
    );
    process.exit(1);
  }
  const aliases = new Set(
    (Array.isArray(love.brands) ? love.brands : [])
      .map((b) => b.yelp_alias)
      .filter(Boolean)
  );
  if (aliases.size < 1) {
    console.error(`validate-market-coverage: ${req.love} has no yelp_alias brands`);
    process.exit(1);
  }

  const graderMatches = keepGraders.filter((f) => {
    const d = load(f);
    return (
      d.sales_lead_draft?.market === req.market || d.pain_lead?.venue?.market === req.market
    );
  });
  if (graderMatches.length !== 1) {
    console.error(
      `validate-market-coverage: ${req.market} needs exactly 1 keep-grader (has ${graderMatches.length}: ${graderMatches.join(", ") || "none"})`
    );
    process.exit(1);
  }
  const graderFile = graderMatches[0];
  const grader = load(graderFile);
  const graderAlias =
    grader.pain_lead?.venue?.yelp_alias || grader.sales_lead_draft?.yelp_alias || null;
  if (!graderAlias || !aliases.has(graderAlias)) {
    console.error(
      `validate-market-coverage: ${graderFile} yelp_alias "${graderAlias}" must be in ${req.love}`
    );
    process.exit(1);
  }
  const loveRefs = [
    ...(grader.pain_lead?.sources || []),
    ...(grader.tools_used || []),
  ].map(basenameFromRef);
  if (!loveRefs.includes(req.love)) {
    console.error(
      `validate-market-coverage: ${graderFile} must reference ${req.love} in sources/tools_used`
    );
    process.exit(1);
  }

  const scriptMatches = scripts.filter((f) => load(f).lead?.market === req.market);
  if (scriptMatches.length !== 1) {
    console.error(
      `validate-market-coverage: ${req.market} needs exactly 1 script-draft (has ${scriptMatches.length}: ${scriptMatches.join(", ") || "none"})`
    );
    process.exit(1);
  }
  const scriptFile = scriptMatches[0];
  const script = load(scriptFile);
  const scriptAlias = script.lead?.yelp_alias;
  if (!scriptAlias || !aliases.has(scriptAlias)) {
    console.error(
      `validate-market-coverage: ${scriptFile} yelp_alias "${scriptAlias}" must be in ${req.love}`
    );
    process.exit(1);
  }
  if (scriptAlias !== graderAlias) {
    console.error(
      `validate-market-coverage: ${req.market} script alias "${scriptAlias}" ≠ grader alias "${graderAlias}"`
    );
    process.exit(1);
  }
  if (basenameFromRef(script.lead?.source_fixture) !== req.love) {
    console.error(
      `validate-market-coverage: ${scriptFile} source_fixture must be ${req.love}`
    );
    process.exit(1);
  }

  const catalogMatches = catalogs.filter((f) => load(f).product?.market === req.market);
  if (catalogMatches.length !== 1) {
    console.error(
      `validate-market-coverage: ${req.market} needs exactly 1 catalog-sync (has ${catalogMatches.length}: ${catalogMatches.join(", ") || "none"})`
    );
    process.exit(1);
  }
  const catalogFile = catalogMatches[0];
  const catalog = load(catalogFile);
  if (basenameFromRef(catalog.from_draft) !== scriptFile) {
    console.error(
      `validate-market-coverage: ${catalogFile} from_draft must point at ${scriptFile}`
    );
    process.exit(1);
  }

  const socialMatches = socialShops.filter((f) => {
    const d = load(f);
    return (
      d.sales_lead_draft?.market === req.market || d.pain_lead?.venue?.market === req.market
    );
  });
  if (socialMatches.length !== 1) {
    console.error(
      `validate-market-coverage: ${req.market} needs exactly 1 social-shop dogfood (has ${socialMatches.length}: ${socialMatches.join(", ") || "none"})`
    );
    process.exit(1);
  }
  const socialFile = socialMatches[0];
  const social = load(socialFile);
  const socialAlias = social.pain_lead?.venue?.yelp_alias || null;
  if (!socialAlias || socialAlias !== scriptAlias) {
    console.error(
      `validate-market-coverage: ${socialFile} yelp_alias "${socialAlias}" must match script alias "${scriptAlias}"`
    );
    process.exit(1);
  }
  if (!social.signals?.social_shop_fee) {
    console.error(`validate-market-coverage: ${socialFile} must set signals.social_shop_fee`);
    process.exit(1);
  }

  coverage.push({
    code: req.code,
    market: req.market,
    love: req.love,
    yelp_alias: scriptAlias,
    keep_grader: graderFile,
    social_shop: socialFile,
    script_draft: scriptFile,
    catalog_sync: catalogFile,
  });
}

console.log(
  JSON.stringify(
    {
      ok: true,
      markets: coverage.length,
      chain: "love→keep-grader→social-shop→script-draft→catalog-sync",
      coverage,
    },
    null,
    2
  )
);
process.exit(0);
