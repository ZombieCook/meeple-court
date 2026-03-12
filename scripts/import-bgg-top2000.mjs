/**
 * BGG Top 2000 Import Script
 *
 * Fetches top 2000 ranked board games from BoardGameGeek and outputs
 * a JSON file suitable for Supabase seeding.
 *
 * Usage: node scripts/import-bgg-top2000.mjs
 * Requires: Node 18+ (built-in fetch)
 * Output:  scripts/bgg-top2000.json
 */

import { writeFileSync } from "fs";

// ─── Emoji mapping by BGG category ──────────────────────────────────────────
const CATEGORY_EMOJI = {
  "Fantasy":              "⚔️",
  "Science Fiction":      "🚀",
  "Civilization":         "🏛️",
  "Economic":             "💰",
  "Card Game":            "🃏",
  "Dice":                 "🎲",
  "Abstract Strategy":    "♟️",
  "Wargame":              "🔫",
  "Horror":               "👻",
  "Exploration":          "🗺️",
  "Medieval":             "🏰",
  "Nautical":             "⚓",
  "Space Exploration":    "🌌",
  "Animals":              "🐾",
  "Puzzle":               "🧩",
  "Deduction":            "🔍",
  "Negotiation":          "🤝",
  "Party Game":           "🎉",
  "Trivia":               "❓",
  "Adventure":            "🧭",
  "Pirates":              "🏴‍☠️",
  "Ancient":              "🏺",
  "Trains":               "🚂",
  "Murder/Mystery":       "🔪",
  "Mythology":            "🪄",
  "Political":            "🗳️",
  "Environmental":        "🌿",
  "Fighting":             "👊",
  "Racing":               "🏎️",
  "Sports":               "⚽",
  "Medical":              "💊",
  "Zombies":              "🧟",
  "Bluffing":             "🎭",
  "City Building":        "🏙️",
  "Dungeon Crawler":      "🗝️",
  "World War II":         "🪖",
  "World War I":          "🪖",
  "Humor":                "😂",
  "Children's Game":      "🧸",
  "Educational":          "📚",
  "Transportation":       "🚢",
  "Travel":               "✈️",
  "Territory Building":   "🗺️",
  "Word Game":            "🔤",
  "Farming":              "🌾",
  "Renaissance":          "🎨",
  "Prehistoric":          "🦕",
  "Number":               "🔢",
  "Action / Dexterity":   "🎯",
  "Religious":            "⛪",
  "Spies/Secret Agents":  "🕵️",
  "Post-Napoleonic":      "⚔️",
  "Napoleonic":           "🎖️",
  "American West":        "🤠",
  "American Civil War":   "⚔️",
  "American Revolutionary War": "🗽",
  "Arabian":              "🌙",
  "Comic Book / Strip":   "💬",
  "Expansion for Base-game": "📦",
  "Movies / TV / Radio theme": "🎬",
  "Music":                "🎵",
  "Novel-based":          "📖",
  "Video Game Theme":     "🎮",
  "Electronic":           "🖥️",
  "Miniatures":           "🗡️",
};

function getEmoji(categories) {
  for (const cat of categories) {
    if (CATEGORY_EMOJI[cat]) return CATEGORY_EMOJI[cat];
  }
  return "🎲";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, retries = 4, delayMs = 2000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "BGG-Seed-Script/1.0 (personal import)" },
      });
      if (res.status === 202) {
        console.log("  [BGG] Still processing, waiting 3s...");
        await sleep(3000);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.text();
    } catch (err) {
      if (attempt === retries - 1) throw err;
      console.warn(`  Retry ${attempt + 1}: ${err.message}`);
      await sleep(delayMs);
    }
  }
}

// ─── Step 1: Get game IDs by scraping BGG browse pages ───────────────────────
async function getPageIds(page) {
  const url = `https://boardgamegeek.com/browse/boardgame?sort=rank&sortdir=asc&page=${page}`;
  const html = await fetchWithRetry(url);
  // Links look like: href="/boardgame/174430/gloomhaven"
  const matches = [...html.matchAll(/href="\/boardgame\/(\d+)\//g)];
  const ids = [...new Set(matches.map((m) => m[1]))];
  return ids;
}

// ─── Step 2: Get game details via BGG XML API ─────────────────────────────────
function parseXmlGames(xml) {
  const games = [];
  const itemRe = /<item[^>]+type="boardgame"[^>]+id="(\d+)"[^>]*>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const id = m[1];
    const body = m[2];

    const primaryM = body.match(/<name[^>]+type="primary"[^>]+value="([^"]+)"/);
    const nameEn = primaryM ? decodeXmlEntities(primaryM[1]) : "";

    // Korean alternate name
    const altRe = /<name[^>]+type="alternate"[^>]+value="([^"]+)"/g;
    let altM;
    const altNames = [];
    while ((altM = altRe.exec(body)) !== null) {
      altNames.push(decodeXmlEntities(altM[1]));
    }
    const nameKo = altNames.find((n) => /[\uac00-\ud7a3]/.test(n)) || null;

    const yearM = body.match(/<yearpublished[^>]+value="([^"]+)"/);
    const year = yearM ? yearM[1] : null;

    const rankM = body.match(/<rank[^>]+name="boardgame"[^>]+value="(\d+)"/);
    const rank = rankM ? parseInt(rankM[1]) : 99999;

    const catRe = /<link[^>]+type="boardgamecategory"[^>]+value="([^"]+)"/g;
    let catM;
    const categories = [];
    while ((catM = catRe.exec(body)) !== null) {
      categories.push(catM[1]);
    }

    games.push({ id, nameEn, nameKo, year, rank, categories, icon: getEmoji(categories) });
  }
  return games;
}

function decodeXmlEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code)));
}

async function getGameDetails(ids) {
  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${ids.join(",")}&stats=1`;
  const xml = await fetchWithRetry(url);
  if (!xml) return [];
  return parseXmlGames(xml);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const TOTAL_PAGES = 20; // 100 games/page × 20 = 2000
  const BATCH_SIZE = 50;  // BGG thing API limit per request
  const PAGE_DELAY = 1500;
  const BATCH_DELAY = 2000;

  // Step 1: Collect IDs from browse pages
  console.log("=== Step 1: Collecting game IDs from BGG browse pages ===");
  const allIds = [];
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    process.stdout.write(`  Page ${page}/${TOTAL_PAGES}... `);
    try {
      const ids = await getPageIds(page);
      allIds.push(...ids);
      console.log(`${ids.length} IDs found (total: ${allIds.length})`);
    } catch (e) {
      console.error(`FAILED: ${e.message}`);
    }
    if (page < TOTAL_PAGES) await sleep(PAGE_DELAY);
  }

  const uniqueIds = [...new Set(allIds)];
  console.log(`\nTotal unique IDs: ${uniqueIds.length}`);

  // Step 2: Fetch details in batches
  console.log("\n=== Step 2: Fetching game details from BGG XML API ===");
  const allGames = [];
  for (let i = 0; i < uniqueIds.length; i += BATCH_SIZE) {
    const batch = uniqueIds.slice(i, i + BATCH_SIZE);
    const end = Math.min(i + BATCH_SIZE, uniqueIds.length);
    process.stdout.write(`  Games ${i + 1}–${end}/${uniqueIds.length}... `);
    try {
      const games = await getGameDetails(batch);
      allGames.push(...games);
      console.log(`OK (${games.length} parsed)`);
    } catch (e) {
      console.error(`FAILED: ${e.message}`);
    }
    if (i + BATCH_SIZE < uniqueIds.length) await sleep(BATCH_DELAY);
  }

  // Step 3: Sort and output
  allGames.sort((a, b) => a.rank - b.rank);

  const output = allGames.map((g) => ({
    name: g.nameKo || g.nameEn,   // Korean if available, else English (user fills in Korean later)
    name_en: g.nameEn,
    name_ko: g.nameKo,            // null if not found on BGG
    name_de: null,
    icon: g.icon,
    bgg_rank: g.rank,
    year: g.year,
  }));

  const outPath = "scripts/bgg-top2000.json";
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");

  const withKorean = output.filter((g) => g.name_ko).length;
  console.log(`\n=== Done! ===`);
  console.log(`Total games:       ${output.length}`);
  console.log(`With Korean name:  ${withKorean}`);
  console.log(`Without Korean:    ${output.length - withKorean} (fill in manually)`);
  console.log(`Output:            ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
